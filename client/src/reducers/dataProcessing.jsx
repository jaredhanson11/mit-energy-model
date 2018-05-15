
export function reformatBackendData(campusData, historicalData) {
    var c02_factors = {'elec' : 0.193411, 'stm' : 0.272202, 'chw' : 0.205706};
    var campus_final = {};
    for (var building in campusData) {
        var building_metadata = {
            'building_type' : campusData[building]['metadata']['building_type'],
            'area_ft2' : campusData[building]['metadata']['area_ft2'],
            'area_m2' : campusData[building]['metadata']['area_m2'],
        }
        campus_final[building] = {};
        campus_final[building]['metadata'] = building_metadata;
        var measured_data = {}
        for (var year in historicalData) {
            if (historicalData[year][building]) {
                measured_data[year.toString()] = historicalData[year][building];
            } else {
            }
        }
        campus_final[building]['measured_data'] = measured_data;

        var this_year = new Date().getFullYear().toString();
        campus_final[building]['measured_data'][this_year] = {};
        for (var energy_type in campusData[building]['measured']) {
            if (!(energy_type == 'total')) {
                var measured_kwh = campusData[building]['measured'][energy_type];
                campus_final[building]['measured_data'][this_year][energy_type] = measured_kwh;
            }
        }

        campus_final[building]['simulation_data'] = campusData[building]['simulations']
    }
    return campus_final;
}

export function summarizeMonthlyEnergyData(building_data) {
    var today = new Date();
    var monthIndex = today.getMonth();
    var building_summary = {};
    //how to handle incomplete data?
    for (var measuredType in building_data) {
        var measured_summary = {};
        for (var energyType in building_data[measuredType]) {
            measured_summary[energyType] = {};
            var tot_ = 0.0;
            var min = 9999999999999999.0;
            var max = 0.0;
            for (var i = 0; i < building_data[measuredType][energyType].length; i++) {
                var value = building_data[measuredType][energyType][i];
                tot_ += value;

                if (value < min) {
                    min = value;
                }
                if (value > max) {
                    max = value;
                }
            }
            measured_summary[energyType].year_total = tot_;
            measured_summary[energyType].monthly_avg = tot_/12.0;
            measured_summary[energyType].min = min;
            measured_summary[energyType].max = max;
            measured_summary[energyType].month_total = building_data[measuredType][energyType][monthIndex];
        }
        building_summary[measuredType] = measured_summary;
    }
    return building_summary;
}

export function getCampusSummary(buildingData) {
    var yearly_figures = {};
    var types = ['academic', 'services', 'residential', 'laboratory'];
    var measured = ['measured_c02_norm', 'measured_kwh_norm'];
    for (var type in types) {
        yearly_figures[types[type]] = {};
        for (var measure in measured) {
            yearly_figures[types[type]][measured[measure]] = {
                'chw' : {
                    'year_min' : 999999999999999.99,
                    'year_max' : 0.0
                },
                'elec' : {
                    'year_min' : 999999999999999.99,
                    'year_max' : 0.0
                },
                'stm' : {
                    'year_min' : 999999999999999.99,
                    'year_max' : 0.0
                },
                'total' : {
                    'year_min' : 999999999999999.99,
                    'year_max' : 0.0
                }
            };
        }
    }

    for (var building in buildingData) {
        for (var measuredType in buildingData[building].building_summary) {
            if (measuredType == 'measured_c02_norm' || measuredType == 'measured_kwh_norm') {
                var buildingType = buildingData[building].building_metadata.building_type;
                for (var resource in buildingData[building].building_summary[measuredType]) {
                    //for buildingTypes
                    if (buildingData[building].building_summary[measuredType][resource].year_total < yearly_figures[buildingType][measuredType][resource].year_min) {
                        //need to address later the problem of zero values
                        if (buildingData[building].building_summary[measuredType][resource].year_total != 0) {
                            yearly_figures[buildingType][measuredType][resource].year_min = buildingData[building].building_summary[measuredType][resource].year_total;
                        }
                    }
                    if (buildingData[building].building_summary[measuredType][resource].year_total > yearly_figures[buildingType][measuredType][resource].year_max) {
                        //need to address later the problem of zero values
                        if (buildingData[building].building_summary[measuredType][resource].year_total != 0) {
                            yearly_figures[buildingType][measuredType][resource].year_max = buildingData[building].building_summary[measuredType][resource].year_total;
                        }
                    }
                }
            }
        }
    }
    return yearly_figures;
}

export default { getCampusSummary, reformatBackendData, summarizeMonthlyEnergyData }
