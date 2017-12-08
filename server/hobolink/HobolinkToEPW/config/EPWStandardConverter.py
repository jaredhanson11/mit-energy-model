from EPWBaseConverter import EPWBaseConverter
import CommonConfig

EPW_VALUES_CONVERTED = [
    'relative_humidity',
    'dry_bulb_temperature',
    'dew_point_temperature',
    'wind_speed'
]

class EPWStandardConverter(EPWBaseConverter):

    @staticmethod
    def convert(hour_data):
        conversions = {header: CommonConfig.UNIVERSAL_NULL_VALUE for header in EPW_VALUES_CONVERTED}

        epw_values_total = {header: [] for header in EPW_VALUES_CONVERTED}
        for hour in hour_data:
            for epw_header in epw_values_total:
                if epw_header in hour and hour[epw_header] != CommonConfig.UNIVERSAL_NULL_VALUE:
                    epw_values_total[epw_header].append(hour[epw_header])

        for header in epw_values_total:
            vals = epw_values_total[header]
            sum_vals = sum(vals)
            len_vals = len(vals)
            if len_vals == 0:
                continue
            avg_vals = float(sum_vals) / len_vals
            conversions[header] = avg_vals

        return conversions


