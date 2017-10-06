from HoboLinkConverter import HoboLinkConverter
from HourlyConverter import HourlyConverter

class PressureConverter(HoboLinkConverter):

    CONVERSION_MULTIPLIER = 100 # 1 millibar = 100 pascals

    def convert(self):
        input_values = map(lambda val: float(val.replace(',','')) * self.CONVERSION_MULTIPLIER, self.input_values)
        _converter = HourlyConverter(self.data_type, input_values, self.datetime_values)
        return _converter.convert()

