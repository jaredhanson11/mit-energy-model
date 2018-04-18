from HoboLinkConverter import HoboLinkConverter
from HourlyConverter import HourlyConverter

from RadiationSplit import RadiationSplit

class SolarRadiationConverter(HoboLinkConverter):

    LATITUDE = 42.359221
    LONGITUDE = -71.093003

    def convert(self):
        splits = {}
        for d_type in self.get_epw_column():
            splits[d_type] = []

        for i in range(len(self.input_values)):
            splitter = RadiationSplit(self.datetime_values[i], self.input_values[i], self.LATITUDE, self.LONGITUDE)
            split = splitter.split_radiation()
            print split, ' split -ad'
            for _s in split:
                splits[_s].append(split[_s])

        conversions = {}
        for _split in splits:
            converter = HourlyConverter(_split, splits[_split], self.datetime_values)
            conversions.update(converter.convert())

        return conversions


