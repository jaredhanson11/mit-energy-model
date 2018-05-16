from ZoneMultiplierModel import ZoneMultiplierModel

class ZoneMultiplierInterface:
    """
    Handles zone_multipliers needed to convert EnergyPlus simulations
    to full building scale.
    """

    @staticmethod
    def get_multipliers(building_num):
        zone_multipliers = ZoneMultiplierModel.get_building_multipliers(building_num)
        if not zone_multipliers:
            print 'No zone multipliers for %s' % building_num
        else:
            return zone_multipliers

    @staticmethod
    def get_zone(eplusout_header):
        zone = eplusout_header.split(':', 1)[0].split()[-1].lower()
        print eplusout_header, "=", zone
        return zone

    @staticmethod
    def add_multiplier(building_number, zone, multiplier):
        ZoneMultiplierModel.add_multiplier(building_number, zone, multiplier)



