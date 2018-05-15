const MAIN_GRAPH_X_AXIS_LABELS  = ['2014', '2015', '2016', '2017', '2018', '' , '2020', '', '2050', '','2080'];

var labelYAxis = function(dataProcessor) {
    var prettyPrint = function(integer) {
        return integer.toLocaleString({maximumFractionDigits: 0});
    };
    var kWhToMWhAndkgToMT = function(val) {return parseInt(val / 1000);}
    var _labelAxis = function(value, index, values) {
        if (dataProcessor.unitsNormalized()) {
            return prettyPrint(value);
        } else {
            return prettyPrint(parseInt(kWhToMWhAndkgToMT(value)));
        }
    }

    return _labelAxis;
}

var getYAxisTitle = function(dataProcessor) {
    if (dataProcessor.unitsNormalized()) {
        var units = dataProcessor.getEnergyUnitsHTML();
        units = units.replace('&#178;', '\u00B2');
        units = units.replace('&#8322;', '\u2082');
        console.log(units);
        console.log(units.indexOf('&#178;'));
        return units;
    } else {
        var units = dataProcessor.getEnergyUnitsHTML().replace('kWh', 'MWh');
        units = units.replace('kg', 'MT');
        units = units.replace('&#178;', '\u00B2');
        units = units.replace('&#8322;', '\u2082');
        return units;
    }

}

export var mainGraphOptions  = function(dataProcessor) {
    return {
        title: 'TRENDS',
        labels: MAIN_GRAPH_X_AXIS_LABELS.map((x)=>{if (x == '') {return null;} else {return x}}),
        options: {
            maintainAspectRatio: false,
            elements: {point: {radius: 0}},
            legend: {display: false},
            tooltips: {enabled: false},
            scales: {
                yAxes: [{
                    type: 'linear',
                    display: true,
                    gridLines: {display: false},
                    ticks: {
                        beginAtZero: true,
                        callback: labelYAxis(dataProcessor)
                    },
                    scaleLabel: {
                        display: true,
                        labelString: getYAxisTitle(dataProcessor),
                        fontColor: 'black'
                    }
                }],
                xAxes: [{
                    type: 'category',
                    display: true,
                    gridLines: {display: false},
                    labels: MAIN_GRAPH_X_AXIS_LABELS
                }]
            }
        },
        createBarDataset(name, data) {
            return {
                label: name,
                type: 'bar',
                data: data,
                backgroundColor: 'rgb(191, 191, 191)'
            };
        },
        createLineDataset(name, data) {
            return {
                label: name,
                type: 'line',
                borderDash: [5],
                data: data,
                spanGaps: true,
                fill: false,
                borderColor: 'rgb(0, 0, 0)'
            }
        }
    };
}
