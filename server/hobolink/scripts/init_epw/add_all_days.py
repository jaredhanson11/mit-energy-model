import sys
import os
import subprocess
from datetime import datetime
import argparse

arg_parser = argparse.ArgumentParser()
def _is_valid_dir(arg):
    if os.path.isdir(arg):
        return arg
    else:
        raise argparse.ArgumentTypeError('\'%s\' is not a valid directory.' % arg)

def _is_valid_file(arg):
    if os.path.isfile(arg):
        return arg
    else:
        raise argparse.ArgumentTypeError('\'%s\' is not a valid file.' % arg)

arg_parser.add_argument('-i', '--input-dir', type=_is_valid_dir, required=True)
args = arg_parser.parse_args()

def main(args):
    def add_day(ele):
        if ele.endswith('_weather.csv'):
            return True
    days_to_add = filter(add_day, os.listdir(args.input_dir))

    for i, file_name in enumerate(days_to_add):
        print 'Adding %s' % (file_name)
        print 'Day %d of %d' % (i, len(days_to_add))
        input_path = os.path.join(args.input_dir, file_name)
        add_day_args = ['python', os.path.join(os.path.dirname(os.path.realpath(__file__)), '../add_weather.py'), '-i', input_path]
        subprocess.call(add_day_args)



main(args)
