const BASE_URL = 'http://52.11.126.32:8000';
const BUILDING_DATA_RESOURCE = '/campus_meu/';
export var API_CONFIG = {
    base_url: BASE_URL,
    building_data_endpoint: BASE_URL + BUILDING_DATA_RESOURCE,
    default_headers: {
        'content-type': 'application/json'
    }
}

var FILTER_CONFIG = {
    graphToggle: {
        filterStateKey: 'selectedGraphToggle',
        keys: ['overview', 'building'],
        translations: {
            overview: 'Overview',
            building: 'Building'
        },
        names: {
            overview: 'Overview',
            building: 'Building'
        }
    },
    dataSource: {
        filterStateKey: 'selectedDataSource',
        title: 'Data Source',
        keys: ['metered', 'modeled', 'warning'],
        translations: {
            metered: 'Metered',
            modeled: 'Modeled',
            warning: 'Warning'
        },
        icons: {
            metered: './imgs/metered-data-icon.png',
            modeled: './imgs/modeled-data-icon.png',
            warning: './imgs/warning-mode-icon.png'
        }
    },
    upgradesCompleted: {
        filterStateKey: 'selectedUpgradesCompleted',
        title: 'Upgrades',
        keys: ['water', 'windows', 'cooling'],
        translations: {
            water: 'Water',
            windows: 'Windows',
            cooling: 'Cooling'
        },
        icons: {
            all: './imgs/total-icon.png',
            water: './imgs/academic-icon.png',
            windows: './imgs/laboratory-icon.png',
            cooling: './imgs/residential-icon.png'
        },
        selectAll: true
    },
    resourceType: {
        filterStateKey: 'selectedResource',
        title: 'Energy Type',
        keys: ['elec', 'stm', 'chw'],
        translations: {
            elec: 'Electricity',
            stm: 'Steam',
            chw: 'Chilled Water'
        },
        icons: {
            all: './imgs/total-icon.png',
            elec: './imgs/electricity-icon.png',
            stm: './imgs/steam-icon.png',
            chw: './imgs/chilled-water-icon.png'
        },
        selectAll: true
    },
    unitsType: {
        filterStateKey: 'selectedUnits',
        keys: ['kwh', 'co2'],
        translations: {
            kwh: 'Kilowatt Hours',
            co2: 'Carbon Dioxide',
        },
        names: {
            kwh: 'kWh',
            co2: 'kg CO&#8322;e',
        }
    },
    unitsNormalized: {
        filterStateKey: 'selectedUnitsNormalized',
        keys: ['per_year', 'per_m2_per_year'],
        translations : {
            per_year: 'year',
            per_m2_per_year: 'year_m2'
        },
        names: {
            per_year: '/yr',
            per_m2_per_year: '/m&#178; /yr'
        }
    },
    buildingType: {
        filterStateKey: 'selectedBuildingType',
        title: 'Building Type',
        keys: ['academic', 'laboratory', 'residential', 'services'],
        translations: {
            academic: 'Academic',
            laboratory: 'Lab',
            residential: 'Residential',
            services: 'Ancillary'
        },
        icons: {
            academic: './imgs/academic-icon.png',
            laboratory: './imgs/laboratory-icon.png',
            residential: './imgs/residential-icon.png',
            services: './imgs/services-icon.png'
        }
    }
};

const SELECT_FILTERS = ['buildingType', 'resourceType', 'dataSource', 'upgradesCompleted'];
export function getSelectFilterConfig(filterKey) {
    if (SELECT_FILTERS.includes(filterKey)) {
        return FILTER_CONFIG[filterKey];
    }
}

const TOGGLE_FILTERS = ['unitsType', 'unitsNormalized', 'graphToggle'];
export function getToggleFilterConfig(filterKey) {
    if (TOGGLE_FILTERS.includes(filterKey)) {
        return FILTER_CONFIG[filterKey];
    }
}



var _default = {
    API_CONFIG
};

export default _default;
