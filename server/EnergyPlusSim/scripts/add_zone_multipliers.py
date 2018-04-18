import sys
import os
import argparse

eplus_engine_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../'))
sys.path.append(eplus_engine_path)
from EnergyPlusEngine import ZoneMultiplierInterface

arg_parser = argparse.ArgumentParser()

arg_parser.add_argument('-b', '--building', type=str, required=True)
args = arg_parser.parse_args()

def main(args):
    print 'Add new zone multipliers for building: %s' % args.building
    y_n = raw_input('y/n')
    added_zones = []
    if y_n.strip().lower() == 'y':
        while True:
            zone = raw_input('New zone: ')
            if not zone or zone in added_zones:
                print 'Error in zone'
                continue
            multiplier = raw_input('Multiplier: ')
            try:
                multiplier = float(multiplier)
            except:
                print 'Error in multiplier input'
                continue
            ZoneMultiplierInterface.add_multiplier(args.building, zone, multiplier)
            added_zones.append(zone)
            print 'Added record - zone: %s, multiplier: %s'
            add_more = raw_input('Add more zones? y/n')
            if add_more != 'y':
                print 'Added: ', added_zones
                break

main(args)
