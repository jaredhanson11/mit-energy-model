import sys
import os
import argparse
import pandas as pd

eplus_engine_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../'))
sys.path.append(eplus_engine_path)
from EnergyPlusEngine import ZoneMultiplierInterface

arg_parser = argparse.ArgumentParser()

def _is_valid_file(arg):
    if os.path.isfile(arg):
        return arg
    else:
        raise argparse.ArgumentTypeError('\'%s\' is not a valid file.' % (arg))

arg_parser.add_argument('-m', '--multipliers', type=_is_valid_file)
args = arg_parser.parse_args()

def main(args):
    zones = ['0perim', '0core', '1perim', '1core', '2perim', '2core', '3perim', '3core']

    multipliers_csv = pd.read_csv(args.multipliers)
    for building, multipliers in multipliers_csv.iteritems():
        for i, zone in enumerate(zones):
            print 'Print added record-- Building:', building, 'Zone:', zone, 'Multiplier:', multipliers.tolist()[i]
            ZoneMultiplierInterface.add_multiplier(building, zone, multipliers.tolist()[i])

main(args)
