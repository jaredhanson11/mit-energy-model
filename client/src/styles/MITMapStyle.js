var style = {
    //Map Data and Constraints
    zoomSettings: {
        minZoom: 15,
        zoom: 15.5,
        center: [42.358888, -71.093624],
        maxBounds: L.latLngBounds(L.latLng(42.368482 + .005, -71.117361 - .005), L.latLng(42.352833 - .005, -71.068609 + .005))
    },

    map: {
        height: '100%',
        width: '70%',
        display: 'absolute'
    }
};

export default style;
