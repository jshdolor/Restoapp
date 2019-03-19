import PlacesService from '~/Application/Services/Places';

export default class DirectionService {

    static getUserCoordinates() {
        // Try HTML5 geolocation.

        //geolocation - only allowed on https protocol
        //had to force this to cebu city for testing
        return new google.maps.LatLng(
            10.315699,
            123.885437,
        );

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {

                    return new google.maps.LatLng(
                        position.coords.latitude, 
                        position.coords.longitude
                    );
                    
                },
                () => {
                    M.toast({
                        html: 'Geolocation:failed',
                        displayLength: 2000
                    });
                }
            );
        } else {
            M.toast({
                html: 'Browser doesn\'t support Geolocation',
                displayLength: 2000
            });
        }
    }

    static getDirections(service, destination, map) {

        let directionsService = new google.maps.DirectionsService();
        let directionsDisplay = new google.maps.DirectionsRenderer();
        directionsDisplay.setMap(null);
        directionsDisplay.setMap(map);

        let request = {
            origin: this.getUserCoordinates(),
            destination: new google.maps.LatLng(destination.lat, destination.lng),
            travelMode: 'DRIVING'
        };

        directionsService.route(request, (dresult, dstatus) => {
            if (dstatus == 'OK') {
                directionsDisplay.setDirections(dresult);
            } else {
                M.toast({
                    html: dstatus,
                    displayLength: 2000
                });
            }
        });

    }

}