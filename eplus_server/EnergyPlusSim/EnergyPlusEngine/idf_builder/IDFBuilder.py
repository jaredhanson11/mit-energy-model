import os
import sys
from collections import OrderedDict
import csv
import eppy.json_functions as json_functions
from eppy.modeleditor import IDF
from utils import idf_utils

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

def _build_idf_from_template(idf_template_path, idf_vals):
    idf_file = open(idf_template_path, 'r')
    new_lines = []
    lines = idf_file.readlines()
    i = 0
    while i < len(lines):
        line = lines[i]
        if idf_utils._is_comment_or_whitespace(line):
            new_lines.append(line)
            i += 1
        else:
            curr_object = idf_utils.get_object(lines[i:])
            offset = len(curr_object)
            new_obj =[]
            for idx, obj_line in enumerate(curr_object):
                if '&&' in obj_line:
                    var = obj_line.split('&&')[1]
                    if var == 'INP_THERM_STPT':
                        obj_line = obj_line.replace('&&%s&&;'%var, idf_vals[var] + ';')
                    else:
                        obj_line = idf_utils.convert_value(obj_line, idf_vals[var])
                new_obj.append(obj_line)
            new_lines.extend(new_obj)
            i += offset
    idf_file.close()
    return new_lines


def idfs(idf_template_path, idf_vals, simulation_dir):
    idfs = []
    for i, idf_ver in enumerate(idf_vals):
        _idf_vals = _get_idf_vals(idf_ver)
        idf_lines = _build_idf_from_template(idf_template_path, _idf_vals)
        idf_file_path = os.path.join(simulation_dir, 'sim' + str(i).zfill(3) + '.idf')
        sim_file = open(idf_file_path, 'w')
        sim_file.writelines(idf_lines)
        idfs.append(idf_file_path)
        sim_file.close()
    return idfs


"""
# OccupancSchedule: INP_OCC_SCH
INP_OCC_SCH = ('Number of People Schedule Name', idf_vals['INP_OCC_SCH'])
# Perimeter Occupancy Density: INP_OCC_DENS_P
INP_OCC_DENS_P = ('People per Zone Floor Area', idf_vals['INP_OCC_DENS_P'])
# Core Occupancy Density: INP_OCC_DENS_C
INP_OCC_DENS_C = ('People per Zone Floor Area', idf_vals['INP_OCC_DENS_C'])

# Equipment Usage: INP_EQP_SCH
INP_EQP_SCH = ('Schedule Name', idf_vals['INP_EQP_SCH'])
# Perimeter Equipment Power: INP_EQP_PWR_P
INP_EQP_PWR_P = ('Watts per Zone Floor Area', idf_vals['INP_EQP_PWR_P'])
# Core Equipment Power: INP_EQP_PWR_C
INP_EQP_PWR_C = ('Watts per Zone Floor Area', idf_vals['INP_EQP_PWR_C'])

# Lighting Usage: INP_LTG_SCH
INP_LTG_SCH = ('Schedule Name', idf_vals['INP_LTG_SCH'])
# Perimeter Equipment Power: INP_LTG_PWR_P
INP_LTG_PWR_P = ('Watts per Zone Floor Area', idf_vals['INP_LTG_PWR_P'])
# Core Equipment Power: INP_LTG_PWR_C
INP_LTG_PWR_C = ('Watts per Zone Floor Area', idf_vals['INP_LTG_PWR_C'])

# Thermostat Setpoint: INP_THERM_STPT
INP_THERM_STPT = ('Hourly Value', idf_vals['INP_THERM_STPT'])

# Economizer Cycle: INP_ECON_TYPE
INP_ECON_TYPE = ('Outdoor Air Economizer Type', idf_vals['INP_ECON_TYPE'])
# Energy Recovery: INP_ERV_TYPE
INP_ERV_TYPE = ('Heat Recovery Type', idf_vals['INP_ERV_TYPE'])

# Perimeter QA Flowrate: INP_OA_PER_P
INP_OA_PER_P = ('Outdoor Air Flow per Person', idf_vals['INP_OA_PER_P'])
# Core QA Flowrate: INP_OA_PER_C
INP_OA_PER_C = ('Outdoor Air Flow per Person', idf_vals['INP_OA_PER_C'])
# Perimeter QA Schedule: INP_DCV_SCH_P
INP_DCV_SCH_P = ('Outdoor Air Schedule Name', idf_vals['INP_DCV_SCH_P'])
# Core QA Schedule: INP_DCV_SCH_C
INP_DCV_SCH_C = ('Outdoor Air Schedule Name', idf_vals['INP_DCV_SCH_C'])

# Window Operation: INP_NV_SCH
INP_NV_SCH = ('OutputVariable or OutputMeter Index Key Name', idf_vals['INP_NV_SCH'])

# Weatherization: INP_INF_ACH
INP_INF_ACH = ('Air Changes per Hour', idf_vals['INP_INF_ACH'])

# DHW Flowrate: INP_DHW_FLOW
INP_DHW_FLOW = ('Peak Flow Rate', idf_vals['INP_DHW_FLOW'])
"""
