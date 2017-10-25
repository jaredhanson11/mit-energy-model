import math

from HoboLinkConverter import HoboLinkConverter

class WindDirectionConverter(HoboLinkConverter):

    def convert(self):
        wind_directions = self.input_values[0]
        wind_speeds = self.input_values[1]

        def _get_uv(wind_direction, wind_speed):
            radians = math.radians(wind_direction)
            u = wind_speed * math.cos(radians)
            v = wind_speed * math.sin(radians)
            return (u, v)

        hour_order = []
        hours_dictionary = {}

        for i, dt in enumerate(self.datetime_values):
            hour_dt = dt.strftime('%m-%d-%y:%H')
            if hour_dt not in hour_order:
                hour_order.append(hour_dt)
                hours_dictionary[hour_dt] = {'u': [], 'v': []}
            u, v = _get_uv(int(wind_directions[i]), float(wind_speeds[i]))
            hours_dictionary[hour_dt]['u'].append(u) #TODO check
            hours_dictionary[hour_dt]['v'].append(v) #TODO check

        ret = []
        for hour in hour_order:
            if hours_dictionary[hour]:
                u_sum = sum(hours_dictionary[hour]['u'])
                v_sum = sum(hours_dictionary[hour]['v'])
                average = math.atan2(u_sum, v_sum)
                degrees = math.degrees(average)
                ret.append(degrees)

        return {self.get_epw_column(): ret}
