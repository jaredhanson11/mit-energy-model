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
        next_day = self.datetime_values[0] + datetime.timedelta(days=1)
        hours_dictionary = {i:[] for i in range(24)}
        hour_order = []

        for i, dt in enumerate(self.datetime_values):
            if dt.day == next_day.day and dt.hour == next_day.hour:
                continue
            if dt.hour not in hour_order:
                hour_order.append(dt.hour)
            hours_dictionary[dt.hour].append(float(self.input_values[i])) #TODO check

        ret = []
        for hour in hour_order:
            average = sum(hours_dictionary[hour])/ len(hours_dictionary[hour])
            ret.append(average)

        return {self.get_epw_column(): ret}
