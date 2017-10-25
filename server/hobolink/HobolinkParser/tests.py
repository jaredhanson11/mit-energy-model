import os
import sys

from HobolinkParser import HobolinkParser

input_path = './tests/weather1.csv'
output_path = './tests/Building_1_Weather_Station_EPW.csv'
input_path = os.path.join(os.path.dirname(__file__), input_path)
output_path = os.path.join(os.path.dirname(__file__), output_path)

def new_master():
    f = open(output_path, 'w')
    import csv
    w = csv.writer(f)
    headers = ['year', 'month', 'day', 'hour', 'minute', 'data_source', 'dry_bulb_temperature', 'dew_point_temperature', 'relative_humidity', 'atmospheric_station_pressure', 'extraterrestrial_horizontal_radiation', 'extraterrestrial_direct_normal_radiation', 'horizontal_infrared_radiation_intensity', 'global_horizontal_radiation', 'direct_normal_radiation', 'diffuse_horizontal_radiation', 'global_horizontal_illuminance', 'direct_normal_illuminance', 'diffuse_horizontal_illuminance', 'zenith_luminance', 'wind_direction', 'wind_speed', 'total_sky_cover', 'opaque_sky_cover', 'visibility', 'ceiling_height', 'present_weather_observation', 'present_weather_codes', 'precipitable_water', 'aerosol_optical_depth', 'snow_depth', 'days_since_last_snowfall', 'albedo', 'liquid_precipitation_depth', 'liquid_precipitation_quantity']
    w.writerow(headers)
    f.close()

if len(sys.argv) > 1:
    if sys.argv[1] == '-n':
        new_master()

parser = HobolinkParser(input_path, output_path)
parser.update_master()

