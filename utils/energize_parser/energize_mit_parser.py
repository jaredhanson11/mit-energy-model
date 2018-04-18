import os
import sys
import argparse
import csv
import json

campus_meu_converter_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../server/server/'))
sys.path.append(campus_meu_converter_path)
import CampusEnergyData

arg_parser = argparse.ArgumentParser()

def _is_valid_file(arg):
    if os.path.isfile(arg) and arg.endswith('.csv'):
        return arg
    else:
        raise argparse.ArgumentTypeError('\'%s\' is not a valid file.' % (arg))
arg_parser.add_argument('-i', '--input', type=_is_valid_file, required=True)
args = arg_parser.parse_args()

def main(args):
    reader = csv.DictReader(open(args.input))
    building_data = {}

    for i, row in enumerate(reader):
        building_number = row['BUILDING_NUMBER']
        if building_number not in building_data:
            building_data[building_number] = {
                'stm': [0 for i in range(12)],
                'chw': [0 for i in range(12)],
                'elec': [0 for i in range(12)]
            }
        if len(row['START_DATE_USE'].split('-')) == 3:
            month = int(row['START_DATE_USE'].split('-')[1])
        elif len(row['START_DATE_USE'].split('/')) == 3:
            month = int(row['START_DATE_USE'].split('/')[1])
        else:
            raise Exception('Invalid date for start date use. Building num: %s' % building_number)
        index_from_month = month - 1
        units_consumed = float(row['NUMBER_OF_UNITS'])
        if row['LEVEL3_CATEGORY'] == 'Chilled Water':
            converted = CampusEnergyData.to_kwh(units_consumed, 'chw')
            building_data[building_number]['chw'][index_from_month] = CampusEnergyData.to_kwh(units_consumed, 'chw')
        elif row['LEVEL3_CATEGORY'] == 'Electricity':
            converted = CampusEnergyData.to_kwh(units_consumed, 'elec')
            building_data[building_number]['elec'][index_from_month] = CampusEnergyData.to_kwh(units_consumed, 'elec')
        elif row['LEVEL3_CATEGORY'] == 'Steam':
            converted = CampusEnergyData.to_kwh(units_consumed, 'stm')
            building_data[building_number]['stm'][index_from_month] = CampusEnergyData.to_kwh(units_consumed, 'stm')

    output = args.input.replace('.csv', '.json')
    with open(output, 'w') as out:
        json.dump(building_data, out, indent=4)

main(args)
