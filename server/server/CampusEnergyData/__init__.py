import os
import json

METADATA_PATH = os.path.join(os.path.dirname(os.path.realpath(__file__)), 'building_metadata.json')

def whitelisted_buildings():
    metadata = json.load(open(METADATA_PATH, 'r'))
    return list(metadata)

def building_metadata():
    metadata = json.load(open(METADATA_PATH, 'r'))
    return dict(metadata)

STM_TO_KBTU = 1100
CHW_TO_KBTU = 12
ELEC_TO_KWH = 1
KBTU_TO_KWH = 0.293071
UNITS_CONVERSIONS = {
    'chw': CHW_TO_KBTU * KBTU_TO_KWH,
    'elec': ELEC_TO_KWH,
    'stm': STM_TO_KBTU * KBTU_TO_KWH
}

def to_kwh(value, energy_type):
    if energy_type not in UNITS_CONVERSIONS:
        raise TypeError('Energy type not in unit conversions.')
    return int(value * UNITS_CONVERSIONS[energy_type])

TRANSLATIONS = {
    '6_6B' : '6',
    '7_7A' : '7',
    'NW12_NW12A' : 'NW12',
    'W2_W4' : 'W2',
    'W53_W53A_W53B_W53C_W53D' : 'W53',
    'W85_W85ABC_W85DE_W85FG_W85HJK' : 'W85',
    'M6C' : '6',
    'M10LIB' : '10',
    'E62E60' : 'E62',
    'E25N' : 'E25',
    'E25S' : 'E25',
    'E18PH' : 'E18'
}

def name_translations(building_num):
    if building_num in TRANSLATIONS:
        return TRANSLATIONS[building_num]
    else:
        tmp_name = building_num.split('_')[0]
        if tmp_name in TRANSLATIONS:
            return TRANSLATIONS[tmp_name]
        if tmp_name[0] == 'M':
            return tmp_name[1:]
        else:
            return tmp_name
