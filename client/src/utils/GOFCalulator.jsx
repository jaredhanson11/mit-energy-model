var WEIGHTING_FACTORS = {'elec': 3, 'stm': 1, 'chw': 1};

var getWeights = function(filterState){
    var weights = Object.assign({}, WEIGHTING_FACTORS);
    for (var res in WEIGHTING_FACTORS) {
        if (!filterState.selectedResource.includes(res)) {
            weights[res] = 0;
        }
    }
    return weights;
}

var getCVandNMBE = function(resourceType, measuredYear, simulatedYear) {
    var measured_avg = measuredYear[resourceType].reduce((a,b)=>a+b)/measuredYear[resourceType].length;
    if (measured_avg == 0) {
        return [-1, -1];
    }
    var CV_numerator = 0;
    var NMBE_numerator = 0;
    for (var i=0; i<12; i++) {
        var sim = simulatedYear[resourceType][i];
        var measured = measuredYear[resourceType][i];
        var diff = parseFloat(measured - sim);
        var diff_sq = Math.pow(diff, 2);
        CV_numerator += diff_sq;
        NMBE_numerator += diff;
    }
    var CV_denominator = 11 * Math.pow(measured_avg, 2);
    var NMBE_denominator = 12 * measured_avg;
    var CV = Math.sqrt(CV_numerator / CV_denominator) * 100;
    var NMBE = (NMBE_numerator / NMBE_denominator) * 100;
    return [CV, NMBE];
}

var getCVandNMBE_GOF = function(CVs, NMBEs, weights) {
    var CV_num = 0;
    var NMBE_num = 0;
    var denom = 0;
    for (var res in weights) {
        if (weights[res] != 0 && CVs[res] && NMBEs[res]) {
            var weight_sq = Math.pow(weights[res], 2);
            var CV_sq = Math.pow(CVs[res], 2);
            var NMBE_sq = Math.pow(NMBEs[res], 2);
            CV_num += weight_sq * CV_sq;
            NMBE_num += weight_sq * NMBE_sq;
            denom += weight_sq;
        }
    }
    if (denom == 0) {
        return [-1, -1];
    }
    var CV = Math.sqrt(CV_num / denom);
    var NMBE = Math.sqrt(NMBE_num / denom);
    return [CV, NMBE];
}

export default {
    calculateGOF: function(filterState, measuredYear, simulatedYear) {
        var weights = getWeights(filterState);
        var weight_cv = 1;
        var weight_nmbe = 3;
        var CVs = {};
        var NMBEs = {};
        for (var i=0; i<filterState.selectedResource.length; i++) {
            var res = filterState.selectedResource[i];
            var cv_nmbe = getCVandNMBE(res, measuredYear, simulatedYear);
            var CV = cv_nmbe[0];
            var NMBE = cv_nmbe[1];
            if (CV == -1 || NMBE == -1) {
                continue;
            }
            CVs[res] = CV;
            NMBEs[res] = NMBE;
        }

        var cv_nmbe_gof = getCVandNMBE_GOF(CVs, NMBEs, weights);
        var CV_gof = cv_nmbe_gof[0];
        var NMBE_gof = cv_nmbe_gof[1];

        var GOF_num = weight_cv * Math.pow(CV_gof, 2) + weight_nmbe * Math.pow(NMBE_gof, 2);
        var GOF_denom = Math.pow(weight_cv, 2) + Math.pow(weight_nmbe, 2);
        var GOF = Math.sqrt(GOF_num / GOF_denom);
        return GOF;
    }
}
