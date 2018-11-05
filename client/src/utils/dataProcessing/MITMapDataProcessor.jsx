import DefaultDataProcessor from './DefaultDataProcessor.jsx';
import GOFCalulator from '../GOFCalulator.jsx';

export default class MITMapDataProcessor extends DefaultDataProcessor{
    constructor(campusData, filterState) {
        super(campusData, filterState);
        this.data = this.filterData(campusData, filterState);
    }

    containsBuilding(buildingNum) {
        return (buildingNum.toString().toLowerCase() in this.data);
    }

    isGOFWarning(buildingNumber) {
        buildingNumber = buildingNumber.toString().toLowerCase();
        if (this.getBuildingGOF(buildingNumber) > 30) {
            return true;
        }
        return false;
    }

    getBuildingGOF(buildingNumber) {
        buildingNumber = buildingNumber.toString().toLowerCase();
        if (this.containsBuilding(buildingNumber) && this.data[buildingNumber].gof) {
            return parseInt(this.data[buildingNumber].gof);
        }
        return 0;
    }

    getBuildingEnergyUsage(buildingNumber) {
        if (this.filterState.selectedDataSource == 'warning') {
            return this.getBuildingGOF(buildingNumber);
        }
        var that = this;
        buildingNumber = buildingNumber.toString().toLowerCase();
        if (!that.containsBuilding(buildingNumber)) {
            return 0;
        } else {
            if (this.unitsNormalized()){
                return parseInt(that.data[buildingNumber].energy/that.getBuildingArea(buildingNumber));
            } else {
                return parseInt(that.data[buildingNumber].energy);
            }
        }
    }

    getCampusGOF() {
        var that = this;
        var energy_sum = 0;
        var total_bldgs = 0;
        var measured_and_gof = Object.keys(that.data).map(function(key){
            if (that.data[key].energy && that.data[key].gof) {
                total_bldgs += 1;
                energy_sum += parseInt(that.data[key].energy)
                return [that.data[key].energy, that.data[key].gof];
            } else {
                return [0, 0];
            }
        });

        if (!(measured_and_gof) || measured_and_gof.length == 0) {
            return 0;
        }

        var weighted_avg = 0;
        for (var i=0; i<measured_and_gof.length; i++ ){
            var weight = measured_and_gof[i][0] / parseFloat(energy_sum);
            var gof_weighted = measured_and_gof[i][1] * weight;
            weighted_avg += gof_weighted;
        }
        return parseInt(weighted_avg);
    }

    getCampusEnergyUsage() {
        if (this.filterState.selectedDataSource == 'warning') {
            return this.getCampusGOF();
        }
        var that = this;
        var energy_values = Object.keys(that.data).map(function(key){
            return that.data[key].energy;
        });

        if (!(energy_values) || energy_values.length == 0) {
            return 0;
        }

        var sum = energy_values.reduce(function(a,b){return a+b});
        if (this.unitsNormalized()) {
            return parseInt(sum/this.getCampusArea());
        } else {
            return parseInt(sum);
        }
    }

    getBuildingArea(buildingNumber) {
        var that = this;
        buildingNumber = buildingNumber.toString().toLowerCase();
        if (!that.containsBuilding(buildingNumber)) {
            return 0;
        } else {
            return parseInt(that.data[buildingNumber].metadata.area_m2);
        }
    }

    getCampusArea() {
        var that = this;
        var areas = Object.keys(that.data).map(function(key) {
            return parseInt(that.data[key].metadata.area_m2);
        });

        if (!(areas) || areas.length == 0) {
            return 0;
        }

        var sum = areas.reduce(function(a,b){return a+b});
        return parseInt(sum);
    }

    getBuildingType(buildingNumber) {
        var that = this;
        buildingNumber = buildingNumber.toString().toLowerCase();
        if (!that.containsBuilding(buildingNumber)) {
            return '';
        } else {
            return that.data[buildingNumber].metadata.building_type;
        }
    }

    getGOFCampusMax() {
        return 100;
    }

    getCampusMax() {
        if (this.filterState.selectedDataSource == 'warning') {
            return this.getGOFCampusMax();
        }
        var that = this;
        var values = Object.values(that.data).map(function(x) {
            if (that.filterState.selectedUnitsNormalized == 'per_m2_per_year') {
                return parseInt(x.energy / x.metadata.area_m2);
            }
            return x.energy;
        });
        if (values.length > 0){
            return Math.max(...values);
        } else {
            return 1;
        }
    }

    getGOFCampusMin() {
        return 15;
    }

