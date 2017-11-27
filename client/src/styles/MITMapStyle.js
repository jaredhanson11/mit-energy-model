var style = {
    //Map Data and Constraints
    zoomSettings: {
        minZoom: 15,
        zoom: 15.5,
        center: [42.358888, -71.093624],
        maxBounds: L.latLngBounds(L.latLng(42.368482 + .005, -71.117361 - .005), L.latLng(42.352833 - .005, -71.068609 + .005))
    },

    zoomControl: {
        position: 'topleft'
    },

    map: {
        height: '100%',
        display: 'absolute'
    }
};

export default style;
