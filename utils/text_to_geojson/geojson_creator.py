import csv
import json

with open('s.csv', 'r') as f:
    reader = csv.reader(f)
    geo_json = {
        "type": "FeatureCollection",
        "features": []
    }
    features_lst = [

    ]
    buildings_already_seen = []
    for i, line in enumerate(reader):
        if i == 0:
        	continue
        if line[2] not in buildings_already_seen:
            entry = {
                "type": "Feature",
                "properties": {
                    "building_number": line[2]
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [
                        [
                            [float(line[6]), float(line[7])]
                        ]
                    ]
                }
            }
            features_lst.append(entry)
            buildings_already_seen.append(line[2])
        else:
            for item in features_lst:
                if item["properties"]["building_number"] == line[2]:
                    print (item)
                    item["geometry"]["coordinates"][0].append([float(line[6]), float(line[7])])
            buildings_already_seen.append(line[2])

    geo_json["features"] = features_lst

with open('data.json', 'w') as outfile:
    json.dump(geo_json, outfile)
