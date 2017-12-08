from EPWBaseConverter import EPWBaseConverter
import CommonConfig

EPW_HEADER = 'atmospheric_station_pressure'

class EPWPressureConverter(EPWBaseConverter):

    CONVERSION_MULTIPLIER = 100 # 1 millibar = 100 pascals (hobolink is in mbar)

    @staticmethod
    def convert(hour_data):
        conversions = {EPW_HEADER: CommonConfig.UNIVERSAL_NULL_VALUE}
        val_count = []
        for minute in hour_data:
            if EPW_HEADER in minute and minute[EPW_HEADER] != CommonConfig.UNIVERSAL_NULL_VALUE:
                val_count.append(float(minute[EPW_HEADER]) * EPWPressureConverter.CONVERSION_MULTIPLIER)
        if val_count > 0:
            sum_vals = sum(val_count)
            len_vals = len(val_count)
            avg_vals = float(sum_vals) / len_vals
            conversions[EPW_HEADER] = avg_vals
        return conversions
