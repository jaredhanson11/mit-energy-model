import sys
import os
import subprocess
from datetime import datetime, timedelta
import argparse
import pandas as pd
import csv

hobolink_parser_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../'))
sys.path.append(hobolink_parser_path)
import HobolinkToEPW



arg_parser = argparse.ArgumentParser()

def _is_valid_file(arg):
    if os.path.isfile(arg):
        return arg
    else:
        raise argparse.ArgumentTypeError('\'%s\' is not a valid file.' % (arg))
arg_parser.add_argument('-o', '--output', required=True)
args = arg_parser.parse_args()


def populate(output_path):
    hobolink_parser = HobolinkToEPW.HobolinkToEPW()
    hobolink_parser.generate_epw(output_path)

populate(args.output)
