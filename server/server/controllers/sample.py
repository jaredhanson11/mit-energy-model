from flask import request
from flask_restful import Resource

from ..utils import responses

# Import the models we will interact with
from ..models.sample import SampleModel

class SampleController(Resource):
    def get(self):
        '''
        Returns all the current records.
        '''
        records = SampleModel.get_all()
        return responses.success({'records': map(lambda rec: rec.toJSON(), records)})

    def post(self):
        '''
        /?record_name=<str>

        Adding a record to the database.
        Note:
            Using url parameters instead of form data for simplicity.
        '''
        record_name = request.args.get('record_name')
        if not record_name:
            record_name= 'Flask-Test'
        added = SampleModel.add_record(record_name)

        if added:
            return responses.success({'message': 'Successfully added %s' % record_name})
        else:
            return responses.error({'message': 'There was an error adding %s' % record_name})
