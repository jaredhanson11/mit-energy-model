from HoboLinkConverter import HoboLinkConverter
import datetime

class HourlyConverter(HoboLinkConverter):
    '''
    Averages the input values hourly.

    Args:
        data_type(string): type of data
            data_type must map to an epw column output
            aka self.get_epw_column() can't return a list
        input_values(list): list of data values
        datetime_values(list): list of datetime objects
    '''

    def convert(self):
        hour_order = []
        hours_dictionary = {}

        for i, dt in enumerate(self.datetime_values):
            hour_dt = dt.strftime('%m-%d-%y:%H')
            if hour_dt not in hour_order:
                hour_order.append(hour_dt)
                hours_dictionary[hour_dt] = []
            val = self.input_values[i]
            if val == None:
                continue
            hours_dictionary[hour_dt].append(float(self.input_values[i])) #TODO check

        ret = []
        for hour in hour_order:
            if hours_dictionary[hour]:
                average = sum(hours_dictionary[hour])/ len(hours_dictionary[hour])
                ret.append(average)

        return {self.get_epw_column(): ret}
