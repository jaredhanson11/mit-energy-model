desc = \
'''
Adds entire day of weather data to the epw csv template.
'''
import os
import sys
import argparse

hobolink_parser_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../'))
sys.path.append(hobolink_parser_path)
from HobolinkToEPW import HobolinkToEPW


arg_parser = argparse.ArgumentParser(description=desc)

def _is_valid_file(arg):
    if os.path.isfile(arg):
        return arg
    else:
        raise argparse.ArgumentTypeError('\'%s\' is not a valid file.' % (arg))
arg_parser.add_argument('-i', '--input', type=_is_valid_file, required=True)
args = arg_parser.parse_args()

def main(args):
    hobolink_parser = HobolinkToEPW()
    hobolink_parser.hobolink_to_epw(args.input)

main(args)
