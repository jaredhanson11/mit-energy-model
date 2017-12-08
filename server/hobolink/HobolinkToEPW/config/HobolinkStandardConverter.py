import os
import sys

from HobolinkBaseConverter import HobolinkBaseConverter
import CommonConfig

DATATYPE_TO_HOBOLINK_HEADER = {
    'solar_radiation': 'Solar Radiation (S-LIB 10290124:2375831-1), W/m^2, Building 1 roof',
    'atmospheric_station_pressure': 'Pressure (S-BPB 10290124:10236707-1), mbar, Building 1 roof',
    'dry_bulb_temperature': 'Temperature (S-THB 10290124:10268927-1), *C, Building 1 roof',
    'relative_humidity': 'RH (S-THB 10290124:10268927-2), %, Building 1 roof',
    'dew_point_temperature': 'Dew Point (S-THB 10290124:10268927-3), *C, Building 1 roof'

}


class HobolinkStandardConverter(HobolinkBaseConverter):

    @classmethod
    def get_data(clz, row):
        hobolink_data = {}
        for datatype in DATATYPE_TO_HOBOLINK_HEADER:
            header = DATATYPE_TO_HOBOLINK_HEADER[datatype]
            val_str = row.get(header)
            val = clz.get_float(val_str)
            hobolink_data[datatype] = val
        return hobolink_data


