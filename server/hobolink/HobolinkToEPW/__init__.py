import os
import csv
from datetime import datetime, timedelta

from HobolinkInterface import HobolinkInterface
from EPWInterface import EPWInterface
from config.EPWModels import EPWModel
from config import EPWConfig

class HobolinkToEPW:

    def hobolink_to_epw(self, input_path):
        if not os.path.isfile(input_path):
            raise ValueError('Invalid argument, no file exists at ' + input_path)
        hobolink_interface = HobolinkInterface(input_path)
        hours_split = hobolink_interface.split_hours()
        EPWInterface.update_epw_db(hours_split)

    def generate_epw(self, output_path):
        epw_records = self._get_epw_records()
        epw_records = self._validate_epw_records(epw_records)
        self._write_epw(epw_records, output_path)

    ### Privates ###

    def _get_epw_records(self):
        yesterday = datetime.now() - timedelta(days=1)
        last_year = yesterday - timedelta(days=365)

        records = EPWModel.select().where(EPWModel.datetime >= last_year).\
                order_by(EPWModel.day_of_year.asc()).execute()
        return map(lambda rec: rec.get_epw_row(), list(records))


    def _validate_epw_records(self, epw_records):
        dt_to_index = {}
        for i, rec in enumerate(epw_records):
            dt = datetime(rec[0], rec[1], rec[2], rec[3] - 1, rec[4]) # Subrtract 1 from hour for index 0
            dt_to_index[dt.strftime('%m-%d:%H:%M')] = i

        validated_records = []

        jan_1 = datetime(year=datetime.now().year, month=1, day=1, hour=0, minute=0)
        dec_31 = datetime(year=datetime.now().year, month=12, day=31, hour=23, minute=0)
        hour = timedelta(hours=1)

        current = jan_1
        index = 0

        while current <= dec_31:
            if current.strftime('%m-%d:%H:%M') not in dt_to_index:
                backfill_data = self._backfill_missing_data(current)
                if backfill_data:
                    validated_records.append(backfill_data.get_epw_row())
                else:
                    print 'Missing data for %s, replacing with data from %s' % (current.strftime('%m-%d:%H:%M'), (current - hour).strftime('%m-%d:%H:%M'))
                    missing_row = [current.year, current.month, current.day, current.hour + 1, current.minute]

                    for val in validated_records[-1][5:]: # Num EPW inputs - datetime inputs
                        missing_row.append(val)
                    validated_records.append(missing_row)
            else:
                index = dt_to_index[current.strftime('%m-%d:%H:%M')]
                validated_records.append(epw_records[index])
            current += hour
        return validated_records

    def _backfill_missing_data(self, dt_obj):
        record = EPWModel.select().where((EPWModel.month == dt_obj.month)
                & (EPWModel.day == dt_obj.day) & (EPWModel.hour == dt_obj.hour)).order_by(EPWModel.year.desc()).first()
        return record

    def _write_epw(self, epw_records, output_path):
        output_file = open(output_path, 'w')
        output_file.writelines(open(EPWConfig.epw_file_header()))
        csv_writer = csv.writer(output_file)
        csv_writer.writerows(epw_records)


