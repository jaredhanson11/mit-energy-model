from flask import request
from flask_restful import Resource

import psycopg2
from psycopg2 import sql

from .. import app, CampusEnergyData
from ..utils import responses

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
            campus[building] = {
                    'measured': meu[building],
                    'metadata': building_metadata[building]
            }

        return responses.success({'campus': campus})

    def _get_monthly_energy(self):
        meu_by_building = {}

        db = psycopg2.connect(app.config['PI_ENERGY_DB_URI'])
        cursor = db.cursor()
        tables = {
            'chw': 'monthly_utility_chw',
            'stm': 'monthly_utility_stm',
            'elec': 'monthly_utility_elec'
        }
        query_base = sql.SQL('SELECT * from sustain.{}')

        for table in tables:
            values_by_building = {}
            table_name = tables[table]

            query = query_base.format(sql.Identifier(table_name))
            cursor.execute(query)

            headers = [desc[0] for desc in cursor.description]
            for i, building in enumerate(headers):
                if i < 3:
                    continue
                building = CampusEnergyData.name_translations(building)
                if building not in values_by_building:
                    values_by_building[building] = [0 for i in range(12)]

            monthly_data = cursor.fetchall()
            for row in monthly_data:
                for j, value in enumerate(row):
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

        for building in meu_by_building:
            _len = len(meu_by_building[building].values()[0])
            tot = []
            for i in range(_len):
                _tot = 0
                for energy_type in meu_by_building[building]:
                    _tot += meu_by_building[building][energy_type][i]
                tot.append(_tot)
            meu_by_building[building]['total'] = tot


        return meu_by_building
