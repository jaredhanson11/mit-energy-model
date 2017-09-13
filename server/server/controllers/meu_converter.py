import os
import csv

from flask import request
from flask_restful import Resource
from werkzeug.utils import secure_filename

import config
from ..utils import responses

# Import the models we will interact with
from ..models.sample import SampleModel

class DerekFormatConverter:
    def __init__(self, derek_csv):
        self.derek_csv = derek_csv

    def convert(self):
        '''
        '''
        csv_reader = csv.reader(self.derek_csv)
        return self.derek_csv


class MEU_Converter(Resource):
    def post(self):
        '''
        Converts the csv file that is uploaded
        '''
        csv_upload = request.files.get('csv_upload')
        if csv_upload.filename.endswith('.csv'):
            filename = secure_filename(csv_upload.filename)
            format_converter = DerekFormatConverter(csv_upload)
            converted_csv = format_converter.convert()
            converted_csv.save(os.path.join(config.TEMP_FOLDER, filename))
            return responses.success({'filename': filename})


