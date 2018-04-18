import os
from datetime import datetime as dt
import peewee

from converters import ConverterConfig as HobolinkConfig

path_to_db = os.path.join(
    os.path.dirname(os.path.realpath(__file__)),
    '../data/epw/WeatherDataEPW.db'
)

db = peewee.SqliteDatabase(path_to_db)

class EPWModel(peewee.Model):

    datetime = peewee.DateTimeField(unique=True)
    day_of_year = peewee.FloatField()
    created = peewee.DateTimeField(constraints=[peewee.SQL("DEFAULT (datetime('now'))")])
    year = peewee.IntegerField()
    month = peewee.IntegerField()
    day = peewee.IntegerField()
    hour = peewee.IntegerField()
    minute = peewee.IntegerField()

    data_source = peewee.CharField(null=True)
    dry_bulb_temperature = peewee.FloatField(null=True)
    dew_point_temperature = peewee.FloatField(null=True)
    relative_humidity = peewee.FloatField(null=True)
    atmospheric_station_pressure = peewee.FloatField(null=True)
    extraterrestrial_horizontal_radiation = peewee.FloatField(null=True)
    extraterrestrial_direct_normal_radiation = peewee.FloatField(null=True)
    horizontal_infrared_radiation_intensity = peewee.FloatField(null=True)
    global_horizontal_radiation = peewee.FloatField(null=True)
    direct_normal_radiation = peewee.FloatField(null=True)
    diffuse_horizontal_radiation = peewee.FloatField(null=True)
    global_horizontal_illuminance = peewee.FloatField(null=True)
    direct_normal_illuminance = peewee.FloatField(null=True)
    diffuse_horizontal_illuminance = peewee.FloatField(null=True)
    zenith_luminance = peewee.FloatField(null=True)
    wind_direction = peewee.FloatField(null=True)
    wind_speed = peewee.FloatField(null=True)
    total_sky_cover = peewee.FloatField(null=True)
    opaque_sky_cover = peewee.FloatField(null=True)
    visibility = peewee.FloatField(null=True)
    ceiling_height = peewee.FloatField(null=True)
    present_weather_observation = peewee.FloatField(null=True)
    present_weather_codes = peewee.FloatField(null=True)
    precipitable_water = peewee.FloatField(null=True)
    aerosol_optical_depth = peewee.FloatField(null=True)
    snow_depth = peewee.FloatField(null=True)
    days_since_last_snowfall = peewee.FloatField(null=True)
    albedo = peewee.FloatField(null=True)
    liquid_precipitation_depth = peewee.FloatField(null=True)
    liquid_precipitation_quantity = peewee.FloatField(null=True)

    @staticmethod
    def init_record(**kwargs):
        record_dt = dt(year=kwargs['year'], month=kwargs['month'], day=kwargs['day'], hour=kwargs['hour'], minute=kwargs['minute'])
        kwargs['datetime'] = record_dt
        kwargs['day_of_year'] = record_dt.timetuple().tm_yday + (record_dt.hour * .01)
        datetime_headers = ['year', 'month', 'day', 'hour', 'minute']
        epw_headers = HobolinkConfig.get_epw_headers()
        for header in kwargs:
            value = HobolinkConfig.get_epw_value(header, kwargs[header])
            kwargs[header] = value
        return EPW_Record(**kwargs)

    def get_epw_row(self):
        epw_row = []
        epw_headers = HobolinkConfig.get_epw_headers()
        for header in epw_headers:
            epw_value = getattr(self, header)
            if epw_value == None:
                epw_value = HobolinkConfig.get_epw_null_value(header)
            epw_row.append(epw_value)
        return epw_row


    class Meta:
        database = db
