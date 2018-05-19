desc = \
'''
Runs EnergyPlus simulation.
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

arg_parser.add_argument('-w', '--epw', type=_is_valid_file, required=True)
arg_parser.add_argument('-i', '--idf', type=_is_valid_file, required=True)
arg_parser.add_argument('-b', '--building', type=str, required=True)
arg_parser.add_argument('-n', '--simulation-name', type=str)
arg_parser.add_argument('-y', '--year', type=int)
args = arg_parser.parse_args()

def main(args):
    save = False
    if args.simulation_name:
        save=True
    save= False
    EnergyPlusEngine.run_simulation(args.idf, args.epw, args.building, simulation_name=args.simulation_name, simulation_year=args.year, save=save)

main(args)
