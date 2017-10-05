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
    headers = ['Year', 'Month', 'Day', 'Hour', 'Minute', 'Data Source and Uncertainty Flags', 'Dry Bulb Temperature', 'Dew Point Temperature', 'Relative Humidity', 'Atmospheric Station Pressure', 'Extraterrestrial Horizontal Radiation', 'Extraterrestrial Direct Normal Radiation', 'Horizontal Infrared Radiation Intensity', 'Global Horizontal Radiation', 'Direct Normal Radiation', 'Diffuse Horizontal Radiation', 'Global Horizontal Illuminance', 'Direct Normal Illuminance', 'Diffuse Horizontal Illuminance', 'Zenith Luminance', 'Wind Direction', 'Wind Speed', 'Total Sky Cover', 'Opaque Sky Cover', 'Visibility', 'Ceiling Height', 'Present Weather Observation', 'Present Weather Codes', 'Precipitable Water', 'Aerosol Optical Depth', 'Snow Depth', 'Days Since Last Snowfall', 'Albedo', 'Liquid Precipitation Depth', 'Liquid Precipitation Quantity']
    w.writerow(headers)
    f.close()

if len(sys.argv) > 1:
    if sys.argv[1] == '-n':
        new_master()

parser = HobolinkParser(input_path, output_path)
parser.update_master()

