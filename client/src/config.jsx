const BASE_URL = 'http://jared-hanson.com/urop/api';
const BUILDING_DATA_RESOURCE = '/campus_meu/';
export var API_CONFIG = {
    base_url: BASE_URL,
    building_data_endpoint: BASE_URL + BUILDING_DATA_RESOURCE,
    default_headers: {
        'content-type': 'application/json'
    }
}

var IMG_URL_MAPPING = {
    filterIcons: {
        total: '/imgs/total-icon.png',
        elec: '/imgs/electricity-icon.png',
        stm: '/imgs/steam-icon.png',
        chw: '/imgs/chilled-water-icon.png'
    }
};

export function getImgUrl(imgGroup, imgKey) {
    return IMG_URL_MAPPING[imgGroup][imgKey];
}

var _default = {
    getImgUrl,
    API_CONFIG
};

export default _default;
