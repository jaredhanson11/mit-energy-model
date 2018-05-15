import os
import subprocess

idfs_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../idf/'))
eplus_sim_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../scripts/eplus_simulation.py'))

def _building(num):
    num = str(num).lower()
    return {'num': str(num), 'idf': os.path.join(idfs_path, str(num).upper() + '.idf')}


already_run = ['E1', 'E17', 'E18', 'E19', 'E2', 'E23', 'E25', 'E33', 'E34', 'E38', 'E40', 'E52', 'E53', 'E55', 'E60', 'E62']
building_numbers = ['E1', 'E17', 'E18', 'E19', 'E2', 'E23', 'E25', 'E33', 'E34', 'E38', 'E40', 'E52', 'E53', 'E55', 'E60', 'E62', 'N10', 'N4', 'N51', 'N52', 'N57', 'N9', 'NW10', 'NW12', 'NW13', 'NW14', 'NW15', 'NW21', 'NW22', 'NW30', 'NW35', 'NW61', 'NW86', 'W11', 'W15', 'W16', 'W2', 'W31', 'W32', 'W33', 'W34', 'W35', 'W45', 'W5', 'W51', 'W53', 'W59', 'W51C', 'W61', 'W7', 'W70', 'W71', 'W79', 'W84', 'W85', 'W89', 'W91', 'W92', 'W98', 'WW15']
buildings = map(lambda x: _building(x), building_numbers)
buildings.append(_building(17))
buildings.append(_building(50))
buildings.append(_building(44))

buildings = [_building('E14'), _building('E15'), _building('W15'), _building('NW30')]

# buildings = [
#    # _building(1),
#    # _building(2),
#    _building(3),
#    _building(4),
#    _building(5),
#    _building(6),
#    _building(7),
#    _building(8),
#    _building(9),
#    _building(10),
#    _building(11),
#    _building(13),
#    _building(14),
#    _building(16),
#    _building(17),
#    _building(24),
#    _building(26),
#    _building(31),
#    _building(32),
#    _building(33),
#    _building(34),
#    _building(35),
#    _building(36),
#    _building(37),
#    _building(38),
#    _building(39),
#    _building(41),
#    _building(44),
#    _building(46),
#    _building(48),
#    _building(50),
#    _building(56),
#    _building(68)
#]

buildings = filter(lambda x: x.endswith('.idf'), os.listdir(idfs_path))
buildings = map(lambda x: _building(x[:-4]), buildings)

epw_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../EPW/'))
def _epw(name, year):
    return {'epw': os.path.join(epw_path, name), 'year': str(year)}
epw_names = ['USA_MA_Boston-Logan.Intl.AP.725090_TMY3.epw', 'MIT_Building1_Weather.epw', 'BostonLoganWeather2020.epw', 'BostonLoganWeather2050.epw', 'BostonLoganWeather2080.epw']
years = [2017, 2018, 2020, 2050, 2080]

epws = [_epw(epw_names[i], years[i]) for i in range(len(years))]

start = False
first_building = '32'
for b in buildings:
    if b['num'] == first_building:
        start = True
    if not start:
        continue
    print "Running sim for"
    print b
    for epw in epws:
        run_sim = ['/usr/local/bin/python2.7', eplus_sim_path, '-i', b['idf'], '-b', b['num'], '-y', epw['year'], '-w', epw['epw'], '-n', 'bau']
        print ' '.join(run_sim)
        p = subprocess.Popen(run_sim)
        p.wait()
