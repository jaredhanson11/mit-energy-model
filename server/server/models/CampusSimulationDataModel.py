import os
import peewee

path_to_db = os.path.join(
    os.path.dirname(os.path.realpath(__file__)),
    'db',
    'model_simulations.db'
)

db = peewee.SqliteDatabase(path_to_db)

class BaseModel(peewee.Model):
    class Meta:
        database = db

class CampusSimulationDataModel(BaseModel):
    id = peewee.PrimaryKeyField()
    building_number = peewee.CharField(unique = True)
    # simulations through backref

    def simulation_exists(self, simulation_name, simulation_year):
        for simulation in self.simulations:
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
    def get_building_simulation(building_number, default_measured={}):
        '''
        Need a default for when simulations aren't present, thats why extra parameter.
            TODO remove default_measured once every building has simulation
        '''
        building_rec = CampusSimulationDataModel.get_or_none(CampusSimulationDataModel.building_number==building_number)
        if not building_rec:
            building_rec = CampusSimulationDataModel.add_building(building_number)
        year_simulation = {'simulation_name': None, 'simulation': None}
        simulations = []
        for sim in building_rec.simulations:
            for existing in simulations:
                if existing['simulation_name'] == sim.simulation_name:
                    existing['simulation'].update(sim.get_json())
                    break
            else:
                new_year = {}
                new_year.update(year_simulation)
                new_year['simulation_name'] = sim.simulation_name
                new_year['simulation'] = sim.get_json()
                simulations.append(new_year)
        simulations = sorted(simulations, key=lambda k: k['simulation_name'])
        return simulations


class BuildingSimulationModel(BaseModel):
    id = peewee.PrimaryKeyField()
    simulation_name = peewee.CharField(null=False)
    building_id = peewee.ForeignKeyField(CampusSimulationDataModel, backref='simulations')
    simulation_year = peewee.IntegerField(null=False)

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

    @staticmethod
    def add_simulation(simulation_name, sim_year, building_number, results):
        building = CampusSimulationDataModel.get_or_none(CampusSimulationDataModel.building_number==building_number)
        if not building:
            building = CampusSimulationDataModel.add_building(building_number.lower())
        prior_simulation = building.simulation_exists(simulation_name, sim_year)
        print prior_simulation
        if prior_simulation:
            print 'This simulation exists in your database already, delete it?'
            y_n = raw_input('y/(n)')
            if y_n.lower().strip() == 'y':
                print 'Deleting prior simulation ...'
                prior_simulation.delete_instance()
            else:
                print 'Quitting ...'
                return

        new_sim = BuildingSimulationModel(simulation_name=simulation_name, building_id=building.id , simulation_year=sim_year)
        for resource_type in ['chw', 'stm', 'elec']:
            if resource_type not in results:
                raise Exception('Results did not have %s data' % resource_type)
            year_by_month = results[resource_type]
            for i, month in enumerate(year_by_month):
                month_i = i + 1
                attr_name = resource_type + '_' + str(month_i)
                print attr_name, month
                setattr(new_sim, attr_name, month)
        new_sim.save()
        return new_sim

    def get_json(self):
        results = {}
        for resource_type in ['chw', 'stm', 'elec']:
            year_by_month = []
            for i in range(1, 13):
                attr_name = resource_type + '_' + str(i)
                year_by_month.append(int(getattr(self, attr_name)))
            results[resource_type] = year_by_month
        ret = {self.simulation_year: results}
        return ret
