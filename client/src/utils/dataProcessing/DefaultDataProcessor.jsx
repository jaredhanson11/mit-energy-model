import { getToggleFilterConfig } from '../../config.jsx';

export default class DefaultDataProcessor {
    constructor(campusData, filterState) {
        this.filterState = filterState;
    }

    getEnergyUnitsHTML() {
        var that = this;
        var unit_keys = ['unitsType', 'unitsNormalized'];
        return unit_keys.reduce(function(accum, key) {
            var config = getToggleFilterConfig(key);
            var selected = that.filterState[config.filterStateKey];
            var HTML = config.names[selected]
            return accum + HTML + ' ';
        }, '')

    }

    unitsNormalized() {
        // returns true or false if the units are normalized by area or not
        if (this.filterState.selectedUnitsNormalized == 'per_m2_per_year') {
            return true;
        }
        return false;
    }

    convertToCO2(energy_by_type) {
        var c02_factors = {'elec' : 0.193411, 'stm' : 0.272202, 'chw' : 0.205706};
        var converted = {};
        for (var type in energy_by_type) {
            if (c02_factors[type]) {
                converted[type] = energy_by_type[type].map(function(kwh_val) {
                    return parseInt(c02_factors[type] * kwh_val);
                })
            }
        }
        return converted;
    }

    condense(energy_by_type) {
        var sums = [];
        for (var type in energy_by_type) {
            var tot = energy_by_type[type].reduce(function(accum, curr) { return accum + curr});
            sums.push(tot);
        }
        if (sums.length > 0) {
            return sums.reduce(function(accum, curr){return accum+curr});
        }
        return 0;
    }

}
