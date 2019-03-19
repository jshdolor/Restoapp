import {propertyValue} from '~/Framework/Helpers';

export default class Restaurant {

    constructor(data) {

        this._lng = propertyValue(data,'geometry.location.lng', 0);
        this._lat = propertyValue(data,'geometry.location.lat', 0);
        this._placeId = propertyValue(data, 'place_id', null);
        this._rating = propertyValue(data, 'rating', 0);
        this._type = propertyValue(data, 'types', []);
        this._name = propertyValue(data, 'name', '');
        this._id = propertyValue(data, 'id', null);

        this._photo = propertyValue(data, 'photos', null);

        this._address = null;
        this._website = null;
        this._phoneNumber = null;

        this._marker = new google.maps.Marker({
            position: this.getCoordinates(),
            title: this.name
        });

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

    get photo() {
        return this._photo[0] ? this._photo[0] : null;
    }

    get address() {
        return this._address;
    }

    set address(value) {
        this._address = value;
    }

    get website() {
        return this._website;
    }

    set website(value) {
        this._website = value;
    }

    get phoneNumber() {
        return this._phoneNumber;
    }

    set phoneNumber(value) {
        this._phoneNumber = value;
    }

    getCoordinates() {
        return {
            lng:this.lng,
            lat:this.lat,
        }
    }
    
}