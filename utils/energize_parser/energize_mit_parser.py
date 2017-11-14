import csv
import json

with open('data_2017.csv', 'r') as f:
    reader = csv.reader(f)
    building_data = {}

    buildings_already_seen = []
    for i, line in enumerate(reader):
        if i == 0:
            continue
        if line[0] not in buildings_already_seen:
            buildings_already_seen.append(line[0])
            building_data[line[0]] = {
                'Chilled Water' : {},
                'Electricity' : {},
                'Steam' : {},
            }
            if line[33] == 'Chilled Water' or line[33] == 'Electricity' or line[33] == 'Steam':
                month = ''.join([line[42][5], line[42][6]])
                building_data[line[0]][line[33]][month] = line[35]
        else:
            if line[33] == 'Chilled Water' or line[33] == 'Electricity' or line[33] == 'Steam':
                month = ''.join([line[42][5], line[42][6]])
                building_data[line[0]][line[33]][month] = line[35]

# months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"]
# null_buildings = []

# for key, value in building_data.items():
# 	for k, v in value.items():
# 		new_list = []
# 		for month in months:
# 			if month in v:
# 				new_list.append(v[month])
# 			if month not in v:
# 				new_list
# 		value[k] = new_list

print (json.dumps(building_data, indent=4))

# with open('data_2017.json', 'w') as outfile:
#     json.dump(building_data, outfile)