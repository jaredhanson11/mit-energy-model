from HourlyConverter import HourlyConverter
from DateTimeConverter import DateTimeConverter
from PressureConverter import PressureConverter
from SolarRadiationConverter import SolarRadiationConverter
from WindDirectionConverter import WindDirectionConverter

DATATYPE_TO_CONVERTER = {
    'atmospheric_station_pressure': PressureConverter,
    'dry_bulb_temperature': HourlyConverter,
    'relative_humidity': HourlyConverter,
    'dew_point_temperature': HourlyConverter,
    'wind_speed': HourlyConverter,
    'date': DateTimeConverter,
    'direct_normal_radiation': SolarRadiationConverter,
    'wind_direction': WindDirectionConverter
}


def get_converter(data_type):
    return DATATYPE_TO_CONVERTER.get(data_type)


DATATYPE_TO_EPW_COLUMN = {
    'atmospheric_station_pressure': 'atmospheric_station_pressure',
    'dry_bulb_temperature': 'dry_bulb_temperature',
    'relative_humidity': 'relative_humidity',
    'dew_point_temperature': 'dew_point_temperature',
    'wind_direction': 'wind_direction',
    'wind_speed': 'wind_speed',
    'date': ['year', 'month', 'day', 'hour', 'minute'],
    'year': 'year',
    'month': 'month',
    'day': 'day',
    'hour': 'hour',
    'minute': 'minute',
    'direct_normal_radiation': ['dir_norm_irrad', 'dif_hor_irrad'],
    'dir_norm_irrad': 'dir_norm_irrad',
    'dif_hor_irrad': 'dif_hor_irrad'
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
    'horizontal_infrared_radiation_intensity': 9999,
    'global_horizontal_radiation': 9999,
    'direct_normal_radiation': 9999,
    'diffuse_horizontal_radiation': 9999,
    'global_horizontal_illuminance': 999999,
    'direct_normal_illuminance': 999999,
    'diffuse_horizontal_illuminance': 999999,
    'zenith_luminance': 9999,
    'wind_direction': 999,
    'wind_speed': 999,
    'total_sky_cover': 99,
    'opaque_sky_cover': 99,
    'visibility': 9999,
    'ceiling_height': 99999,
    'present_weather_observation': 9,
    'present_weather_codes': 999999999,
    'precipitable_weather': 999,
    'aerosol_optical_depth': 999,
    'snow_depth': 999,
    'days_since_last_snowfall': 99,
    'liquid_precipitation_depth': 1.5
}


def get_epw_null_value(epw_header):
    return EPW_NULL_INPUTS.get(epw_header, '')

EPW_HEADERS = ['year', 'month', 'day', 'hour', 'minute', 'data_source', 'dry_bulb_temperature', 'dew_point_temperature', 'relative_humidity', 'atmospheric_station_pressure', 'extraterrestrial_horizontal_radiation', 'extraterrestrial_direct_normal_radiation', 'horizontal_infrared_radiation_intensity', 'global_horizontal_radiation', 'direct_normal_radiation', 'diffuse_horizontal_radiation', 'global_horizontal_illuminance', 'direct_normal_illuminance', 'diffuse_horizontal_illuminance', 'zenith_luminance', 'wind_direction', 'wind_speed', 'total_sky_cover', 'opaque_sky_cover', 'visibility', 'ceiling_height', 'present_weather_observation', 'present_weather_codes', 'precipitable_water', 'aerosol_optical_depth', 'snow_depth', 'days_since_last_snowfall', 'albedo', 'liquid_precipitation_depth', 'liquid_precipitation_quantity']

def get_epw_headers():
    return [i for i in EPW_HEADERS]

EPW_DATA_TYPES = {
    float: ['dry_bulb_temperature', 'dew_point_temperature', 'relative_humidity', 'atmospheric_station_pressure', 'extraterrestrial_horizontal_radiation', 'extraterrestrial_direct_normal_radiation', 'horizontal_infrared_radiation_intensity', 'global_horizontal_radiation', 'direct_normal_radiation', 'diffuse_horizontal_radiation', 'global_horizontal_illuminance', 'direct_normal_illuminance', 'diffuse_horizontal_illuminance', 'zenith_luminance', 'wind_direction', 'wind_speed', 'total_sky_cover', 'opaque_sky_cover', 'visibility', 'ceiling_height', 'present_weather_observation', 'present_weather_codes', 'precipitable_water', 'aerosol_optical_depth', 'snow_depth', 'days_since_last_snowfall', 'albedo', 'liquid_precipitation_depth', 'liquid_precipitation_quantity'],
    int: ['year', 'month', 'day', 'hour', 'minute'],
    str: ['data_source']
}

def get_epw_value(header, value):
    for converter in EPW_DATA_TYPES:
        if header in EPW_DATA_TYPES[converter]:
            return converter(value)
    try:
        value = float(value)
    except ValueError:
        value = str(value)
    except TypeError:
        value = str(value)
    return value

INPUT_HEADER_COLUMNS = {
    'Wind Direction (S-WDA 10290124:10260440-1), *, Building 1 roof': ['Wind Direction (S-WDA 10290124:10260440-1), *, Building 1 roof', 'Wind Speed (S-WSB 10290124:20214879-1), m/s, Building 1 roof']
}

def inputs(header):
    return INPUT_HEADER_COLUMNS.get(header, [header])

def is_multiple_inputs(header):
    return len(inputs(header)) > 1
