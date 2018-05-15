import DefaultDataProcessor from './DefaultDataProcessor.jsx';

export default class MITGraphDataProcessor extends DefaultDataProcessor {
    constructor(campusData, filterState){
        super(campusData, filterState);
        this.data = this.filterData(campusData, filterState);
    }

    getMaxMonth() {
        const RES_TYPES = ['elec', 'chw', 'stm'];
        var max = 0;
        for (var i=0; i<RES_TYPES.length; i++){
            var res = RES_TYPES[i];
            var monthly_measured = this.getMonthlyMeasuredData(res);
            var monthly_simulated = this.getMonthlySimulatedData(res);
            for (var j=0; j<monthly_measured.length; j++) {
                if (monthly_measured[j] && monthly_measured[j] > max) {
                    max = monthly_measured[j];
                }
                if (monthly_simulated[j] && monthly_simulated[j] > max) {
                    max = monthly_simulated[j];
                }
            }
        }
        return max;
    }

    getMonthlyMeasuredData(resourceType) {
        var that = this;
        if (that.filterState.selectedYear in that.data.measured) {
            if (that.unitsNormalized()) {
                return that.data.measured[that.filterState.selectedYear][resourceType].map((x)=>{
                    return parseInt(x / parseInt(that.data.metadata.area));
                })
            }
            return that.data.measured[that.filterState.selectedYear][resourceType];

        } else {
            return [null, null, null, null, null, null, null, null, null, null, null, null];
        }
    }

    hasSimulatedData() {
        if (this.filterState.selectedBuilding == '') {
            return false[this.filterState.selectedYear];
        }

        if ('bau' in this.data.simulations) {
            if (this.filterState.selectedYear in this.data.simulations['bau']) {
                return true;
            }
        }

        return false;
    }

    getMonthlySimulatedData(resourceType) {
        if (!this.hasSimulatedData()) {
            return [null, null, null, null, null, null, null, null, null, null, null, null];
        }

        if (this.unitsNormalized()) {
            var that = this;
            return this.data.simulations['bau'][that.filterState.selectedYear][resourceType].map((x)=>{
                return parseInt(x / parseInt(that.data.metadata.area));
            })
        }
        return this.data.simulations['bau'][this.filterState.selectedYear][resourceType];
    }

    getYearlyMeasuredData(axisLabels) {
        var that = this;
        var measuredData = axisLabels.map(function(label) {
            if (label && label in that.data.measured) {
                if (that.data.measured[label]){
                    var filteredByResource = {};
                    for (var res in that.data.measured[label]) {
                        if (that.filterState.selectedResource.includes(res)) {
                            filteredByResource[res] = that.data.measured[label][res];
                        }
                    }
                    var total = that.condense(filteredByResource);

                    if (that.filterState.selectedUnitsNormalized == 'per_m2_per_year') {
                        total = parseInt(total / (that.data.metadata.area));
                    }

                    return total;
                }
            }
            return null;
        });
        return measuredData;
    }

    getYearlySimulatedData(axisLabels) {
        var that = this;
        var simulatedDatasets = Object.keys(that.data.simulations).map(function(simName) {
            var simData = axisLabels.map(function(label){
                if (label && label in that.data.simulations[simName]) {
                    var filteredByResource = {};
                    for (var res in that.data.simulations[simName][label]) {
                        if (that.filterState.selectedResource.includes(res)) {
                            filteredByResource[res] = that.data.simulations[simName][label][res];
                        }
                    }
                    var total = that.condense(filteredByResource);
                    if (that.filterState.selectedUnitsNormalized == 'per_m2_per_year') {
                        total = parseInt(total / (that.data.metadata.area));
                    }

                    return total;
                }
                return null;
            });
            return {label: simName, data: simData};
        });
        return simulatedDatasets;
    }

    filterData(campusData, filterState) {
        var selectedBuildingTypes = filterState.selectedBuildingType;
        var selectedBuilding = filterState.selectedBuilding;
        var selectedUnits = filterState.selectedUnits;
        var graphToggleState = filterState.selectedGraphToggle;

        var filteredData = {metadata: {}, measured: {}, simulations: {}};

        if (selectedBuilding != "" && graphToggleState == 'building') {
            var buildingData = campusData[selectedBuilding];
            filteredData = this._getData(buildingData, selectedUnits);
        } else {
            for (var building in campusData) {
                var buildingMetaData = campusData[building].metadata;
                var buildingData = campusData[building];
                if (selectedBuildingTypes.includes(buildingMetaData.building_type)){
                    var data = this._getData(buildingData, selectedUnits);

                    // Combine areas
                    var area = filteredData.metadata.area;
                    if (!area) {
                        area = 0;
                    }
                    filteredData.metadata.area = area + parseInt(data.metadata.area);

                    //Combine measured data
                    Object.keys(data.measured).map(function(key) {
                        if (key in filteredData.measured) {
                            for (var resource in data.measured[key]) {
                                var values = data.measured[key][resource];
                                if (resource in filteredData.measured[key]){
                                    values.map((val, i) => {
                                        filteredData.measured[key][resource][i] += parseInt(val);
                                    })
                                } else {
                                    filteredData.measured[key][resource] = values.map((x) => {return parseInt(x)});
                                }
                            }
                        } else {
                            filteredData.measured[key] = data.measured[key];
                        }
                    });

                    // Skip simulations for campus wide graph
                }
            }
        }
        return filteredData;
    }

    _getData(buildingData, selectedUnits) {
        var metadata = {area: parseInt(buildingData.metadata.area_m2)};
        var measured = {};
        for (var year in buildingData.measured_data) {
            var year_data = buildingData.measured_data[year];
            if (selectedUnits == 'co2') {
                year_data = this.convertToCO2(year_data);
            }
            measured[year] = year_data;
        }
        var simulations = {};
        for (var i=0; i<buildingData.simulation_data.length; i++){
            var simulation = buildingData.simulation_data[i];
            var finalSim = {};
            for (var year in simulation.simulation) {
                var year_data = simulation.simulation[year];
                if (selectedUnits == 'co2') {
                    year_data = this.convertToCO2(year_data);
                }
                finalSim[year] = year_data;
            }
            simulations[simulation.simulation_name] = finalSim;
        }

        return {metadata: metadata, measured: measured, simulations: simulations};
    }
}
