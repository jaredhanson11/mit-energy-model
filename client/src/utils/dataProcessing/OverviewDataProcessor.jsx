import MITMapDataProcessor from './MITMapDataProcessor.jsx';

export default class OverviewDataProcessor extends MITMapDataProcessor {
    constructor(campusData, filterState) {
        super(campusData, filterState);
    }

    prettyPrint(integer) {
        return integer.toLocaleString({maximumFractionDigits: 0});
    }

    printBuildingArea(buildingNumber) {
        return this.prettyPrint(super.getBuildingArea(buildingNumber));
    }

    printCampusArea() {
        return this.prettyPrint(super.getCampusArea());
    }

    printCampusMin() {
        var ret = super.getCampusMin();
        if (!this.unitsNormalized() && !this.filterState.selectedDataSource == 'warning') {
            ret = parseInt(ret / 1000);
        }
        return this.prettyPrint(ret);
    }

    printCampusMax() {
        var ret = super.getCampusMax();
        if (!this.unitsNormalized() && !this.filterState.selectedDataSource == 'warning') {
            ret = parseInt(ret / 1000);
        }
        return this.prettyPrint(ret);
    }

    printCampusEnergyUsage() {
        var ret = super.getCampusEnergyUsage();
        if (!this.unitsNormalized() && !this.filterState.selectedDataSource == 'warning') {
            ret = parseInt(ret / 1000);
        }
        return this.prettyPrint(ret);
    }

    printBuildingEnergyUsage(buildingNumber) {
        var ret = super.getBuildingEnergyUsage(buildingNumber);
        if (!this.unitsNormalized() && !this.filterState.selectedDataSource == 'warning') {
            ret = parseInt(ret / 1000);
        }
        return this.prettyPrint(ret);
    }

    printEnergyUnitsHTML() {
        var ret = super.getEnergyUnitsHTML();
        if (!this.unitsNormalized() && !this.filterState.selectedDataSource == 'warning') {
            ret = ret.replace('kWh', 'MWh');
            ret = ret.replace('kg', 'MT');
        }
        return ret;
    }
}
