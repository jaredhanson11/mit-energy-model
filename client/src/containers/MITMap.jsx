import React from 'react';

import Building from './Building.jsx';
import {Map, TileLayer, GeoJSON} from 'react-leaflet';
const stamenTonerTiles = 'http://stamen-tiles-{s}.a.ssl.fastly.net/toner-background/{z}/{x}/{y}.png';
const stamenTonerAttr = 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>';
const center = [42.362432, -71.086086];
const zoom = 14
var GJV = require("geojson-validation");

import campus from './project.json';

GJV.isFeature(campus, function(valid, errs){
    //log the errors
    if(!valid){
       console.log(errs);
    }
});
// var states = [{
//     "type": "Feature",
//     "properties": {"party": "Republican"},
//     "geometry": {
//         "type": "Polygon",
//         "coordinates": [[
//             [42.360971, -71.088065],
//             [42.361185, -71.087386],
//             [42.360380, -71.086885],
//             [42.360170, -71.087561]
//         ]]
//     }
// }, {
//     "type": "Feature",
//     "properties": {"party": "Democrat"},
//     "geometry": {
//         "type": "Polygon",
//         "coordinates": [[
//             [-109.05, 41.00],
//             [-102.06, 40.99],
//             [-102.03, 36.99],
//             [-109.04, 36.99],
//             [-109.05, 41.00]
//         ]]
//     }
// }];

class MITMap extends React.Component {
    render() {
        return (
            <div style={{marginTop:'20px'}}>
                <Map
                    center={center}
                    zoom={zoom} >
                    <TileLayer
                        attribution='© OpenStreetMap'
                        url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                    />
                </Map>
            </div>
        )
    }
}

export default MITMap;
