from HoboLinkConverter import HoboLinkConverter

class DateTimeConverter(HoboLinkConverter):

    def convert(self):

        mins = []
        hours = []
        days = []
        months = []
        years = []
        for dt in self.datetime_values:
            if dt.hour not in hours:
                mins.append(0)
                hours.append(dt.hour)
                days.append(dt.day)
                months.append(dt.month)
                years.append(dt.year)

        mins.append(0)
        hours.append(final_dt.hour)
        days.append(final_dt.day)
        months.append(final_dt.month)
        years.append(final_dt.year)

        conversions = {}

        epw_output = self.get_epw_column()
        for d_type in epw_output:
            epw_col = self.get_epw_column(d_type)
            if d_type == 'minute':
                conversions[epw_col] = mins
            elif d_type == 'hour':
                conversions[epw_col] = hours
            elif d_type == 'day':
                conversions[epw_col] = days
            elif d_type == 'month':
                conversions[epw_col] = months
            elif d_type == 'year':
                conversions[epw_col] = years

        return conversions
