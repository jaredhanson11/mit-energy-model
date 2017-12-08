from EPWDatetimeConverter import EPWDatetimeConverter
from EPWWindDirectionConverter import EPWWindDirectionConverter
from EPWSolarRadiationConverter import EPWSolarRadiationConverter
from EPWPressureConverter import EPWPressureConverter
from EPWStandardConverter import EPWStandardConverter

HOBOLINK_TO_EPW_DATA_CONVERTERS = [
    EPWDatetimeConverter, # year, month, day, hour, minute
    EPWStandardConverter, # relative_humidity, dry_bulb_temperature, dew_point_temperature, wind_speed
    EPWWindDirectionConverter, # wind_direction
    EPWSolarRadiationConverter, # direct_normal_radiation, diffuse_horzizontal_radiation
    EPWPressureConverter, # atmospheric_station_pressure
]

def get_hobolink_converters():
    '''Gets the objects that pull EPW Specific data from hobolink data.'''
    return [ converter for converter in HOBOLINK_TO_EPW_DATA_CONVERTERS ]

EPW_HEADERS = [
    'year',
    'month',
    'day',
    'hour',
    'minute',
    'data_source',
    'dry_bulb_temperature',
    'dew_point_temperature',
    'relative_humidity',
    'atmospheric_station_pressure',
    'extraterrestrial_horizontal_radiation',
    'extraterrestrial_direct_normal_radiation',
    'horizontal_infrared_radiation_intensity',
    'global_horizontal_radiation',
    'direct_normal_radiation',
    'diffuse_horizontal_radiation',
    'global_horizontal_illuminance',
    'direct_normal_illuminance',
    'diffuse_horizontal_illuminance',
    'zenith_luminance',
    'wind_direction',
    'wind_speed',
    'total_sky_cover',
    'opaque_sky_cover',
    'visibility',
    'ceiling_height',
    'present_weather_observation',
    'present_weather_codes',
    'precipitable_water',
    'aerosol_optical_depth',
    'snow_depth',
    'days_since_last_snowfall',
    'albedo',
    'liquid_precipitation_depth',
    'liquid_precipitation_quantity'
]

def get_epw_headers():
    return [header for header in EPW_HEADERS]


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
