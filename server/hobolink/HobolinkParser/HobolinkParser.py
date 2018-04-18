import sys
import os
from datetime import datetime, timedelta
import csv

import pandas as pd
import numpy as np
from functools import reduce
from peewee import IntegrityError

from converters import ConverterConfig

from EPWModels import EPWModel

class HobolinkParser:
    '''Handles downloading and saving hobolink daily data.
    '''

    ## Constants
    NUM_EPW_INPUTS = 35

    HOBOLINK_HEADERS_MAPPING = {
        'Date': 'date',
        'Solar Radiation (S-LIB 10290124:2375831-1), W/m^2, Building 1 roof': 'solar_radiation',
        'Pressure (S-BPB 10290124:10236707-1), mbar, Building 1 roof': 'atmospheric_station_pressure',
        'Wind Direction (S-WDA 10290124:10260440-1), *, Building 1 roof': 'wind_direction',
        'Temperature (S-THB 10290124:10268927-1), *C, Building 1 roof': 'dry_bulb_temperature',
        'RH (S-THB 10290124:10268927-2), %, Building 1 roof': 'relative_humidity',
        'Dew Point (S-THB 10290124:10268927-3), *C, Building 1 roof': 'dew_point_temperature',
        'Wind Speed (S-WSB 10290124:20214879-1), m/s, Building 1 roof': 'wind_speed',
        'Wind Speed (S-WSA 10290124:10260479-1), m/s, Building 1 roof': 'wind_speed'
    }

    def __init__(self):
        self.epw_headers = ConverterConfig.get_epw_headers()

    def update_master(self, input_path):
        self.input_path = input_path
        epw_values = self._get_converted_values()
        self._add_to_master(epw_values)

    def generate_epw(self, output_path):
        self.output_path = output_path
        epw_records = self._get_epw_records()
        epw_records = self._validate_epw_records(epw_records)
        self._write_epw(epw_records)

    ### Privates

    def _get_epw_records(self):
        today = datetime.now()
        last_year = today - timedelta(days=365)

        records = EPWModel.select().where(EPWModel.datetime >= last_year).\
                order_by(EPWModel.day_of_year.asc()).execute()
        return map(lambda rec: rec.get_epw_row(), list(records))

    def _validate_epw_records(self, epw_records):
        dt_to_index = {}
        for i, rec in enumerate(epw_records):
            dt = datetime(rec[0], rec[1], rec[2], rec[3], rec[4])
            dt_to_index[dt.strftime('%m-%d:%H:%M')] = i

        validated_records = []

        jan_1 = datetime(year=datetime.now().year, month=1, day=1, hour=0, minute=0)
        dec_31 = datetime(year=datetime.now().year, month=12, day=31, hour=23, minute=0)
        hour = timedelta(hours=1)

        current = jan_1
        index = 0

        while current <= dec_31:
            if current.strftime('%m-%d:%H:%M') not in dt_to_index:
                backfill = self._backfill_missing_data(current)
                if not backfill:
                    missing_row = [current.year, current.month, current.day, current.hour, current.minute]
                    for header in self.epw_headers[5:]: # Num EPW inputs - datetime inputs
                        missing_row.append('n/a')
                    validated_records.append(missing_row)
                else:
                    print backfill
                    print current
                    print backfill.get_epw_row()
                    validated_records.append(backfill.get_epw_row())
            else:
                index = dt_to_index[current.strftime('%m-%d:%H:%M')]
                validated_records.append(epw_records[index])
            current += hour
        return validated_records

    def _backfill_missing_data(self, dt_obj):
        record = EPWModel.select().where((EPWModel.month == dt_obj.month)
                & (EPWModel.day == dt_obj.day) & (EPWModel.hour == dt_obj.hour)).order_by(EPWModel.year.desc()).first()
        return record

    def _write_epw(self, epw_records):
        csv_writer = csv.writer(open(self.output_path, 'w'))
        csv_writer.writerow(self.epw_headers)
        csv_writer.writerows(epw_records)


    def _get_converted_values(self):

        epw_values = {}

        input_csv = pd.read_csv(self.input_path)
        try:
            datetime_values = map(lambda dt: datetime.strptime(dt, '%m/%d/%y %H:%M:%S'), list(input_csv['Date'].values))
        except ValueError:
            datetime_values = map(lambda dt: datetime.strptime(dt, '%m/%d/%y %H:%M'), list(input_csv['Date'].values))
        headers = list(input_csv)
        for header in headers:
            if header not in self.HOBOLINK_HEADERS_MAPPING:
                continue
            data_type = self.HOBOLINK_HEADERS_MAPPING[header]

            if ConverterConfig.is_wind_direction(data_type):
                w_speed = ConverterConfig.get_wind_speed_inputs(input_csv)
                w_direction = ConverterConfig.get_input_values(list(input_csv[header].values))
                input_vals = [w_direction, w_speed]
                converted_values = self._convert_input(data_type, input_vals, katetime_values)
            elif ConverterConfig.is_wind_speed(data_type):
                w_speed = ConverterConfig.get_wind_speed_inputs(input_csv)
                converted_values = self._convert_input(data_type, w_speed, datetime_values)
            else:
                input_values = list(input_csv[header].values)
                input_values = ConverterConfig.get_input_values(input_values)
                converted_values = self._convert_input(data_type, input_values, datetime_values)

            for epw_header in converted_values:
                if epw_header not in epw_values:
                    assert(epw_header not in epw_values)
                if len(converted_values[epw_header]) != 24:
                    print '%s did not contain 24 hours of data' % (self.input_path)
                epw_values[epw_header] = converted_values[epw_header]

        return epw_values

    def _convert_input(self, data_type, input_values, datetime_values):
        converter_type = ConverterConfig.get_converter(data_type)
        converter = converter_type(data_type, input_values, datetime_values)
        return converter.convert()

    def _add_to_master(self, epw_values):
        rows_to_append = []
        for hour in range(len(epw_values['year'])): ## EPW values of year index
            kwargs = {}
            for header in epw_values:
                converted_value = epw_values[header][hour]
                if np.isnan(converted_value):
                    continue
                kwargs[header] = converted_value
            new_epw_record = EPWModel.init_record(**kwargs)
            try:
                new_epw_record.save()
            except IntegrityError, e:
                print 'Record already exists: ' + str(new_epw_record.datetime)
                continue
            print 'Saved: ' + str(new_epw_record.datetime)