    getCampusMin() {
        if (this.filterState.selectedDataSource == 'warning') {
            return this.getGOFCampusMin();
        }
        var that = this;
        var values = Object.values(that.data).map(function(x) {
            if (that.filterState.selectedUnitsNormalized == 'per_m2_per_year') {
                return parseInt(x.energy / x.metadata.area_m2);
            }
            return x.energy;
        });
        if (values.length > 0) {
            return Math.min(...values);
        } else {
            return 0;
        }
    }

    calculateGOFData(campusData, filterState) {
        var filteredData = {};
        for (var building in campusData) {
            if (building == "E38") {continue;}
            var buildingMetaData = campusData[building].metadata;
            var simData;
            var measuredData;
            if (filterState.selectedBuildingType.includes(buildingMetaData.building_type)) {
                simData = this._getSimulatedData(campusData[building], filterState);
                measuredData = this._getMeasuredData(campusData[building], filterState);

                if (!simData || Object.keys(simData).length == 0 ||
                        !measuredData || Object.keys(measuredData).length == 0) {
                    continue;
                }

                if (filterState.selectedUnits == 'co2') {
                    simData = this.convertToCO2(simData);
                    measuredData = this.convertToCO2(measuredData);
                }

                var gof = GOFCalulator.calculateGOF(filterState, measuredData, simData);
                if (gof) {
                    filteredData[building.toLowerCase()] = {metadata: buildingMetaData, energy: gof};
                }
            }
        }
        return filteredData;
    }

    filterData(campusData, filterState) {
        var selectedBuildingTypes = filterState.selectedBuildingType;
        var selectedDataSource = filterState.selectedDataSource;
        var filteredData = {};

        for (var building in campusData) {
            var buildingMetaData = campusData[building].metadata;
            if (selectedBuildingTypes.includes(buildingMetaData.building_type)) {
                var simData = this._getSimulatedData(campusData[building], filterState);
                var measuredData = this._getMeasuredData(campusData[building], filterState);
                if (filterState.selectedUnits == 'co2') {
                    simData = this.convertToCO2(simData);
                    measuredData = this.convertToCO2(measuredData);
                }
                if (!simData || Object.keys(simData).length == 0 ||
                        !measuredData || Object.keys(measuredData).length == 0) {
                    var gof = null;
                } else {
                    var gof = GOFCalulator.calculateGOF(filterState, measuredData, simData); //GOF calulated before zeroing all non 2018 values
                }
                if (building.toLowerCase() == 'e38') {
                    gof = null;
                }
                if (filterState.selectedYear == '2018') {
                    var currMonth = new Date().getMonth();
                    for (var resType in data) { // zero out this month til last month bc energy data not yet loaded for future/this month
                        for (var i=currMonth; i<12; i++){
                            data[resType][i] = null;
                        }
                    }
                }
                var energy_data = measuredData;
                if (selectedDataSource == 'simulated') {
                    energy_data = simData;
                } else if (selectedDataSource == 'warning' && gof == null){
                    continue;
                }
                var data = this.condense(energy_data);
                if (data) {
                    var _building = {metadata: buildingMetaData, energy: data};
                    if (gof) {
                        _building['gof'] = gof;
                    }
                    filteredData[building.toLowerCase()] = _building;
                }
            }
        }
        return filteredData;
    }

    _getSimulatedData(buildingData, filterState) {
        var bau_simulation = undefined;
        buildingData.simulation_data.map(function(x){
            if (x.simulation_name=='bau') {
                bau_simulation = x;
            }
        })
        if (bau_simulation) {
            if (filterState.selectedYear in bau_simulation.simulation) {
                var energy_by_type = {};
                for (var i = 0; i < filterState.selectedResource.length; i++){
                    var resourceType = filterState.selectedResource[i];
                    if (resourceType in bau_simulation.simulation[filterState.selectedYear]) {
                        energy_by_type[resourceType] = bau_simulation.simulation[filterState.selectedYear][resourceType];
                    }
                }
                return energy_by_type;
            }
        }
        return {};
    }

    _getMeasuredData(buildingData, filterState) {
        if (filterState.selectedYear in buildingData.measured_data) {
            var energy_by_type = {}
            for (var i = 0; i < filterState.selectedResource.length; i++){
                var resourceType = filterState.selectedResource[i];
                if (resourceType in buildingData.measured_data[filterState.selectedYear]) {
                    energy_by_type[resourceType] = buildingData.measured_data[filterState.selectedYear][resourceType];
                }
            }
            return energy_by_type;
        }
        return {};
    }
}
