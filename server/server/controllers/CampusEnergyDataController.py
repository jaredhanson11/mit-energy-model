from flask import request
from flask_restful import Resource

import sys
import psycopg2
from psycopg2 import sql

from .. import app, CampusEnergyData
from ..utils import responses
from ..models.CampusSimulationDataModel import CampusSimulationDataModel

import datetime

class CampusEnergyDataController(Resource):
    def get(self):
        # Implement the hourly data retrieval methods here.
        pass

class MonthlyEnergyDataController(Resource):
    def get(self):
        campus = {}
        meu = self._get_monthly_energy()

        building_metadata = CampusEnergyData.building_metadata()
        for building in CampusEnergyData.whitelisted_buildings():
            if building not in meu:
                continue
            simulations = CampusSimulationDataModel.get_building_simulation(building.lower(), default_measured=meu[building])
            
            print(building)

            campus[building] = {
                    'measured': meu[building],
                    'metadata': building_metadata[building],
                    'simulations': simulations
            }
        return responses.success({'campus': campus})

    def _get_monthly_energy(self):
        meu_by_building = {}

        print(datetime.datetime.now(), 'get meu')

        # pg-prod-dsg-vpc.c1nco6fiolky.us-east-1.rds.amazonaws.com
        db = psycopg2.connect('host=52.86.127.46 user=sustdesignlab password=I78ZQ10 dbname=dsg_prod')
        cursor = db.cursor()
        tables = {
            'stm': 'cdr_stm',
            'elec': 'cdr_elec',
            'chw': 'cdr_chw'
        }
        query_base = sql.SQL('SELECT * from sustain.{}')

        for table in tables:
            values_by_building = {}
            table_name = tables[table]

            query = query_base.format(sql.Identifier(table_name))
            cursor.execute(query)

            headers = [desc[0] for desc in cursor.description]
            for i, building in enumerate(headers):
                #ignore the date fields
                if i < 3:
                    continue
                building = CampusEnergyData.name_translations(building)
                if building not in values_by_building:
                    values_by_building[building] = [0 for i in range(12)]

            monthly_data = cursor.fetchall()
            for row in monthly_data:
                for j, value in enumerate(row):
                    if value == None:
                        value = 0
                    #ignore the date fields but keep track of month
                    if j < 3:
                        if j == 1:
                            month_index = int(value) - 1
                        continue
                    building_number = CampusEnergyData.name_translations(headers[j])
                    kwh_used = CampusEnergyData.to_kwh(float(value), table)
                    values_by_building[building_number][month_index] = kwh_used

            for building in values_by_building:
                if building not in meu_by_building:
                    meu_by_building[building] = {}
                meu_by_building[building][table] = values_by_building[building]

        return meu_by_building
