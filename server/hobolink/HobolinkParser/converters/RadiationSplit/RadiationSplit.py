'''
gen_reindl:
Program that transforms global irradiances into horizontal diffuse and direct normal irradiances
Note that the -o option has to be specified!
Note that the -i option has to be specified!

Supported options are:
    -i input file [format: month day hour global_irradiation
    -o output file [format: month day hour dir_norm_irrad dif_hor_irrad
    -m time zone
    -l longitude [DEG, West is positive]
    -a latitude [DEG, North is positive]
'''

import os
import subprocess

class RadiationSplit:
    ''' Transforms solar radiation to dir_norm_irrad and dif_hor_irrad

    Uses gen_reindl program to generate horizontal diffuse and direct normal
    irradiances from solar radiance, datetime, and lat/long.

    '''

    GEN_REINDL_DIRECTORY = os.path.join(os.getcwd(), 'gen_reindl_files/')

    def __init__(self, dt, solar_radiation, latitude, longitude):
        '''
        Initializes RadiationSplit object

        Args:
            dt(datetime.datetime): Datetime of recorded solar radiance
            solar_radiation(float): Solar radiance
            latitude(float): Latidude of recorded solar radiance
            longitude(float): Longitude of recorded solar radiance
        '''
        self.dt = dt
        self.solar_radiation = solar_radiation
        self.latitude = latitude
        self.longitude = longitude

    def split_radiation(self):
        '''
        Splits solar radiation.

        Returns:
            dict: Containing direct normal irradiances and horizontal diffuse.

            {dir_norm_irrad: float, dif_hor_irrad: float}
        '''
        self._write_input_file()
        self._run_gen_reindl()
        output = self._read_output_file()
        self._clean_up()
        ret = {'dir_norm_irrad': output[0], 'dif_hor_irrad': output[1]}
        return ret

    def _write_input_file(self):
        '''
        Writes input file needed for gen_reindl progam.
        '''
        month = self.dt.month
        day = self.dt.day
        minutes_decimal = self.dt.minute / 60.
        hour = self.dt.hour + minutes_decimal
        solar_radiation = self.solar_radiation

        input_template = "%s %s %s %s" # month day hour solar_radiation
        input_file_contents = input_template % (month, day, hour, solar_radiation)
        input_file = open(self._get_file_path(True), 'w')
        input_file.write(input_file_contents)
        input_file.close()

    def _run_gen_reindl(self):
        args_list = ['gen_reindl', '-i', self._get_file_path(True),
                '-o', self._get_file_path(False), '-m', '75',
                '-a', str(self.latitude), '-l', str(self.longitude)]
        print args_list
        subprocess.Popen(args_list)

    def _read_output_file(self):
        output_file = open(self._get_file_path(False), 'r')
        dir_norm_irrad, dif_hor_irrad = output_file.next().strip().split(' ')[-2:]
        return tuple([float(dir_norm_irrad), float(dif_hor_irrad)])

    def _clean_up(self):
        to_remove = [self._get_file_path(True), self._get_file_path(False)]
        for f in to_remove:
            os.remove(f)

    def _get_file_path(self, is_input):
        '''
        Get the os.path object for the input or output file of gen_reindl

        Args:
            is_input(bool): True for input file, False for output file

        Returns:
            os.path: File path for input or output file.
        '''
        filename_template = '%s%s%s%s' # month day hour min
        _filename = filename_template % (self.dt.month, self.dt.day, self.dt.hour, self.dt.minute)
        _filename = _filename.replace(' ', '-').replace('.', '')
        if is_input:
            _filename += '-in.txt'
        else:
            _filename += '-out.txt'
        filename = os.path.join(self.GEN_REINDL_DIRECTORY, _filename)
        return filename