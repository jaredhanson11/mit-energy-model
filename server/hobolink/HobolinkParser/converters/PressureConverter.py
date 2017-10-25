from HoboLinkConverter import HoboLinkConverter
from HourlyConverter import HourlyConverter

class PressureConverter(HoboLinkConverter):

    CONVERSION_MULTIPLIER = 100 # 1 millibar = 100 pascals

    def convert(self):
        def _replace_comma(val):
            val = str(val)
            if ',' in val:
                ret = float(val.replace(',','')) * self.CONVERSION_MULTIPLIER
            else:
                ret = val
            return ret
        input_values = map(_replace_comma, self.input_values)
        _converter = HourlyConverter(self.data_type, input_values, self.datetime_values)
        return _converter.convert()

