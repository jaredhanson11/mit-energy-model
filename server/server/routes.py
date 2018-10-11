from . import api
from .controllers import CampusEnergyDataController

def add_routes():
    api.add_resource(CampusEnergyDataController.CampusEnergyDataController, '/campus/')
    api.add_resource(CampusEnergyDataController.MonthlyEnergyDataController, '/campus_meu/')
