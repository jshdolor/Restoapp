<template src="./views/sidenav.html"></template>
<script>
import Config from '~/Application/Config';
import SearchBar from '~/Framework/Components/Widgets/SearchBar';
import Chip from '~/Framework/Components/Widgets/Chip';
import PlacesService from '~/Application/Services/Places';

import RestaurantModel from '~/Application/Models/Restaurant';

export default {
    name: 'SideNav',
    components: {
        SearchBar,
        Chip
    },
    data() {
        return {
            logo: 'https://freeiconshop.com/wp-content/uploads/edd/location-map-flat.png',
            service: null,
            filterTypes: {}
        }
    },
    computed: {
        restaurants() {
            return this.$store.state.map.restaurants;
        },
        map() {
            return this.$store.state.map.map;
        },
    },
    methods: {
        toggleFilter(value) {
            Object.assign(this.filterTypes, value);
            this.toggleMarkers();
        },
        toggleMarkers() {
            let show=false;
            this.restaurants.forEach(resto => {

                resto.type.forEach(type => {
                    show = show || this.filterTypes[type];
                });

                resto.marker.setVisible(show);

            });
            

        },
        plotToMap(resto) {

            resto.marker = new google.maps.Marker({
                position: resto.getCoordinates(),
                map: this.map,
                title: resto.name
            });

            resto.marker.addListener('click', () => {
                resto.infowindow.open(this.map, resto.marker);
            });

        },

        initFilters() {
            let types = this.restaurants
                .map(o => o['type']).join(',').split(',')
                //unique values
                .filter( (value, index, self) => { 
                    return self.indexOf(value) === index;
                });

            let temp = {}
            types.forEach(type => {
                temp[type] = true;
            });

            this.filterTypes = temp;

        },

        initInfoWindow(resto) {
            resto.infowindow = new google.maps.InfoWindow({
                content: `<h6> ${resto.name} </h6><p></p>`
            });
        },

        showRestaurantInfo(restaurant) {

            let request = {
                placeId: restaurant.placeId
            }

            PlacesService.getInfo(this.service, request).then(r => {
                console.log(r);
            });

            this.map.setCenter(restaurant.marker.getPosition());
            restaurant.infowindow.open(this.map, restaurant.marker);

        }
    },
    mounted() {

        this.$root.$on('places:init', () => {
            
            this.service = this.$store.state.map.placesService;

            PlacesService.getPlaceId(this.service).then(placeId => {
                this.$store.dispatch('map/storePlaceId', placeId);
            });

            let restaurantSearchConfig = {
                location: this.map.getCenter(),
                radius: 50000,
                type: ['restaurant'],
            };

            PlacesService.getDetails(this.service, 0, restaurantSearchConfig)
                .then(rawRestaurants => {
                    
                    let restaurants = [];

                    rawRestaurants.forEach(resto => {
                        let restaurant = new RestaurantModel(resto);
                        this.plotToMap(restaurant);
                        this.initInfoWindow(restaurant);
                        restaurants.push(restaurant);
                    });

                    this.$store.dispatch('map/storeRestaurants', restaurants);

                }).finally(() => this.initFilters());

            

        });
            
        
    }
}
</script>   