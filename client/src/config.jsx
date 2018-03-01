const BASE_URL = 'https://jared-hanson.com/urop/api';
const BUILDING_DATA_RESOURCE = '/campus_meu/';
export var API_CONFIG = {
    base_url: BASE_URL,
    building_data_endpoint: BASE_URL + BUILDING_DATA_RESOURCE,
    default_headers: {
        'content-type': 'application/json'
    }
}

var FILTER_CONFIG = {
    dataSource: {
        filterStateKey: 'selectedDataSource',
        title: 'Data Source',
        keys: ['metered', 'modeled', 'warning'],
        translation: {
            metered: 'Metered',
            modeled: 'Modeled',
            warning: 'Warning Mode'
        },
        icons: {
            metered: './imgs/metered-data-icon.png',
            modeled: './imgs/modeled-data-icon.png',
            warning: './imgs/warning-mode-icon.png'
        }
    },
    resourceType: {
        filterStateKey: 'selectedResource',
        title: 'Energy Type',
        keys: ['total', 'elec', 'stm', 'chw'],
        translations: {
            total: 'Total',
            elec: 'Electricity',
            stm: 'Steam',
            chw: 'Chilled Water'
        },
        icons: {
            total: './imgs/total-icon.png',
            elec: './imgs/electricity-icon.png',
            stm: './imgs/steam-icon.png',
            chw: './imgs/chilled-water-icon.png'
        }
    },
    unitsType: {
        filterStateKey: 'selectedUnits',
        keys: ['kwh', 'co2'],
        translations: {
            kwh: 'Kilowatt Hours',
            co2: 'Carbon Dioxide',
            //co2_normalized: 'Carbon Dioxide / Building Square Footage'
        },
        names: {
            kwh: 'kWh',
            co2: 'CO&#8322;',
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
        keys: ['all', 'academic', 'laboratory', 'residential', 'services'],
        translations: {
            all: 'All Building Types',
            academic: 'Academic',
            laboratory: 'Laboratory',
            residential: 'Residential',
            services: 'Services'
        },
        icons: {
            all: './imgs/all-buildings-icon.png',
            academic: './imgs/academic-icon.png',
            laboratory: './imgs/laboratory-icon.png',
            residential: './imgs/residential-icon.png',
            services: './imgs/services-icon.png'
        }
    }
};

const SELECT_FILTERS = ['buildingType', 'resourceType', 'dataSource'];
export function getSelectFilterConfig(filterKey) {
    if (SELECT_FILTERS.includes(filterKey)) {
        return FILTER_CONFIG[filterKey];
    }
}

const TOGGLE_FILTERS = ['unitsType', 'unitsNormalized'];
export function getToggleFilterConfig(filterKey) {
    if (TOGGLE_FILTERS.includes(filterKey)) {
        return FILTER_CONFIG[filterKey];
    }
}



var _default = {
    API_CONFIG
};

export default _default;
