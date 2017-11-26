import csv

metadata = {}

f = open('/Users/Jared/Documents/UROP/building_type_by_eui.csv', 'rU')
reader = csv.reader(f, delimiter=',')

EUI_COL = 3
M2_COL = 1
FT2_COL = 4
TYPE_COL = 2
BUILDING_NUM_ROW = 0

for count, row in enumerate(reader):
    if count < 1:
        continue
    t = {
        'a': 'academic',
        's': 'services',
        'l': 'laboratory',
        'r': 'residential'
    }
    building_num = str(row[BUILDING_NUM_ROW]).upper()
    area_m2 = int(row[M2_COL])
    area_ft2 = int(row[FT2_COL])
    _type = str(row[TYPE_COL]).lower()
    building_eui = int(row[EUI_COL])
    entry = {
        building_num: {
            'area_m2': area_m2,
            'area_ft2': area_ft2,
            'building_eui': building_eui,
            'building_type': t[_type]
        }
    }

    metadata.update(entry)

import json
json.dump(metadata, open('/Users/Jared/Documents/UROP/mit-energy-model/server/server/CampusEnergyData/building_metadata.json', 'w'))
