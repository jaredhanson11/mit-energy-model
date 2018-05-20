from multiprocessing import Pool
import subprocess
import os
import pandas as pd
import csv
import json
import sys
import shutil
import time
import uuid

from zone_multipliers import ZoneMultiplierInterface
from idf_builder import IDFBuilder

models_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../server/server/models/'))
sys.path.append(models_path)
from CampusSimulationDataModel import BuildingSimulationModel

updater_folder = os.path.abspath(os.path.join(os.path.dirname(__file__), 'idf_updates/'))
simulation_folder = os.path.abspath(os.path.join(os.path.dirname(__file__), 'eplus_simulations/'))
IDF_VERSION_UPDATER_FOLDER = '/usr/local/EnergyPlus-8-8-0/PreProcess/IDFVersionUpdater/'
EPWS_FOLDER = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../server/EPW/'))

RUN_ARGS = {'weather': None, 'output_directory': None, 'simulation_year': None, 'building_number': None, 'simulation_name': None}

def _get_vals_list(idf_vals_csv):
    csv_file = open(idf_vals_csv, 'r')
    csv_reader = csv.reader(csv_file)
    rows = []
    for row in csv_reader:
        rows.append(row)
    csv_file.close()
    return rows

def _get_idfs(idf_template, vals_csv, simulation_dir):
    return IDFBuilder.idfs(idf_template, vals_csv, simulation_dir)

def _get_epws():
    ret = {
        '2018': os.path.join(EPWS_FOLDER, './MIT_Building1_Weather.epw'),
        '2020': os.path.join(EPWS_FOLDER, './BostonLoganWeather2020.epw'),
        '2050': os.path.join(EPWS_FOLDER, './BostonLoganWeather2050.epw'),
        '2080': os.path.join(EPWS_FOLDER, './BostonLoganWeather2080.epw')
    }
    return ret

def _make_simulation_dir(bldg_num, sim_name):
    simulation_dirname = ''.join([str(bldg_num.lower()), '_', str(sim_name), '/'])
    simulation_dir = os.path.join(simulation_folder, simulation_dirname)
    if os.path.exists(simulation_dir):
        _rm_simulation_dir(bldg_num, sim_name)
        #raise Exception("Directory " + simulation_dir + ' already exists')
    os.mkdir(simulation_dir)
    return simulation_dir

def _rm_simulation_dir(bldg_num, sim_name):
    simulation_dirname = ''.join([str(bldg_num.lower()), '_', str(sim_name), '/'])
    simulation_dir = os.path.join(simulation_folder, simulation_dirname)
    if os.path.exists(simulation_dir):
        shutil.rmtree(simulation_dir)

