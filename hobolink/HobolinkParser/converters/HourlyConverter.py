from HoboLinkConverter import HoboLinkConverter

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
        ret = []
        for i in range(24):
            ret.append(self.input_values[i])

        return {self.get_epw_column(): ret}
