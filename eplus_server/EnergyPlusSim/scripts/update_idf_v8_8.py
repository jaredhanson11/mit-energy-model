desc = \
'''
Updates idf file to Version 8.8.
'''
import os
import sys
import argparse

eplus_engine_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../'))
sys.path.append(eplus_engine_path)
from EnergyPlusEngine import EnergyPlusEngine

arg_parser = argparse.ArgumentParser(description=desc)

def _is_valid_file(arg):
    if os.path.isfile(arg):
        return arg
    else:
        raise argparse.ArgumentTypeError('\'%s\' is not a valid file.' % (arg))

arg_parser.add_argument('-i', '--input', type=_is_valid_file, required=True)
arg_parser.add_argument('-v', '--version', required=True)
args = arg_parser.parse_args()

def main(args):
    EnergyPlusEngine.update_idf_file(args.input, args.version)

main(args)
