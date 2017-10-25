desc = \
'''
Run this script when you want to split a large weather data csv file into many
    daily csv files that can be processed by HoboLinkParser.
'''
import os
from datetime import datetime, timedelta
import argparse
import pandas as pd

arg_parser = argparse.ArgumentParser(description=desc)
arg_parser.add_argument('-i', '--input', required=True)
arg_parser.add_argument('-o', '--output-directory', default='./output_files/', required=False)
args = arg_parser.parse_args()

def main(input_path, output_dir):
    input_csv = pd.read_csv(input_path)
    headers = list(input_csv)

    day_to_rows = {} # '10-15-17': []
    ## Split by day
    first_date = datetime.strptime(input_csv['Date'][0], '%m/%d/%y %H:%M')
    last_date = datetime.strptime(input_csv['Date'][len(input_csv['Date']) - 1], '%m/%d/%y %H:%M')

    curr_date = first_date
    while curr_date <= last_date:
        today_key = curr_date.strftime('%m-%d-%y')
        if today_key in day_to_rows:
            continue
        else:
            print 'Adding for ' + today_key
            def is_same_day(_day):
                def check(pd_row):
                    row_date = datetime.strptime(pd_row[1]['Date'], '%m/%d/%y %H:%M')
                    if row_date.day == _day.day and row_date.month == _day.month and row_date.year == _day.year:
                        return True
                    else:
                        return False
                return check
            today_rows = filter(is_same_day(curr_date), input_csv.iterrows())
            today_rows = map(lambda r: r[1], today_rows)
            day_to_rows[today_key] = True

            if len(today_rows) < 288:
                print os.path.join(output_dir, today_key + '_weather.csv') + ' had less than a full day of data.'
                print 'Instead was len ' + str(len(today_rows))
            pd_data = pd.DataFrame(today_rows, columns=headers)
            pd_data.to_csv(os.path.join(output_dir, today_key + '_weather.csv'), index=False)
            print 'Wrote ' + os.path.join(output_dir, today_key + '_weather.csv')


            curr_date += timedelta(days=1)

main(args.input, args.output_directory)
