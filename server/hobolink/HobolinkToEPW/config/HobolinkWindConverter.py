import os
import sys

from HobolinkBaseConverter import HobolinkBaseConverter
import CommonConfig

HOBOLINK_HEADERS = {
    'wind_direction': 'Wind Direction (S-WDA 10290124:10260440-1), *, Building 1 roof',
    'wind_speed': [
        'Wind Speed (S-WSA 10290124:10260479-1), m/s, Building 1 roof',
        'Wind Speed (S-WSB 10290124:20214879-1), m/s, Building 1 roof'
    ]
}

DATA_TEMPLATE = {
    'wind_direction': CommonConfig.UNIVERSAL_NULL_VALUE,
    'wind_speed': CommonConfig.UNIVERSAL_NULL_VALUE
}

class HobolinkWindConverter(HobolinkBaseConverter):

    @classmethod
    def get_data(clz, row):
        speed = clz.get_wind_speed(row)
        direction = clz.get_wind_direction(row)
        row_data = {
            'wind_speed': speed,
            'wind_direction': direction
        }
        return row_data


    @classmethod
    def get_wind_direction(clz, row):
        header = HOBOLINK_HEADERS['wind_direction']
        val = clz.get_float(row[header])
        return val

    @classmethod
    def get_wind_speed(clz, row):
        for header in HOBOLINK_HEADERS['wind_speed']:
            val = row[header]
            if not clz.is_null(val):
                return clz.get_float(val)
        return CommonConfig.UNIVERSAL_NULL_VALUE

    @classmethod
    def is_null(clz, val):
        if val == '-888.88':
            return True
        return super(HobolinkWindConverter, clz).is_null(val)
