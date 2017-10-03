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
io_mapping = {
    7 : 6,  #temperature
    9 : 7,  #dew point
    8 : 8,  #rh
    5 : 9,  #pressure
    6 : 20  #wind direction
}

NUM_EPW_INPUTS = 35
NULL_EPW_VALUE = ''

for index, row in input_df.iterrows():

    results = [NULL_EPW_VALUE for i in range(NUM_EPW_INPUTS)]

    date = datetime.strptime(row[1], '%m/%d/%y %H:%M:%S')

    results[0] = date.year
    results[1] = date.month
    results[2] = date.day
    results[3] = date.hour
    results[4] = date.minute

    for input_col in io_mapping:

        output_col = io_mapping[input_col]

        if input_col == 5:
            converted_value = row[io_mapping[input_col]] * 100
            results[output_col] = converted_value
            print (converted_value)

        else:
            results[output_col] = row[input_col].replace(',', '') if type(row[input_col]) is str else row[input_col]

    results = map(lambda x: str(x), results)
    csv_output_line = ",".join(results)

    csv = open(abs_output_path, "a")

    csv.write(csv_output_line + '\n')
