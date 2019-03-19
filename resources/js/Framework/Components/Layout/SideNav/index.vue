<template src="./views/sidenav.html"></template>

<script>
import Config from '~/Application/Config';
import SearchBar from '~/Framework/Components/Widgets/SearchBar';
import Chip from '~/Framework/Components/Widgets/Chip';
import PlacesService from '~/Application/Services/Places';
import Preloader from '~/Framework/Components/Widgets/Preloader';
import RestaurantModel from '~/Application/Models/Restaurant';

import InfoWindowComponent from '~/Framework/Components/Widgets/InfoWindow';

export default {
    name: 'SideNav',
    components: {
        SearchBar,
        Chip,
        Preloader
    },
    data() {
        return {
            logo: 'https://freeiconshop.com/wp-content/uploads/edd/location-map-flat.png',
            service: null,
            filterTypes: {},
            isLoading: true,
            markersShown: 0
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
    watch: {
        restaurants: {
            handler(newVal, oldVal) {
                this.isLoading = true;
                newVal.forEach((newResto) => {
                    // this.plotToMap(newResto);
                    this.initInfoWindow(newResto);
                });

                this.updateFilters();
                this.isLoading = false;

            },
            deep: false
        }
    },
    methods: {
        toggleFilter(value) {
            Object.assign(this.filterTypes, value);
            this.toggleMarkers();
        },
        toggleMarkers() {
            let show = false;
            this.markersShown = 0;
            this.restaurants.forEach(resto => {

                resto.type.forEach(type => {
                    show = show || this.filterTypes[type];
                });

                resto.marker.setVisible(show);
                this.markersShown += +show;
            });

        },
        initMarker(resto) {

            resto.marker = new google.maps.Marker({
                position: resto.getCoordinates(),
                map: this.map,
                title: resto.name
            });

            // this.markersShown++;

            // resto.marker.addListener('click', () => {
            //     resto.infowindow.open(this.map, resto.marker);
            // });

        },

        updateFilters() {
            let types = this.restaurants
                .map(o => o['type']).join(',').split(',')
                //unique values
                .filter((value, index, self) => {
                    return self.indexOf(value) === index;
                });

            let temp = {}
            types.forEach(type => {
                if(type) {
                    temp[type] = true;

                }
            });

            this.filterTypes = temp;

        },

        initInfoWindow(resto) {

            let InfoWindow = Vue.extend(InfoWindowComponent);

            let instance = new InfoWindow({
                propsData: {
                    details: resto
                }
            });

            instance.$mount();

            resto.infowindow = new google.maps.InfoWindow({
                content: instance.$el,
            });

            google.maps.event.addListener(resto.infowindow , 'closeclick',function(){
                this.$store.dispatch('map/setSelectedRestaurant', {});
            });
            
        },

        showRestaurantInfo(restaurant) {

            let request = {
                placeId: restaurant.placeId
            }

            PlacesService.getInfo(this.service, request).then(info => {
                console.log('specialty food :(', info);

                restaurant.address = info.formatted_address;
                restaurant.phoneNumber = info.international_phone_number;
                restaurant.website = info.website;
                
            });

            if(restaurant.marker.visible) {

                //close all infowindow
                this.restaurants.forEach(r => r.infowindow.close());

                this.map.setCenter(restaurant.marker.getPosition());
                restaurant.infowindow.open(this.map, restaurant.marker);

                this.$store.dispatch('map/setSelectedRestaurant', restaurant);

                return;
            }

            M.toast({html: "FILTER: Restaurant is not shown", displayLength: 2000});

        },
        getRestaurants() {
            
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
                        restaurants.push(restaurant);
                    });

                    this.$store.dispatch('map/storeRestaurants', restaurants);

                });

        }
    },
    mounted() {

        this.$root.$on('places:init', () => {

            this.service = this.$store.state.map.placesService;

            PlacesService.getPlaceId(this.service).then(placeId => {
                this.$store.dispatch('map/storePlaceId', placeId);
            });

            this.getRestaurants();

        });

    }
}
</script>
