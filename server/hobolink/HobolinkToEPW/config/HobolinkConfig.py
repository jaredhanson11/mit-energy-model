import os
import sys
from datetime import datetime

from HobolinkWindConverter import HobolinkWindConverter
from HobolinkStandardConverter import HobolinkStandardConverter
from HobolinkDateConverter import HobolinkDateConverter

HOBOLINK_CONVERTERS = [
    HobolinkDateConverter,
    HobolinkStandardConverter,
    HobolinkWindConverter
]

def get_hobolink_converters():
    return [ converter for converter in HOBOLINK_CONVERTERS ]


HOBOLINK_DATE_FORMATS = [
    '%m/%d/%y %H:%M:%S',
    '%m/%d/%y %H:%M'
]

def dt_from_hobolink_str(hobolink_dt_str):
    for _format in HOBOLINK_DATE_FORMATS:
        try:
            return datetime.strptime(hobolink_dt_str, _format)
        except:
            continue
    raise ValueError(hobolink_dt_str + ' could not be converted to dt object')