def _translate_simulation(eplusout_csv_file, building_number):
    eplusout_csv = pd.read_csv(eplusout_csv_file)
    headers = list(eplusout_csv)
    zone_multipliers = ZoneMultiplierInterface.get_multipliers(building_number)

    months_of_year = ['january', 'february', 'march', 'april', 'may',
            'june', 'july', 'august', 'september', 'october', 'november', 'december']

    for (i, val) in enumerate(eplusout_csv['Date/Time'].values):
        assert val.lower() == months_of_year[i]

    def convert_cols(cols):
        def J_to_KWH(joules):
            J_TO_KWH_CONSTANT = 3600000
            return float(joules) / J_TO_KWH_CONSTANT
        def _convert_cols(row_tup):
            tot = 0
            row = row_tup[1]
            for header in headers:
                for col in cols:
                    if col in header:
                        for zone in zone_multipliers:
                            if zone in header.lower():
                                multiplier = zone_multipliers[zone]
                                break
                        if not multiplier:
                            raise Exception('No zone multiplier for building: %s, header: %s, zone: %s' % (building_number, header, header_zone))
                        tot += float(row[header]) * multiplier
            return J_to_KWH(tot)
        return _convert_cols

    elec_cols = ['Zone Lights Electric Energy', 'Zone Electric Equipment']
    stm_cols = ['Water Use Equipment Heating Energy', 'Zone Ideal Loads Supply Air Total Heating Energy']
    chw_cols = ['Zone Ideal Loads Supply Air Total Cooling Energy']



    ret = {
        'stm': map(convert_cols(stm_cols), eplusout_csv.iterrows()),
        'chw': map(convert_cols(chw_cols), eplusout_csv.iterrows()),
        'elec': map(convert_cols(elec_cols), eplusout_csv.iterrows())
    }

    NO_CHW_BLDGS = ['nw86', 'w51c', 'w61', 'w53', 'w91', 'w51', 'w98', '57', '50',
            'w11', 'w7', 'w5', 'w2', 'w84', 'w85', 'w89', 'e55', 'nw61', 'w31', 'w33',
            'w32', 'e34', 'e38', 'n10', 'n9', 'n4', 'ww15', '17', 'w59', 'n52', 'w92',
            'w45', '44', 'nw22', 'w71', 'w70', 'nw10', 'n57', 'n51']
    NO_CHW_BLDGS = map(lambda x: x.lower(), ['17', '44', '50', '68', 'E33', 'E55', 'N10', 'N4', 'N51', 'N52',
        'N57', 'N9','NW10', 'NW22','NW61', 'NW86','W11','W1','W2','W31',
        'W32','W33','W45','W5','W51','W51C','W53','W61','W7', 'W70','W71','W84','W85','W89','W91','W92','W98','WW15'])

    if (building_number.lower() in NO_CHW_BLDGS):
        print 'Building %s uses electricity as cooling. Calculating now...' % building_number
        elec_cooling_from_chw = map(lambda chw_val: float(chw_val) / 6, ret['chw'])
        ret['chw'] = [0 for i in range(12)]
        elec = []
        for i in range(len(ret['elec'])):
            elec.append(ret['elec'][i] + elec_cooling_from_chw[i])
        ret['elec'] = elec

    print "Sum(stm) = %s" % str(sum(ret['stm']))
    print "Sum(chw) = %s" % str(sum(ret['chw']))
    print "Sum(elec) = %s" % str(sum(ret['elec']))
    print "Sum(total) = %s" % str(sum(ret['stm']) + sum(ret['elec']) + sum(ret['chw']))
    return ret

def _save_results(simulation_name, sim_year, building_number, sim_id, results, extra_years=[]): # TODO DELETE THE EXTRA YEARS PARAMETER ONLY FOR STATA CENTER PRESENTATION
    if BuildingSimulationModel.add_simulation(simulation_name, sim_year, building_number, sim_id, results):
        print "SUCCESS: Results for simulation: %s, number: %s were saved" % (simulation_name, building_number)
        for year in extra_years:
            if BuildingSimulationModel.add_simulation(simulation_name, year, building_number, sim_id, results,):
                print "SUCCESS: Results for simulation: %s, number: %s were saved" % (simulation_name, building_number)
    else:
        print "ERROR: Results for simulation: %s, number: %s were NOT saved" % (simulation_name, building_number)

def _write_results(results, eplusout_csv_file):
    from pprint import pprint
    pprint(results)
    results_fn = os.path.join(os.path.dirname(eplusout_csv_file), 'eplusout.json')
    results_file = open(results_fn, 'w')
    json.dump(results, results_file)

def update_idf_file(input_file, current_version):
    update_command_names = {
        '8.4': IDF_VERSION_UPDATER_FOLDER + 'Transition-V8-4-0-to-V8-5-0',
        '8.5': IDF_VERSION_UPDATER_FOLDER + 'Transition-V8-5-0-to-V8-6-0',
        '8.6': IDF_VERSION_UPDATER_FOLDER + 'Transition-V8-6-0-to-V8-7-0',
        '8.7': IDF_VERSION_UPDATER_FOLDER + 'Transition-V8-7-0-to-V8-8-0'
    }
    if current_version not in update_command_names:
        print "Invalid version number"
        return

    subprocess.call(['cp', input_file, updater_folder])
    input_filename = os.path.basename(input_file)
    updating_filepath = os.path.join(updater_folder, input_filename)
    subprocess.call(['cp', input_file, input_file + '.old'])

    while current_version != '8.8':
        p = subprocess.Popen([update_command_names[current_version], updating_filepath], cwd=IDF_VERSION_UPDATER_FOLDER)
        p.wait()
        current_version = current_version[:2] + str(int(current_version[2]) + 1)

    subprocess.call(['cp', updating_filepath, input_file])

    print
    print "Update Complete"
    #do_del = str(raw_input('Delete update folder? y/(n) ')).lower() == 'y'
    do_del = 'y'
    if do_del:
        [os.remove(os.path.join(updater_folder, f)) for f in os.listdir(updater_folder)]
    return

