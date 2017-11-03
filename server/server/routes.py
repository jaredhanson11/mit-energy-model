from . import api
import controllers.CampusEnergyDataController

def add_routes():
    api.add_resource(controllers.CampusEnergyDataController.CampusEnergyDataController, '/campus/')
    api.add_resource(controllers.CampusEnergyDataController.MonthlyEnergyDataController, '/campus_meu/')
