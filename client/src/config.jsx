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
    resourceType: {
        filterStateKey: 'selectedResource',
        keys: ['total', 'elec', 'stm', 'chw'],
        translations: {
            total: 'Total',
            elec: 'Electricity',
            stm: 'Steam',
            chw: 'Chilled Water'
        },
        icons: {
            total: '/imgs/total-icon.png',
            elec: '/imgs/electricity-icon.png',
            stm: '/imgs/steam-icon.png',
            chw: '/imgs/chilled-water-icon.png'
        }
    },
    unitsType: {
        filterStateKey: 'selectedUnits',
        keys: ['kwh', 'kwh_normalized', 'co2', 'co2_normalized'],
        translations: {
            kwh: 'Kilowatt Hours',
            kwh_normalized: 'Kilowatt Hours / Building Square Footage',
            co2: 'Carbon Dioxide',
            co2_normalized: 'Carbon Dioxide / Building Square Footage'
        },
        icons: {
            kwh: '/imgs/kwh-icon.png',
            kwh_normalized: '/imgs/kwh_normalized-icon.png',
            co2: '/imgs/co2-icon.png',
            co2_normalized: '/imgs/co2_normalized-icon.png'
        }
    },
    buildingType: {
        filterStateKey: 'selectedBuildingType',
        keys: ['all', 'academic', 'laboratory', 'residential', 'services'],
        translations: {
            all: 'All Building Types',
            academic: 'Academic',
            laboratory: 'Laboratory',
            residential: 'Residential',
            services: 'Services'
        },
        icons: {
            all: '/imgs/all-buildings-icon.png',
            academic: '/imgs/academic-icon.png',
            laboratory: '/imgs/laboratory-icon.png',
            residential: '/imgs/residential-icon.png',
            services: '/imgs/services-icon.png'
        }
    }
};

export function getFilterConfig(filterKey) {
    return FILTER_CONFIG[filterKey];
}

var _default = {
    API_CONFIG
};

export default _default;
