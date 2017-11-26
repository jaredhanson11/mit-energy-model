import os
import json

METADATA_PATH = os.path.join(os.path.dirname(os.path.realpath(__file__)), 'building_metadata.json')

def whitelisted_buildings():
    metadata = json.load(open(METADATA_PATH, 'r'))
    return list(metadata)

def building_metadata():
    metadata = json.load(open(METADATA_PATH, 'r'))
    return dict(metadata)

