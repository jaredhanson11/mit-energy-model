import os
import sys
from collections import OrderedDict
import csv
import eppy.json_functions as json_functions
from eppy.modeleditor import IDF

ENERGYPLUS_FOLDER = '/usr/local/EnergyPlus-8-8-0/'
IDD_FILEPATH = os.path.join(ENERGYPLUS_FOLDER, 'Energy+.idd')
IDF.setiddname(IDD_FILEPATH)

def _setup_param_mapping(param_path):
    param_mapping = OrderedDict()
    csv_file = open(param_path)
    idf_param_mapping_csv = csv.reader(csv_file)
    keys, lows, meds, highs = [row for i, row in enumerate(idf_param_mapping_csv) if i in [2, 3, 4, 5]]
    for idx, param_key in enumerate(keys):
        param_mapping[param_key] = (lows[idx], meds[idx], highs[idx])
    csv_file.close()
    return param_mapping

param_val_mapping = _setup_param_mapping(os.path.abspath(os.path.join(os.path.dirname(__file__), './idf_params.csv')))

def _get_idf_vals(row):
    ret = {}
    param_vals = param_val_mapping.values()
    for i, key in enumerate(param_val_mapping.keys()):
        val_i = row[i]
        if int(val_i) == 4:
            val_i = 0
        elif int(val_i) == 5:
            val_i = 1
        elif int(val_i) == 6:
            val_i = 2
        ret[key] = param_vals[i][val_i]
    return ret

def _is_perim(name):
    """Returns 1 if is perim, 0 if is core, -1 if neither"""
    if 'perim' in name.lower():
        return 1
    elif 'core' in name.lower():
        return 0
    else:
        return -1

