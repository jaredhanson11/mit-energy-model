import os
import subprocess

idfs_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../idf/'))
eplus_sim_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../scripts/eplus_simulation.py'))
epw_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../EPW/USA_MA_Boston-Logan.Intl.AP.725090_TMY3.epw'))

def _building(num):
    num = str(num).lower()
    return {'num': str(num), 'idf': os.path.join(idfs_path, str(num).upper() + '.idf')}

buildings = filter(lambda x: x.endswith('.idf'), os.listdir(idfs_path))
buildings = map(lambda x: _building(x[:-4]), buildings)

for b in buildings:
    print 'Running sim for'
    print b
    run_sim = ['/usr/local/bin/python2.7', eplus_sim_path, '-i', b['idf'], '-b', b['num'], '-y', '2017', '-w', epw_path, '-n', 'bau']
    print ' '.join(run_sim)
    p = subprocess.Popen(run_sim)
    p.wait()

