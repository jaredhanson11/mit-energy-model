import pandas as pd
from datetime import datetime

#receiving two lists
# 1) Time/Date
# 2) Data Cells

#exporting a dictionary
# exported_dict = {
#     index_of_header_in_epw : [entries for that header]
# }

df = pd.read_csv('/Users/spencerkim/Desktop/mit-energy-model/hobolink/converters/sample_hobolink.csv')

temperature = list(df)[7]
temperature_list = df[temperature].values

date = list(df)
date_list = map(lambda x: datetime.strptime(x[1], '%m/%d/%y %H:%M:%S'), df[date].values)

first_hour = date_list[0]

print (first_hour)

# indices_of_hour = filter(lambda x: )

# first_hour, first_date =
#
# class HoboLinkConverter:
#
#     def __init__(self, data_type, input_values, datetime_values):
#         self.data_type = data_type
#         self.input_values = input_values
#         self.datetime_values = datetime_values
#
#     def convert(self):
#         pass
#
#     def get_epw_column (self):
        # go to a map that takes datatype and maps to index of epw header
        # datatype : epw_column (if string)
        # else if list, run converters again and try to get index again
