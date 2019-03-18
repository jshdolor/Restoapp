import GoogleMapsApiLoader from 'google-maps-api-loader';

export default class GoogleMaps {
    
    constructor(config = {}) {

        this.config = Object.assign(config, {
            apiKey: 'AIzaSyDkgayWzkMQ8yXOk37W6-ApyzLvh57bf2k' // optional
        });

        this.gapi = GoogleMapsApiLoader(this.config);
    }

    get() {
        return this.gapi
            .then(response => {return response;})
            .catch(error => {throw new Error(response); })
    }

}