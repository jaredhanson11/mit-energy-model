export function summarizeMonthlyEnergyData(building_data) {
    var today = new Date();
    var monthIndex = today.getMonth();
    var summary = {};
    for (var energyType in building_data['measured']) {
        var max = 0;
        var min = 1000000000;
        var tot = 0;
        summary[energyType] = {}
        for (var j = 0; j < building_data['measured'][energyType].length; j++) {
            var month = parseInt(building_data['measured'][energyType][j]);
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
        summary[energyType].month_total = building_data['measured'][energyType][monthIndex];
    }

    return summary;
}
