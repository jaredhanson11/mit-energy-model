const HISTORICAL_DATA = ['data_2010'];

export default class dataProcessing {
    generateHistoricalData(filterState, currBuildingData) {
        if (filterState.selectedBuilding) {
            var buildingDataYearByMonth = currBuildingData[filterState.selectedBuilding];
            return 
        }
    }

    _processBuildingYear(buildingDataYearByMonth) {
        buildingDataYearByMonth.reduce((accum, curr) => accum + curr);
    }
}
