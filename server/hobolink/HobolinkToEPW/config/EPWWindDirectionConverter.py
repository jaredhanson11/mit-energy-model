import math

from EPWBaseConverter import EPWBaseConverter
import CommonConfig

EPW_VALUES_CONVERTED = [
    'wind_direction'
]

HOBOLINK_VALUES_NEED = [
    'wind_direction',
    'wind_speed'
]

class EPWWindDirectionConverter(EPWBaseConverter):

    @staticmethod
    def convert(hour_data):
        conversions = {header: CommonConfig.UNIVERSAL_NULL_VALUE for header in EPW_VALUES_CONVERTED}

        vals_to_avg = []
        for hour in hour_data:
            add_hour = True
            for header in HOBOLINK_VALUES_NEED:
                if header not in hour or hour[header] == CommonConfig.UNIVERSAL_NULL_VALUE:
                    add_hour = False
            if add_hour:
                wd_ws = []
                for header in HOBOLINK_VALUES_NEED:
                    wd_ws.append(hour[header])
                vals_to_avg.append(wd_ws)

        uv_val_totals = {'u': [], 'v': []}
        for wd, ws in vals_to_avg:
            u, v = EPWWindDirectionConverter._get_uv(wd, ws)
            uv_val_totals['u'].append(u)
            uv_val_totals['v'].append(v)
        if len(uv_val_totals['u']) > 0:
            u_sum = sum(uv_val_totals['u'])
            v_sum = sum(uv_val_totals['v'])
            average = math.atan2(v_sum, u_sum)
            degrees = math.degrees(average)
            degrees = (degrees + 360) % 360
            conversions['wind_direction'] = float(degrees)
        return conversions

    @staticmethod
    def _get_uv(wind_direction, wind_speed):
        radians = math.radians(wind_direction)
        u = wind_speed * math.cos(radians)
        v = wind_speed * math.sin(radians)
        return (u, v)



