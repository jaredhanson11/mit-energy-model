const BASE_URL = 'http://127.0.0.1:5000';
const BUILDING_DATA_RESOURCE = '/campus_meu/';
export var API_CONFIG = {
    base_url: BASE_URL,
    building_data_endpoint: BASE_URL + BUILDING_DATA_RESOURCE,
    default_headers: {
        'content-type': 'application/json'
    }
}
