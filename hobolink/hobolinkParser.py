import sys, os
import pandas as pd
from functools import reduce

input_path = "input_files/weather1.csv"
output_path = "output_files/output.csv"
abs_input_path = os.path.join(os.path.dirname(__file__), input_path)
abs_output_path = os.path.join(os.path.dirname(__file__), output_path)

def update_csv(abs_input_path, abs_output_path):

    input_df = pd.read_csv(abs_input_path)

    d = {'pressure':5, 'wind':6, 'temperature':7, 'rh':8, 'dew point': 9, 'battery': 10}
    results = {}

    for i in d.keys():
        col = input_df[input_df.columns[d[i]]].map(lambda x: x.replace(',', '') if type(x) is str else x)
        results[i] = col.astype(float).mean()

    csv = open(abs_output_path, "a")
    csv.write(reduce((lambda x,y: str(x) + ',' + str(y)), results.values()) + '\n')

    print(results)
