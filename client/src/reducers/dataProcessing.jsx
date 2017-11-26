import building_areas from '../building_areas.json';
import building_types from '../building_types.json';

// in C02e kg/kWH
// so kgs of c02 emissions per kWH of resource
var c02_factors = {
    'elec' : 0.193411,
    'stm' : 0.272202,
    'chw' : 0.205706
}

export function reformatBackendData(campusData) {
    var campus_final = {};

    for (var building in campusData) {
        //read coefficients somehow here
        // What if the entry does not exist????? TODO
        var building_metadata = {
            'type' : building_types[building],
            'size' : building_areas[building]
        }

        //initialize new object to return
        campus_final[building] = {};
        campus_final[building]['building_metadata'] = building_metadata;
        campus_final[building]['measured_kwh'] = campusData[building]['measured'];
        campus_final[building]['measured_c02'] = {};
        campus_final[building]['measured_kwh_norm'] = {};
        campus_final[building]['measured_c02_norm'] = {};

        for (var energy_type in campusData[building]['measured']) {
            // operate on lists
            var energy_c02 = campusData[building]['measured'][energy_type].map(function(x) {return x * c02_factors[energy_type]});
            var energy_c02_norm = energy_c02.map(function(x) {return x / building_metadata['size']});
            var unit_norm = campusData[building]['measured'][energy_type].map(function(x) {return x / building_metadata['size']});

            // place in final object
            campus_final[building]['measured_c02'][energy_type] = energy_c02;
            campus_final[building]['measured_kwh_norm'][energy_type] = unit_norm;
            campus_final[building]['measured_c02_norm'][energy_type] = energy_c02_norm;
        }
    }

    return campus_final;
}


export function summarizeMonthlyEnergyData(building_data) {
    var today = new Date();
    var monthIndex = today.getMonth();
    var summary = {};
    for (var energyType in building_data['measured_kwh']) {
        var max = 0;
        var min = 1000000000;
        var tot = 0;
        summary[energyType] = {}
        for (var j = 0; j < building_data['measured_kwh'][energyType].length; j++) {
            var month = parseInt(building_data['measured_kwh'][energyType][j]);
            if (month < min) {
                min = month;
            }
            if (month > max) {
                max = month;
            }
            tot += month;
        }
        summary[energyType].year_total = tot;
        summary[energyType].monthly_avg = tot/12.0;
        summary[energyType].min = min;
        summary[energyType].max = max;
        summary[energyType].month_total = building_data['measured_kwh'][energyType][monthIndex];
    }

    return summary;
}

export function getCampusSummary(buildingData) {
    // here, put in the min and max values for the gradient for each building energyType
    // For now, will just be dummy numbers until Shreshth replies

    return {
        'Academic' : {
            'good' : 0,
            'bad' : 99999999999
        },
        'Lab' : {
            'good' : 0,
            'bad' : 99999999999
        },
        'Residential' : {
            'good' : 0,
            'bad' : 99999999999
        },
        'Services' : {
            'good' : 0,
            'bad' : 99999999999
        },
    }
}

export default { getCampusSummary, reformatBackendData, summarizeMonthlyEnergyData }
