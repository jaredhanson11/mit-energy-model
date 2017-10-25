import os

from peewee import Model, SqliteDatabase, CharField, IntegerField, FloatField

path_to_db = os.path.join(
    os.path.dirname(os.path.realpath(__file__)),
    '../data/epw/building_1_weather_data.db'
)

db = SqliteDatabase(path_to_db)

class EPW_Record(Model):
    year = IntegerField()
    month = IntegerField()
    day = IntegerField()
    minute = IntegerField()

    data_source = CharField()
    dry_bulb_temperature = FloatField()
    dew_point_temperature = FloatField()
    relative_humidity = FloatField()
    atmospheric_station_pressure = FloatField()
    extraterrestrial_horizontal_radiation = FloatField()
    extraterrestrial_direct_normal_radiation = FloatField()
    horizontal_infrared_radiation_intensity = FloatField()
    global_horizontal_radiation = FloatField()
    direct_normal_radiation = FloatField()
    diffuse_horizontal_radiation = FloatField()
    global_horizontal_illuminance = FloatField()
    direct_normal_illuminance = FloatField()
    diffuse_horizontal_illuminance = FloatField()
    zenith_luminance = FloatField()
    wind_direction = FloatField()
    wind_speed = FloatField()
    total_sky_cover = FloatField()
    opaque_sky_cover = FloatField()
    visibility = FloatField()
    ceiling_height = FloatField()
    present_weather_observation = FloatField()
    present_weather_codes = FloatField()
    precipitable_water = FloatField()
    aerosol_optical_depth = FloatField()
    snow_depth = FloatField()
    days_since_last_snowfall = FloatField()
    albedo = FloatField()
    liquid_precipitation_depth = FloatField()
    liquid_precipitation_quantity = FloatField()


    class Meta:
        database = db
