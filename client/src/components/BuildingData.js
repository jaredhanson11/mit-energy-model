import React from 'react';


/**
 * BuildingData - class for building data, with functions to update and change the data
 *
 */
var BuildingData = function (geojsonData) {

    var that = Object.create(BuildingData.prototype);

    var buildingsDictionary = generateDictionary(geojsonData);

    /**
     * Populates pi-data into the BuildingData class dictionary
     * @param  {Object}     pi-data
     */
    that.populateData = function (apiData) {

    };

    /**
     * Fills in the correct color for each building within the class dictionary
     * TODO what is "normal" and what is "too different" in terms of what we should make very red
     */
    that.generateGradient = function () {

    };

    /**
     * Returns the color of the specified building TODO check if the type is int or string
     */
    that.getBuildingColor = function (buildingNumber) {
        return buildingsDictionary.buildingNumber.color;
    }


    /**
     * Returns data for a specific building, type of data(model vs. measured), and utility
     */
    that.getDataByUtility = function (buildingNumber, modelOrMeasured, utility) {
        return buildingsDictionary.buildingNumber.modelOrMeasured.utility;
    }

    function generateDictionary (BuildingData) {
        dict = {};
        for (var building in BuildingData.features) {
            dict[building.properties.building_number] = {
                color: NULL,
                model: {
                    steam: NULL,
                    electricity: NULL,
                    chilledWater: NULL
                },
                measured: {
                    steam: NULL,
                    electricity: NULL,
                    chilledWater: NULL
                }
            };
        };
        return dict;
    };

    Object.freeze(that);
    return that;
};
