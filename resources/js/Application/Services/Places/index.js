import Config from '~/Application/Config';
import RestaurantModel from '~/Application/Models/Restaurant';

export default class PlacesService{
    
    static getPlaceId(service, config) {

        if(!config) {
            config = Config.cityRequest;
        }

        return new Promise((resolve, reject) => {
            
            service.findPlaceFromQuery(
                config,
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
        
        let resultData = [];

        return new Promise((resolve, reject) => {
            service[searchType[fetchType]](config , (data, status, pagination) => {

                resultData = resultData.concat(data);

                if(pagination.hasNextPage) {
                    pagination.nextPage();
                } else {
                    resolve(resultData);
                }

                if(resultData.length === 0) {
                    M.toast({html: "No Restaurants Fetched..", displayLength: 2000});
                    reject(new Error("No Restaurants"));
                } 
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

}