def _parallelized_run(simulation):
    idf_file = simulation[0]
    args = simulation[1]
    epw_file = args['weather']
    building_number = args['building_number']
    simulation_name = args['simulation_name']
    simulation_year = args['simulation_year']
    simulation_dir = args['output_directory']
    sim_id = args['simulation_id']
    return run_simulation(idf_file, epw_file, building_number, sim_id, simulation_dir, simulation_name, simulation_year)

def parallelize_simulations(idfs, processes=None):
    pool = Pool(processes=processes)
    print "Starting simulations with %s cores" % str(processes)
    start_time = time.time()
    r = pool.map_async(_parallelized_run, idfs)
    r.wait()
    elapsed = time.time() - start_time
    print "Finished simulations"
    print "Total time elapsed: " + str(elapsed)
    return

def run_simulation(idf_file, epw_file, building_number, sim_id, simulation_dir=None, simulation_name=None, simulation_year=None, save=False, extra_years=[]):
    ENERGYPLUS_CMD = '/usr/local/bin/EnergyPlus'
    idf_file_path = os.path.abspath(idf_file)
    epw_file_path = os.path.abspath(epw_file)
    if simulation_dir == None:
        simulation_dir = simulation_folder
    if (not simulation_name or not simulation_year) and save:
        raise Exception('Need simulation name and year to save results')
    command = [ENERGYPLUS_CMD, '-w', epw_file_path, '-x', '-r', idf_file_path]
    print command
    p = subprocess.Popen(command, cwd=simulation_dir)
    p.wait()

    eplusout_csv_file = os.path.abspath(os.path.join(simulation_dir, 'eplusout.csv'))
    if not os.path.exists(eplusout_csv_file):
        print "Energy Plus simulation error."
        return

    results = _translate_simulation(eplusout_csv_file, building_number)
    if save == True:
        _save_results(simulation_name, simulation_year, building_number, sim_id, results, extra_years=extra_years)
    _write_results(results, eplusout_csv_file)

def simulate(idf_template_path, idf_vals_csv, building_number, simulation_name, save=False):
    args = RUN_ARGS.copy()
    args['building_number'] = building_number
    args['simulation_name'] = simulation_name
    args['simulation_id'] = str(uuid.uuid4())

    simulation_dir = _make_simulation_dir(building_number, simulation_name)
    epws_by_year = _get_epws()
    if type(idf_vals_csv) == str:
        idf_vals = _get_vals_list(idf_vals_csv)
    else:
        idf_vals = idf_vals_csv
    idfs = _get_idfs(idf_template_path, idf_vals, simulation_dir)
    for year in epws_by_year:
        idf_simulation_runs = []
        year_dir = os.path.join(simulation_dir, str(year) + '/')
        os.mkdir(year_dir)
        args = args.copy()
        args['simulation_year'] = str(year)
        weather_file = epws_by_year[year]
        args['weather'] = weather_file
        for i, idf in enumerate(idfs):
            args = args.copy()
            sim_i_dir = os.path.join(year_dir, 'sim' + str(i).zfill(3))
            os.mkdir(sim_i_dir)
            args['output_directory'] = sim_i_dir
            simulation_run = [idf, args]
            idf_simulation_runs.append(simulation_run)
        print 'Running simulation: %s for building: %s, year: %s' % (simulation_name, building_number, year)
        parallelize_simulations(idf_simulation_runs)
