
const LABELS = ['2014', '2015', '2016', '2017', '2018', '' , '2020', '', '2050', '','2080'];


function _dataPointTemplate(labelName) {
    return {
        label: labelName,
        measured: undefined,
        modeled: {}
    }
}

export function getLabels() {
    return LABELS;
}

function getMeasuredData(filterState, buildingData, historicalBuildingData) {
    var data = LABELS.map(function(label) {
        if (parseInt(label)) {
                if (parseInt(label) < new Date().getFullYear()) {
                    if (filterState.selectedBuilding) {
                        return getDataPoint(
                                historicalBuildingData[label][filterState.selectedBuilding],
                                filterState.selectedResource)
                    } else {
                        return Object.keys(buildingData.campus).map(function(building) {
                            if (historicalBuildingData[label][building]) {
                                return getDataPoint(
                                historicalBuildingData[label][building],
                                filterState.selectedResource)

                            } else {return 0;}
                        }).reduce((a, b) => a +b );
                    }
                } else if(parseInt(label) == new Date().getFullYear()) {
                    if (filterState.selectedBuilding) {
                        return getDataPoint(
                                buildingData.campus[filterState.selectedBuilding].building_data.measured_kwh,
                                filterState.selectedResource)
                    } else {
                        return Object.keys(buildingData.campus).map(function(building) {
                            return getDataPoint(
                                    buildingData.campus[building].building_data.measured_kwh,
                                    filterState.selectedResource)
                        }).reduce((a, b) => a +b );
                    }
                }
        }
        return null;
    });

    return {
        label: 'Measured',
        type: 'bar',
        data: data,
        fill: false
    };
}

function getSimulatedData(filterState, buildingData, histroicalBuildingData) {
    if (filterState.selectedBuilding == "") {
        return []; // not doing overview for now
    }
    var simulation_datsets = buildingData.campus[filterState.selectedBuilding].simulations.map(function(simulationObj){
        var data = getLabels().map(function(){return null})

        Object.keys(simulationObj.simulation).map(function(simYear) {
            if (getLabels().indexOf(simYear.toString()) != -1) {
                data[getLabels().indexOf(simYear.toString())] = getDataPoint(simulationObj.simulation[simYear],
                        filterState.selectedResource);
            }
        })

        return {
                label: simulationObj.simulation_name.toUpperCase(),
                type: 'line',
                borderDash: [5],
                data: data,
                spanGaps: true,
                fill: false
        };
    })
    return simulation_datsets;

}


function getDataPoint(yearEnergyData, energyType) {
    if (energyType && energyType != 'total') {
        return _processBuidingEnergy(yearEnergyData[energyType]);
    } else {
        return Object.keys(yearEnergyData).reduce(function(accum, curr){
            if (curr == 'stm' || curr == 'elec' || curr == 'chw') {
                return accum + _processBuidingEnergy(yearEnergyData[curr]);
            } else {
                return accum;
            }
        }, 0);
    }
}

function _processBuidingEnergy(yearlyEnergyData) {
    return yearlyEnergyData.reduce((accum, curr) => accum + curr);
}

export default {getMeasuredData, getSimulatedData};
