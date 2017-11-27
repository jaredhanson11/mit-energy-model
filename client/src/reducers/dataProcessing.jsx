
export function reformatBackendData(campusData) {
    var c02_factors = {'elec' : 0.193411, 'stm' : 0.272202, 'chw' : 0.205706};
    var campus_final = {};
    for (var building in campusData) {
        var building_metadata = {
            'building_type' : campusData[building]['metadata']['building_type'],
            'area_ft2' : campusData[building]['metadata']['area_ft2'],
            'area_m2' : campusData[building]['metadata']['area_m2'],
            'building_eui' : campusData[building]['metadata']['building_eui'],
        }
        campus_final[building] = {};
        campus_final[building]['building_metadata'] = building_metadata;
        campus_final[building]['building_data'] = {}
        campus_final[building]['building_data']['measured_kwh'] = {};
        campus_final[building]['building_data']['measured_c02'] = {};
        campus_final[building]['building_data']['measured_kwh_norm'] = {};
        campus_final[building]['building_data']['measured_c02_norm'] = {};

        for (var energy_type in campusData[building]['measured']) {
            if (!(energy_type == 'total')) {
                var energy_c02 = campusData[building]['measured'][energy_type].map(function(x) {return x * c02_factors[energy_type]});
                var energy_c02_norm = energy_c02.map(function(x) {return x / building_metadata['area_m2']});
                var unit_norm = campusData[building]['measured'][energy_type].map(function(x) {return x / building_metadata['area_m2']});
                var unit = campusData[building]['measured'][energy_type];

                campus_final[building]['building_data']['measured_kwh'][energy_type] = unit;
                campus_final[building]['building_data']['measured_c02'][energy_type] = energy_c02;
                campus_final[building]['building_data']['measured_kwh_norm'][energy_type] = unit_norm;
                campus_final[building]['building_data']['measured_c02_norm'][energy_type] = energy_c02_norm;
            }
        }
    }
    for (var building in campus_final) {
        for (var measured_type in campus_final[building]['building_data']) {
            for (var energy_type in campus_final[building]['building_data'][measured_type]) {
                var tot = [];
                for (var i = 0; i < campus_final[building]['building_data'][measured_type]['elec'].length; i++) {
                    var individual_total = campus_final[building]['building_data'][measured_type]['elec'][i] + campus_final[building]['building_data'][measured_type]['chw'][i] + campus_final[building]['building_data'][measured_type]['stm'][i];
                    tot.push(individual_total);
                }
                campus_final[building]['building_data'][measured_type]['total'] = tot;
            }
        }
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
