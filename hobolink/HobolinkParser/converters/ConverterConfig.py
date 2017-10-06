from HourlyConverter import HourlyConverter
from DateTimeConverter import DateTimeConverter
from PressureConverter import PressureConverter
from SolarRadiationConverter import SolarRadiationConverter

DATATYPE_TO_CONVERTER = {
    'atmospheric_station_pressure': PressureConverter,
    'dry_bulb_temperature': HourlyConverter,
    'relative_humidity': HourlyConverter,
    'dew_point_temperature': HourlyConverter,
    'wind_speed': HourlyConverter,
    'date': DateTimeConverter,
    'direct_normal_radiation': SolarRadiationConverter
}

def get_converter(data_type):
    return DATATYPE_TO_CONVERTER.get(data_type)


DATATYPE_TO_EPW_COLUMN = {
    'atmospheric_station_pressure': 9,
    'dry_bulb_temperature': 6,
    'relative_humidity': 8,
    'dew_point_temperature': 7,
    'wind_direction': 20,
    'wind_speed': 21,
    'date': ['year', 'month', 'day', 'hour', 'minute'],
    'year': 0,
    'month': 1,
    'day': 2,
    'hour': 3,
    'minute': 4,
    'direct_normal_radiation': ['dir_norm_irrad', 'dif_hor_irrad'],
    'dir_norm_irrad': 14,
    'dif_hor_irrad': 15
}

def get_epw_column(data_type):
    return DATATYPE_TO_EPW_COLUMN.get(data_type)


EPW_NULL_INPUTS = {
    'dry_bulb_temperature': 99.9,
    'dew_point_temperature': 99.9,
    'relative_humidity': 999,
    'atmospheric_station_pressure': 999999,
    'extraterrestrial_horizontal_radiation': 9999,
    'extraterrestrial_direct_normal_radiation': 9999,
    'horizontal_infrared_radiation_intensity': 9999
}

def get_epw_null_value(epw_header):
    return EPW_NULL_INPUTS.get(epw_header, '')

# ['year', 'month', 'day', 'hour', 'minute', 'data_source', 'dry_bulb_temperature', 'dew_point_temperature', 'relative_humidity', 'atmospheric_station_pressure', 'extraterrestrial_horizontal_radiation', 'extraterrestrial_direct_normal_radiation', 'horizontal_infrared_radiation_intensity', 'global_horizontal_radiation', 'direct_normal_radiation', 'diffuse_horizontal_radiation', 'global_horizontal_illuminance', 'direct_normal_illuminance', 'diffuse_horizontal_illuminance', 'zenith_luminance', 'wind_direction', 'wind_speed', 'total_sky_cover', 'opaque_sky_cover', 'visibility', 'ceiling_height', 'present_weather_observation', 'present_weather_codes', 'precipitable_water', 'aerosol_optical_depth', 'snow_depth', 'days_since_last_snowfall', 'albedo', 'liquid_precipitation_depth', 'liquid_precipitation_quantity']
