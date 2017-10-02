import sys, os
import pandas as pd
from datetime import datetime
from functools import reduce

input_path = "input_files/weather1.csv"
output_path = "output_files/Edited_EPW.csv"
abs_input_path = os.path.join(os.path.dirname(__file__), input_path)
abs_output_path = os.path.join(os.path.dirname(__file__), output_path)

input_df = pd.read_csv(abs_input_path)

d = {'temperature':7, 'dew point': 9, 'rh':8, 'pressure':5, 'radiation':4, 'wind':6}
ordering = ['year', 'month', 'day', 'hour', 'minute', 'temperature', 'dew point', 'rh', 'pressure', 'radiation', 'wind']
results = {}

# for i in d.keys():
#     col = input_df[input_df.columns[d[i]]].map(lambda x: x.replace(',', '') if type(x) is str else x)
#     results[i] = col.astype(float).mean()

for index, row in input_df.iterrows():
    date = datetime.strptime(row[1], '%m/%d/%y %H:%M:%S')
    results['year'] = date.year
    results['month'] = date.month
    results['day'] = date.day
    results['hour'] = date.hour
    results['minute'] = date.minute

    for i in d.keys():
        results[i] = row[d[i]].replace(',', '') if type(row[d[i]]) is str else row[d[i]]

    csv = open(abs_output_path, "a")
    output_str = ''
    for i in ordering:
        if i == 'minute':
            output_str = output_str + ','
        if i == 'wind':
            output_str = output_str + ',,,,,,,,,'

        output_str = output_str + str(results[i]) + ','
    output_str = output_str[:-1]
    csv.write(output_str + '\n')
    print(results)

