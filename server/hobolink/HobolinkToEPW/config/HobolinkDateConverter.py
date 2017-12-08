import os
import sys

from HobolinkBaseConverter import HobolinkBaseConverter
import CommonConfig, HobolinkConfig

HOBOLINK_HEADER = 'Date'

DATA_TEMPLATE = {
    'year': CommonConfig.UNIVERSAL_NULL_VALUE,
    'month': CommonConfig.UNIVERSAL_NULL_VALUE,
    'day': CommonConfig.UNIVERSAL_NULL_VALUE,
    'hour': CommonConfig.UNIVERSAL_NULL_VALUE,
    'minute': CommonConfig.UNIVERSAL_NULL_VALUE,
    'datetime': CommonConfig.UNIVERSAL_NULL_VALUE
}

class HobolinkDateConverter(HobolinkBaseConverter):

    @classmethod
    def get_data(clz, row):
        date_str = row[HOBOLINK_HEADER]
        dt = HobolinkConfig.dt_from_hobolink_str(date_str)
        datetime_data = { key: DATA_TEMPLATE[key] for key in DATA_TEMPLATE }
        datetime_data.update({
            'year': dt.year,
            'month': dt.month,
            'day': dt.day,
            'hour': dt.hour,
            'minute': dt.minute,
            'datetime': CommonConfig.dt_to_str_dt(dt)
        })
        return datetime_data
