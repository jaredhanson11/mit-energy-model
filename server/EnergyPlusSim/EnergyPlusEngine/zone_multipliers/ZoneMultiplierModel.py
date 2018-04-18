import os
import peewee

path_to_db = os.path.join(
    os.path.dirname(os.path.realpath(__file__)),
    'zone_multiplier.db'
)

db = peewee.SqliteDatabase(path_to_db)

class ZoneMultiplierModel(peewee.Model):
    id = peewee.PrimaryKeyField()
    multiplier = peewee.FloatField()
    zone = peewee.CharField()
    building_number = peewee.CharField()

    def change_multiplier(self, multiplier):
        if multiplier:
            self.multiplier = multiplier
            self.save()

    @staticmethod
    def exists(building_num, zone):
        record = ZoneMultiplierModel.select().where(ZoneMultiplierModel.zone == zone
                & ZoneMultiplierModel.building_number==building_num)
        return record


    @staticmethod
    def add_multiplier(building_num, zone, multiplier):
        existing_multiplier = ZoneMultiplierModel.exists(building_num, zone)
        if existing_multiplier:
            existing_multiplier.change_multiplier(multiplier)
            existing_multiplier.save()
            print 'Updated existing multiplier for building number: %s, zone: %s' % (building_num, zone)
            return existing_multiplier
        else:
            zone_record = ZoneMultiplierModel(building_number=building_num,
                    zone=zone, multiplier=multiplier)
            zone_record.save()
            print 'Created new multiplier for building number: %s, zone: %s' % (building_num, zone)
            return zone_record

    @staticmethod
    def get_building_multipliers(building_num):
        multipliers = ZoneMultiplierModel.select().where(
                ZoneMultiplierModel.building_number == building_num)
        zone_multipliers = {}
        for multiplier in multipliers:
            zone_multipliers[multiplier.zone] = multiplier.multiplier
        return zone_multipliers

    class Meta:
        database = db
