from HourlyConverter import HourlyConverter

DATATYPE_TO_CONVERTER = {
    'atmospheric_station_pressure': HourlyConverter,
    'dry_bulb_temperature': HourlyConverter,
    'relative_humidity': HourlyConverter,
    'dew_point_temperature': HourlyConverter,
    'wind_speed': HourlyConverter
}

def get_converter(data_type):
    return DATATYPE_TO_CONVERTER.get(data_type)
