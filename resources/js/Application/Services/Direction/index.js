import PlacesService from '~/Application/Services/Places';
import HttpClient from '~/Infrastructure/Http';

export default class DirectionService {

   
    static getUserCoordinates() {

        return new Promise((resolve, reject) => {
            // resolve(new google.maps.LatLng(10.315699, 123.885437));
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
    
                        resolve(new google.maps.LatLng(
                            position.coords.latitude, 
                            position.coords.longitude
                        ));
                        
                    },
                    () => {
                        M.toast({
                            html: `Position Not Found!`,
                        });
                    },
                    {
                        enableHighAccuracy: true, 
                        maximumAge        : 30000, 
                        timeout           : 27000
                    }
                );
            } else {
                M.toast({
                    html: `Position Not Found!`,
                });
            }
        });
    }

    static ds() {
        return this.directionsService || null;
    }

    static dd() {
        return this.directionsDisplay || null;
    }

    static getDirections(service, destination, map) {

        return new Promise((resolve, reject) => {

            if(!this.ds()) {
                this.directionsService = new google.maps.DirectionsService();
            }
            if(!this.dd()) {
                this.directionsDisplay = new google.maps.DirectionsRenderer();
            }
    
            this.dd().set('directions', null);
            this.dd().setMap(map);
    
            this.getUserCoordinates().then(origin => {
    
                let request = {
                    origin: origin,
                    destination: new google.maps.LatLng(destination.lat, destination.lng),
                    travelMode: 'DRIVING'
                };
    
                M.toast({
                    html: `Current Position: (${origin.lat()},${origin.lng()})`,
                });
    
                this.ds().route(request, (dresult, dstatus) => {
                    if (dstatus == 'OK') {
                        
                        this.dd().setDirections(dresult);
                        resolve(dresult);
                    } else {
                        M.toast({
                            html: dstatus,
                            displayLength: 2000
                        });
                    }
                    
                });
            })

        }) ;

        

    }

}