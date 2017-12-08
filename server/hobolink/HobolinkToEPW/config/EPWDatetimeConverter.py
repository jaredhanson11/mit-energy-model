from EPWBaseConverter import EPWBaseConverter
import CommonConfig

EPW_VALUES_CONVERTED = [
    'year',
    'month',
    'day',
    'hour',
    'minute'
]

class EPWDatetimeConverter(EPWBaseConverter):

    @staticmethod
    def convert(hour_data):
        conversions = {header: CommonConfig.UNIVERSAL_NULL_VALUE for header in EPW_VALUES_CONVERTED}
        if len(hour_data) == 0:
            return conversions
        hour = hour_data[0]
        for header in conversions:
            if header == 'minute':
                conversions[header] = 0
            elif header in hour and hour[header] != CommonConfig.UNIVERSAL_NULL_VALUE:
                conversions[header] = int(hour[header])
        return conversions

