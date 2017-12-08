import os
from datetime import datetime
import csv

from config import HobolinkConfig, CommonConfig

class HobolinkInterface:
    def __init__(self, hobolink_file_path):
        if not os.path.isfile(hobolink_file_path):
            raise ValueError('Invalid argument, no file exists at ' + input_path)
        _file = open(hobolink_file_path)
        self.hobolink_data = csv.DictReader(_file, delimiter=',')

    def split_hours(self):
        '''
        Seperates hobolink data by hour.

        Returns:
            {
                hour: [
                    {row_data},
                    ...
                ],
                ...
            }
        '''
        hobolink_by_hour = {}
        for hobolink_row in self.hobolink_data:
            hobolink_row_data = HobolinkInterface.get_row_data(hobolink_row)
            dt_str = hobolink_row_data['datetime']
            if dt_str not in hobolink_by_hour:
                hobolink_by_hour[dt_str] = []
            hobolink_by_hour[dt_str].append(hobolink_row_data)
        return hobolink_by_hour


    @staticmethod
    def get_row_data(row):
        '''
        Gets all relevant data from hobolink row.

        Notes:
            Accounts for wind speed pontentially coming from one of two sensors

        Input:
            row (dict) - DictReader row object for the row in question.
        Returns:
            dict - {
            }
        '''
        row_data = {}
        for hobolink_converter in HobolinkConfig.get_hobolink_converters():
            row_data.update(hobolink_converter.get_data(row))
        return row_data
