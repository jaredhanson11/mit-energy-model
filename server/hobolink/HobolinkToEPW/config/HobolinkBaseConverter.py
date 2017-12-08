import os
import sys

import HobolinkConfig, CommonConfig

class HobolinkBaseConverter(object):

    @classmethod
    def get_data(clz, row):
        pass

    @classmethod
    def is_null(clz, val):
        if type(val) == str:
            val = val.strip()
        if val == '' or val == CommonConfig.UNIVERSAL_NULL_VALUE:
            return True
        return False

    @classmethod
    def get_float(clz, val):
        if clz.is_null(val):
            return CommonConfig.UNIVERSAL_NULL_VALUE
        if type(val) == str and ',' in val:
            val = val.replace(',', '')
        return float(val)
