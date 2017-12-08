from EPWBaseConverter import EPWBaseConverter
import CommonConfig
from RadiationSplit import RadiationSplit

EPW_VALUES_CONVERTED = [
    'diffuse_horizontal_radiation',
    'direct_normal_radiation'
]

HOBOLINK_INPUT = 'solar_radiation'

class EPWSolarRadiationConverter(EPWBaseConverter):

    LATITUDE = 42.359221
    LONGITUDE = -71.093003

    @staticmethod
    def convert(hour_data):
        conversions = {header: CommonConfig.UNIVERSAL_NULL_VALUE for header in EPW_VALUES_CONVERTED}

        val_totals = {header: [] for header in EPW_VALUES_CONVERTED}
        for record in hour_data:
            if HOBOLINK_INPUT in record and record[HOBOLINK_INPUT] != CommonConfig.UNIVERSAL_NULL_VALUE:
                solar_radiation = record[HOBOLINK_INPUT]
                dt_str = record['datetime']
                dt = CommonConfig.str_dt_to_dt(dt_str)
                dt.replace(minute=record['minute'])
                gen_reindl = RadiationSplit(dt, solar_radiation, EPWSolarRadiationConverter.LATITUDE, EPWSolarRadiationConverter.LONGITUDE)
                split = gen_reindl.split_radiation()
                for _s in split:
                    assert _s in val_totals
                    val_totals[_s].append(split[_s])

        for header in val_totals:
            if len(val_totals[header]) > 0:
                sum_ = sum(val_totals[header])
                len_ = len(val_totals[header])
                avg = float(sum_) / len_
                conversions[header] = avg
        return conversions

