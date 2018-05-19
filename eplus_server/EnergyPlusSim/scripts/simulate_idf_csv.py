import os
import sys
import argparse

eplus_engine_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../'))
sys.path.append(eplus_engine_path)
from EnergyPlusEngine import EnergyPlusEngine

arg_parser = argparse.ArgumentParser()

def _is_valid_file(arg):
    if os.path.isfile(arg):
        return arg
    else:
        raise argparse.ArgumentTypeError('\'%s\' is not a valid file.' % (arg))

arg_parser.add_argument('-i', '--idf-template', type=_is_valid_file, required=True)
arg_parser.add_argument('-v', '--idf-vals', type=_is_valid_file, required=True)
arg_parser.add_argument('-b', '--building', type=str, required=True)
arg_parser.add_argument('-n', '--simulation-name', type=str)
args = arg_parser.parse_args()

def main(args):
    EnergyPlusEngine.simulate(args.idf_template, args.idf_vals, args.building, args.simulation_name)

main(args)
