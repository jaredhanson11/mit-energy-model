
const LABELS = ['2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017',
      '2018', '' , '2030', '', '2050', '','2080'];


function _dataPointTemplate(labelName) {
    return {
        label: labelName,
        measured: undefined,
        modeled: {}
    }
}

function getLabels() {
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


function getDataPoint(yearEnergyData, energyType) {
    if (energyType && energyType != 'total') {
        return _processBuidingEnergy(yearEnergyData[energyType]);
    } else {
        return Object.keys(yearEnergyData).reduce(function(accum, curr){
            return accum + _processBuidingEnergy(yearEnergyData[curr]);
        }, 0);
    }
}

function _processBuidingEnergy(yearlyEnergyData) {
    return yearlyEnergyData.reduce((accum, curr) => accum + curr);
}

export default {getMeasuredData};
