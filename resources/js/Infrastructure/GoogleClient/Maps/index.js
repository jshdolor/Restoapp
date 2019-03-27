import GoogleMapsApiLoader from 'google-maps-api-loader';

export default class GoogleMaps {
    
    constructor(config = {}) {

        this.config = Object.assign(config, {
            apiKey: __APIKEY__,
            fields: ['pagetoken']
        });

        this.gapi = GoogleMapsApiLoader(this.config);
    }

    get() {
        return this.gapi
            .then(response => {return response;})
            .catch(error => {throw new Error(response); })
    }

}