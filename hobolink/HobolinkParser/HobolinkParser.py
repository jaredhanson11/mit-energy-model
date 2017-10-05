import sys
import os
from datetime import datetime
import csv

import pandas as pd
from functools import reduce

from converters import ConverterFactory


class HobolinkParser:
    '''Handles downloading and saving hobolink daily data.
    '''

    ## Constants
    NUM_EPW_INPUTS = 35

    HOBOLINK_HEADERS_MAPPING = {
        'Date': 'date',
        'Solar Radiation (S-LIB 10290124:2375831-1), W/m^2, Building 1 roof': 'direct_normal_radiation',
        'Pressure (S-BPB 10290124:10236707-1), mbar, Building 1 roof': 'atmospheric_station_pressure',
        'Wind Direction (S-WDA 10290124:10260440-1), *, Building 1 roof': 'wind_direction',
        'Temperature (S-THB 10290124:10268927-1), *C, Building 1 roof': 'dry_bulb_temperature',
        'RH (S-THB 10290124:10268927-2), %, Building 1 roof': 'relative_humidity',
        'Dew Point (S-THB 10290124:10268927-3), *C, Building 1 roof': 'dew_point_temperature',
        'Wind Speed (S-WSB 10290124:20214879-1), m/s, Building 1 roof': 'wind_speed'
    }

    def __init__(self, input_path, master_path):
        self.input_path = input_path
        self.master_path = master_path

    def update_master(self):
        epw_values = self._get_converted_values(input_csv)
        self._append_to_master(epw_values)

    ### Privates

    def _get_converted_values(self, input_csv):

        epw_values = {}

        input_csv = pd.read_csv(input_file)
        datetime_values = list(input_csv['Date'].values)
        headers = list(input_csv)
        for header in headers:
            if header not in self.HOBOLINK_HEADERS_MAPPING:
                continue

            input_values = list(input_csv[header].values)
            data_type = self.HOBOLINK_HEADERS_MAPPING[header]
            converted_values = self._convert_input(data_type, input_values, datetime_values)

            for epw_header in converted_values:
                assert(epw_header not in epw_values)
                assert(len(converted_values[epw_header]) == 24)
                epw_values[epw_header] = converted_values[epw_header]

        return epw_values

    def _convert_input(self, data_type, input_values, datetime_values):
        converter_type = ConverterFactory.get_converter(data_type)
        converter = converter_type(data_type, input_values, datetime_values)
        return converter.convert()

    def _append_to_master(self, epw_values):
        rows_to_append = []
        for hour in range(24):
            row = []
            for col_index in range(NUM_EPW_INPUTS):
                if col_index not in epw_values:
                    row.append(self._get_null_value(col_index)) # get null value per column
                    continue
                else:
                    row.append(str(epw_values[col_index][hour]))
            rows_to_append.append(row)

        master_file = open(self.master_path, 'a')
        master_csv = csv.writer(master_file)
        master_csv.writerows(rows_to_append)
        master_file.close()

    def _get_null_value(epw_column):
        return ''

#io_mapping = {
#    7 : 6,  #temperature
#    9 : 7,  #dew point
#    8 : 8,  #rh
#    5 : 9,  #pressure
#    6 : 20  #wind direction
#}
