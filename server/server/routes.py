from . import api
import controllers.meu_converter

def add_routes():
    api.add_resource(controllers.meu_converter.MEU_Converter, '/upload/')
