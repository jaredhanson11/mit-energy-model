import os
import peewee

db = peewee.MySQLDatabase('campus_energy_model', user='sdl', password='SDL@2017', host='52.11.126.32', port=3306)

def connect_db():
    db.connect()

class BaseModel(peewee.Model):
    class Meta:
        database = db

class CampusSimulationDataModel(BaseModel):
    id = peewee.PrimaryKeyField()
    building_number = peewee.CharField(unique = True)
    # building_simulations through backref

    def simulation_exists(self, simulation_name, simulation_year):
        for simulation in self.building_simulations:
            if simulation.simulation_name == simulation_name \
                    and simulation.simulation_year == simulation_year:
                return simulation
        return None

    @staticmethod
    def add_building(building_number):
        new_building = CampusSimulationDataModel(building_number=building_number)
        new_building.save()
        return new_building

    @staticmethod
    def get_building_simulation(building_number, default_measured={}): # TODO FIX THIS
        '''
        Need a default for when simulations aren't present, thats why extra parameter.
            TODO remove default_measured once every building has simulation
        '''
        building_rec = CampusSimulationDataModel.get_or_none(CampusSimulationDataModel.building_number==building_number)
        if not building_rec:
            building_rec = CampusSimulationDataModel.add_building(building_number)
        year_simulation = {'simulation_name': None, 'simulation': None}
        simulations = []
        for building_sim in building_rec.building_simulations:
            for existing in simulations:
                if existing['simulation_name'] == building_sim.simulation_name:
                    existing['simulation'].update(building_sim.get_json())
                    break
            else:
                new_year = {}
                new_year.update(year_simulation)
                new_year['simulation_name'] = building_sim.simulation_name
                new_year['simulation'] = building_sim.get_json()
                simulations.append(new_year)
        simulations = sorted(simulations, key=lambda k: k['simulation_name'])
        return simulations

class BuildingSimulationModel(BaseModel):
    id = peewee.PrimaryKeyField()
    simulation_name = peewee.CharField(null=False)
    building_id = peewee.ForeignKeyField(CampusSimulationDataModel, backref='building_simulations')
    simulation_year = peewee.IntegerField(null=False)
    simulation_id = peewee.CharField(null=False)
    # simulations through backref


    def delete_simulation(self):
        for simulation in self.simulations:
            simulation.delete_instance()
        self.delete_instance()

    @staticmethod
    def add_simulation(simulation_name, sim_year, building_number, sim_id, results):
        building = CampusSimulationDataModel.get_or_none(CampusSimulationDataModel.building_number==building_number)
        if not building:
            building = CampusSimulationDataModel.add_building(building_number.lower())
        prior_simulation = building.simulation_exists(simulation_name, sim_year)
        if prior_simulation:
            if prior_simulation.simulation_id != sim_id:
                y_n = 'y'
                if y_n.lower().strip() == 'y':
                    print('Deleting prior simulation ...')
                    prior_simulation.delete_simulation()
                    new_building_sim = BuildingSimulationModel(simulation_name=simulation_name, building_id=building.id , simulation_year=sim_year, simulation_id=sim_id)
                    prior_simulation = new_building_sim
                    prior_simulation.save()
                else:
                    print('Quitting ...')
                    return
        else:
            new_building_sim = BuildingSimulationModel(simulation_name=simulation_name, building_id=building.id , simulation_year=sim_year, simulation_id=sim_id)
            prior_simulation = new_building_sim
            prior_simulation.save()

        new_sim = BaseSimulation(building_simulation_id=prior_simulation.id)
        for resource_type in ['chw', 'stm', 'elec']:
            if resource_type not in results:
                raise Exception('Results did not have %s data' % resource_type)
            year_by_month = results[resource_type]
            for i, month in enumerate(year_by_month):
                month_i = i + 1
                attr_name = resource_type + '_' + str(month_i)
                print(attr_name, month)
                setattr(new_sim, attr_name, month)
        new_sim.save()
        return new_sim

    def get_json(self):
        return {self.simulation_year: map(lambda x: x.get_json(), self.simulations)[0]}





class BaseSimulation(BaseModel):
    id = peewee.PrimaryKeyField()
    building_simulation_id = peewee.ForeignKeyField(BuildingSimulationModel, backref='simulations')

    # Results of an eplus simulation for the building in format
    #   [resource type]_[month number] = [energy used in joules]

    chw_1 = peewee.FloatField()
    chw_2 = peewee.FloatField()
    chw_3 = peewee.FloatField()
    chw_4 = peewee.FloatField()
    chw_5 = peewee.FloatField()
    chw_6 = peewee.FloatField()
    chw_7 = peewee.FloatField()
    chw_8 = peewee.FloatField()
    chw_9 = peewee.FloatField()
    chw_10 = peewee.FloatField()
    chw_11 = peewee.FloatField()
    chw_12 = peewee.FloatField()
    stm_1 = peewee.FloatField()
    stm_2 = peewee.FloatField()
    stm_3 = peewee.FloatField()
    stm_4 = peewee.FloatField()
    stm_5 = peewee.FloatField()
    stm_6 = peewee.FloatField()
    stm_7 = peewee.FloatField()
    stm_8 = peewee.FloatField()
    stm_9 = peewee.FloatField()
    stm_10 = peewee.FloatField()
    stm_11 = peewee.FloatField()
    stm_12 = peewee.FloatField()
    elec_1 = peewee.FloatField()
    elec_2 = peewee.FloatField()
    elec_3 = peewee.FloatField()
    elec_4 = peewee.FloatField()
    elec_5 = peewee.FloatField()
    elec_6 = peewee.FloatField()
    elec_7 = peewee.FloatField()
    elec_8 = peewee.FloatField()
    elec_9 = peewee.FloatField()
    elec_10 = peewee.FloatField()
    elec_11 = peewee.FloatField()
    elec_12 = peewee.FloatField()

    def get_json(self):
        results = {}
        for resource_type in ['chw', 'stm', 'elec']:
            year_by_month = []
            for i in range(1, 13):
                attr_name = resource_type + '_' + str(i)
                year_by_month.append(int(getattr(self, attr_name)))
            results[resource_type] = year_by_month
        return results