BASE_UPDATE = 'idf.'
def _get_json_updates(idf_vals, idf):
    json_updates = {}

    # OccupancSchedule: INP_OCC_SCH
    INP_OCC_SCH = ('Number of People Schedule Name', idf_vals['INP_OCC_SCH'])
    # Perimeter Occupancy Density: INP_OCC_DENS_P
    INP_OCC_DENS_P = ('People per Zone Floor Area', idf_vals['INP_OCC_DENS_P'])
    # Core Occupancy Density: INP_OCC_DENS_C
    INP_OCC_DENS_C = ('People per Zone Floor Area', idf_vals['INP_OCC_DENS_C'])

    for person in idf.idfobjects['PEOPLE']:
        name = person['Name']
        base_idf_update = BASE_UPDATE + 'PEOPLE.' + name + '.'
        occ_sch_update = base_idf_update + INP_OCC_SCH[0].replace(' ', '_')
        json_updates[occ_sch_update] = INP_OCC_SCH[1]
        if _is_perim(name) == 1:
            occ_dens_update = base_idf_update + INP_OCC_DENS_P[0].replace(' ', '_')
            json_updates[occ_dens_update] = INP_OCC_DENS_P[1]
        elif _is_perim(name) == 0:
            occ_dens_update = base_idf_update + INP_OCC_DENS_C[0].replace(' ', '_')
            json_updates[occ_dens_update] = INP_OCC_DENS_C[1]

    # Equipment Usage: INP_EQP_SCH
    INP_EQP_SCH = ('Schedule Name', idf_vals['INP_EQP_SCH'])
    # Perimeter Equipment Power: INP_EQP_PWR_P
    INP_EQP_PWR_P = ('Watts per Zone Floor Area', idf_vals['INP_EQP_PWR_P'])
    # Core Equipment Power: INP_EQP_PWR_C
    INP_EQP_PWR_C = ('Watts per Zone Floor Area', idf_vals['INP_EQP_PWR_C'])
    for equipment in idf.idfobjects['ELECTRICEQUIPMENT']:
        name = equipment['Name']
        base_idf_update = BASE_UPDATE + 'ELECTRICEQUIPMENT.' + name + '.'
        update = base_idf_update + INP_EQP_SCH[0].replace(' ', '_')
        json_updates[update] = INP_EQP_SCH[1]
        if _is_perim(name) == 1:
            update = base_idf_update + INP_EQP_PWR_P[0].replace(' ', '_')
            json_updates[update] = INP_EQP_PWR_P[1]
        elif _is_perim(name) == 0:
            update = base_idf_update + INP_EQP_PWR_C[0].replace(' ', '_')
            json_updates[update] = INP_EQP_PWR_C[1]

    # Lighting Usage: INP_LTG_SCH
    INP_LTG_SCH = ('Schedule Name', idf_vals['INP_LTG_SCH'])
    # Perimeter Equipment Power: INP_LTG_PWR_P
    INP_LTG_PWR_P = ('Watts per Zone Floor Area', idf_vals['INP_LTG_PWR_P'])
    # Core Equipment Power: INP_LTG_PWR_C
    INP_LTG_PWR_C = ('Watts per Zone Floor Area', idf_vals['INP_LTG_PWR_C'])
    for light in idf.idfobjects['LIGHTS']:
        name = light['Name']
        base_idf_update = BASE_UPDATE + 'LIGHTS.' + name + '.'
        update = base_idf_update + INP_LTG_SCH[0].replace(' ', '_')
        json_updates[update] = INP_LTG_SCH[1]
        if _is_perim(name) == 1:
            update = base_idf_update + INP_LTG_PWR_P[0].replace(' ', '_')
            json_updates[update] = INP_LTG_PWR_P[1]
        elif _is_perim(name) == 0:
            update = base_idf_update + INP_LTG_PWR_C[0].replace(' ', '_')
            json_updates[update] = INP_LTG_PWR_C[1]

    # Thermostat Setpoint: INP_THERM_STPT
    INP_THERM_STPT = ('Hourly Value', idf_vals['INP_THERM_STPT'])
    for constant in idf.idfobjects['SCHEDULE:CONSTANT']:
        name = constant['Name']
        if not name.endswith('_SP_Sch'):
            continue
        update = BASE_UPDATE + 'SCHEDULE:CONSTANT.' + name + '.' + INP_THERM_STPT[0].replace(' ', '_')
        json_updates[update] = INP_THERM_STPT[1]

    # Economizer Cycle: INP_ECON_TYPE
    INP_ECON_TYPE = ('Outdoor Air Economizer Type', idf_vals['INP_ECON_TYPE'])
    # Energy Recovery: INP_ERV_TYPE
    INP_ERV_TYPE = ('Heat Recovery Type', idf_vals['INP_ERV_TYPE'])
    for air_system in idf.idfobjects['ZONEHVAC:IDEALLOADSAIRSYSTEM']:
        name = air_system['Name']
        update = BASE_UPDATE + 'ZONEHVAC:IDEALLOADSAIRSYSTEM.' + name + '.' + INP_ECON_TYPE[0].replace(' ', '_')
        json_updates[update] = INP_ECON_TYPE[1]
        update = BASE_UPDATE + 'ZONEHVAC:IDEALLOADSAIRSYSTEM.' + name + '.' + INP_ERV_TYPE[0].replace(' ', '_')
        json_updates[update] = INP_ERV_TYPE[1]

    # Perimeter QA Flowrate: INP_OA_PER_P
    INP_OA_PER_P = ('Outdoor Air Flow per Person', idf_vals['INP_OA_PER_P'])
    # Core QA Flowrate: INP_OA_PER_C
    INP_OA_PER_C = ('Outdoor Air Flow per Person', idf_vals['INP_OA_PER_C'])
    # Perimeter QA Schedule: INP_DCV_SCH_P
    INP_DCV_SCH_P = ('Outdoor Air Flow Rate Fraction Schedule Name', idf_vals['INP_DCV_SCH_P'])
    # Core QA Schedule: INP_DCV_SCH_C
    INP_DCV_SCH_C = ('Outdoor Air Flow Rate Fraction Schedule Name', idf_vals['INP_DCV_SCH_C'])

    for air in idf.idfobjects['DESIGNSPECIFICATION:OUTDOORAIR']:
        name = air['Name']
        base_update = BASE_UPDATE + 'DESIGNSPECIFICATION:OUTDOORAIR.'
        if _is_perim(name) == 1:
            update = base_update + name + '.' + INP_OA_PER_P[0].replace(' ', '_')
            json_updates[update] = INP_OA_PER_P[1]
            update = base_update + name + '.' + INP_DCV_SCH_P[0].replace(' ', '_')
            json_updates[update] = INP_DCV_SCH_P[1]
        elif _is_perim(name) == 0:
            update = base_update + name + '.' + INP_OA_PER_C[0].replace(' ', '_')
            json_updates[update] = INP_OA_PER_C[1]
            update = base_update + name + '.' + INP_DCV_SCH_C[0].replace(' ', '_')
            json_updates[update] = INP_DCV_SCH_C[1]

    # Window Operation: INP_NV_SCH
    INP_NV_SCH = ('OutputVariable or OutputMeter Index Key Name', idf_vals['INP_NV_SCH'])
    for sensor in idf.idfobjects['ENERGYMANAGEMENTSYSTEM:SENSOR']:
        name = sensor['Name']
        update = BASE_UPDATE + 'ENERGYMANAGEMENTSYSTEM:SENSOR.' + name + '.' + INP_NV_SCH[0].replace(' ', '_')
        json_updates[update] = INP_NV_SCH[1]

    # Weatherization: INP_INF_ACH
    INP_INF_ACH = ('Air Changes per Hour', idf_vals['INP_INF_ACH'])
    for flowrate in idf.idfobjects['ZONEINFILTRATION:DESIGNFLOWRATE']:
        name = flowrate['Name']
        update = BASE_UPDATE + 'ZONEINFILTRATION:DESIGNFLOWRATE.' + name + '.' + INP_INF_ACH[0].replace(' ', '_')
        json_updates[update] = INP_INF_ACH[1]

    # DHW Flowrate: INP_DHW_FLOW
    INP_DHW_FLOW = ('Peak Flow Rate', idf_vals['INP_DHW_FLOW'])
    for equipment in idf.idfobjects['WATERUSE:EQUIPMENT']:
        name = equipment['Name']
        update = BASE_UPDATE + 'WATERUSE:EQUIPMENT.' + name + '.' + INP_DHW_FLOW[0].replace(' ', '_')
        json_updates[update] = INP_DHW_FLOW[1]

    return json_updates

def idfs(idf_template_path, idf_vals):
    idfs = []
    for idf_ver in idf_vals:
        idf_vals = _get_idf_vals(idf_ver)
        idf = IDF(idf_template_path)
        json_updates = _get_json_updates(idf_vals, idf)
        json_functions.updateidf(idf, json_updates)
        idfs.append(idf)
    return idfs



