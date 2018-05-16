import sys
import os
import subprocess

idf_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../idf/'))
old_idf_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../idf/v8_4-idfs/'))
update_script = os.path.abspath(os.path.join(os.path.dirname(__file__), './../update_idf_v8_8.py'))
python = '/usr/local/bin/python2.7'


# completed = ['E1', 'E17', 'E18', 'E19', 'E2', 'E23', 'E25', 'E33', 'E34', 'E38', 'E40', 'E52', 'E53', 'E55', 'E60', 'E62', 'N10', 'N4', 'N51', 'N52', 'N57', 'N9', 'NW10', 'NW12', 'NW13', 'NW14', 'NW15', 'NW21']
building_numbers = ['NW22', 'NW30', 'NW35', 'NW61', 'NW86', 'W11', 'W15', 'W16', 'W2', 'W31', 'W32', 'W33', 'W34', 'W35', 'W45', 'W5', 'W51', 'W53', 'W59', 'W51C', 'W61', 'W7', 'W70', 'W71', 'W79', 'W84', 'W85', 'W89', 'W91', 'W92', 'W98', 'WW15']
for building in building_numbers:
    idf = os.path.join(old_idf_path, building + '.idf')
    args = [python, update_script, '-v', '8.4', '-i', idf]
    print args
    p = subprocess.Popen(args)
    p.wait()
    cp_args = ['mv', idf, os.path.join(idf_path, building + '.idf')]
    p = subprocess.Popen(cp_args)
    p.wait()

