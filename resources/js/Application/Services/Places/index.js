import Config from '~/Application/Config';

export default class PlacesService{
    
    static getPlaceId(service) {

        return new Promise((resolve, reject) => {
            
            service.findPlaceFromQuery(
                Config.cityRequest, 
                ([results] = [], status)  => {
                    if (status === google.maps.places.PlacesServiceStatus.OK) {
                        resolve(results.place_id);
                    }else 
                    {
                        reject(new Error("No PlaceId"));
                    }
                });

        }); 
    }

    static getDetails(service, fetchType = 0, config) {

        let searchType = [
            'nearbySearch',
            'findPlaceFromQuery',
            'textSearch'
        ];

        return new Promise((resolve, reject) => {

            service[searchType[fetchType]](config , (data) => {
                if(!data) {
                    reject(new Error("No Restaurants"));
                }
                resolve(data);
            });

        })

    }

    static getInfo(service, request) {
        return new Promise((resolve, reject) => {

            service.getDetails(request, (info) => {
                
                if(!info){
                    reject(new Error("No Info"));
                }
                resolve(info);
            });
    
        });
        
    }


    // getPlaceId(map) {
    //     let service = new google.maps.places.PlacesService(map);
        
    //     return service.findPlaceFromQuery(Config.cityRequest, ([results] = [], status)  => {

    //         // let request = {
    //         //     placeId: results.place_id,
    //         //     fields: ['name', 'rating', 'formatted_phone_number', 'geometry'],
    //         //     type: ['restaurant']
    //         //   };
    //         // service.getDetails(request, );

    //     let sydney = new google.maps.LatLng(Config.map.lat, Config.map.lng);
    //         service.nearbySearch({
    //             location: map.getCenter(),
    //             radius: 50000,
    //             query: 'restaurants',
    //         }, (d) => {console.log(d)});

    //         if (status === google.maps.places.PlacesServiceStatus.OK) {
    //             window.Store.dispatch('map/storePlaceId',results.place_id);
    //         }
    //     });
        
    // }
}