import {propertyValue} from '~/Framework/Helpers';

export default class Restaurant {

    constructor(data) {

        this._lng = propertyValue(data,'geometry.location.lng', 0);
        this._lat = propertyValue(data,'geometry.location.lat', 0);
        this._placeId = propertyValue(data, 'place_id', null);
        this._rating = propertyValue(data, 'rating', 0);
        this._type = propertyValue(data, 'types', []);
        this._name = propertyValue(data, 'name', '');
        this._marker = null;

        this._id = propertyValue(data, 'id', null);
    }

    get id() {
        return this._id();
    }

    get lng() {
        return this._lng();
    }

    get lat() {
        return this._lat();
    }

    get placeId() {
        return this._placeId;
    }

    get rating() {
        return this._rating;
    }

    get type() {
        return this._type;
    }

    get name() {
        return this._name;
    }

    set marker(value) {
        this._marker = value;
    }

    get marker() {
        return this._marker;
    }

    get infowindow() {
        return this._infowindow;
    }

    set infowindow(value) {
        this._infowindow = value;
    }

    getCoordinates() {
        return {
            lng:this.lng,
            lat:this.lat,
        }
    }
}