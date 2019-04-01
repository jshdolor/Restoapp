<template src="./views/sidenav.html"></template>

<script>
import Config from '~/Application/Config';
import SearchBar from '~/Framework/Components/Widgets/SearchBar';
import Chip from '~/Framework/Components/Widgets/Chip';
import PlacesService from '~/Application/Services/Places';
import Preloader from '~/Framework/Components/Widgets/Preloader';
import RestaurantModel from '~/Application/Models/Restaurant';

import InfoWindowComponent from '~/Framework/Components/Widgets/InfoWindow';

import {pluck} from '~/Framework/Helpers';

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
            isLoading: true,
            markersShown: 0,
            getNextPage:null,
            debounceTimer:null
        }
    },
    computed: {
        restaurants() {
            return this.$store.state.map.restaurants;
        },
        map() {
            return this.$store.state.map.map;
        },
        filters() {
            return this.$store.state.map.filters;
        },
        queryText() {
            return pluck(this.filters.filter(p => p.status), 'name').join(',');
        }
    },
    watch: {
        restaurants: {
            handler(newVal, oldVal) {
                newVal.forEach((newResto) => {
                    this.initInfoWindow(newResto);
                });

                this.updateFilters();
            },
            deep: false
        },
        queryText(newVal) {
            if(newVal !== '') {
                if(this.debounceTimer) {
                    clearTimeout(this.debounceTimer);
                }

                this.debounceTimer  = setTimeout(() =>{
                    this.getRestaurantsWithFilters();
                },800);

            } else {
                this.getRestaurants();
            }
        }
    },
    methods: {
        toggleFilters(index, status) {
            this.$store.dispatch('map/toggleFilter',
                {
                    index:index, 
                    status:!status
                }
            );
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
        resetFilters() {
            this.$store.state.map.filters.map(f => {f.status = false});
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

            google.maps.event.addListener(resto.infowindow , 'closeclick',() => {
                this.$store.dispatch('map/setSelectedRestaurant', {});
            });
            
        },

        showRestaurantInfo(restaurant) {

            let request = {
                placeId: restaurant.placeId
            }

            PlacesService.getInfo(this.service, request).then(info => {
                restaurant.address = info.formatted_address;
                restaurant.phoneNumber = info.international_phone_number;
                restaurant.website = info.website;
                
            });

            if(restaurant.marker.visible) {

                restaurant.addVisitor();
                //close all infowindow
                this.restaurants.forEach(r => r.infowindow.close());

                this.map.setCenter(restaurant.marker.getPosition());
                restaurant.infowindow.open(this.map, restaurant.marker);

                this.$store.dispatch('map/setSelectedRestaurant', restaurant);

                return;
            }

            M.toast({html: "FILTER: Restaurant is not shown", displayLength: 2000});

        },
        getRestaurantsWithFilters() {

            this.$root.$emit('circle:clear', true);

            let textSearchConfig = {
                query: 'Restaurants that sell '+this.queryText+ ' in Cebu City, Philippines',
                location: this.map.getCenter(),
                radius: 50000,
                type: ['restaurant'],
            }

            this.fetchRestaurants(textSearchConfig, 2);
        },
        getRestaurants() {
            
            let restaurantSearchConfig = {
                location: this.map.getCenter(),
                radius: 5000,
                type: ['restaurant'],
            };

            this.fetchRestaurants(restaurantSearchConfig)
            
        },

        fetchRestaurants(restaurantSearchConfig, searchType) {

            this.isLoading = true;
            PlacesService.getDetails(this.service, searchType, restaurantSearchConfig, this.$root, true)
                .then(data => {

                    // let restaurants = [];
                    // data.forEach(resto => {
                    //     let restaurant = new RestaurantModel(resto);
                    //     restaurant.marker.addListener('click', () =>{
                    //         this.$root.$emit('marker:click', restaurant);
                    //     });
                    //     restaurants.push(restaurant);
                    // });

                    // this.$store.dispatch('map/storeRestaurants', restaurants);

                }).finally(() =>{

                    this.isLoading = false;

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

        this.$root.$on('resto:fetched', (data) => {

            data.forEach(resto => {

                let restaurant = new RestaurantModel(resto);

                restaurant.marker.addListener('click', () =>{
                    this.$root.$emit('marker:click', restaurant);
                });

                this.$store.dispatch('map/concatRestaurants', restaurant);

            });

        });

        this.$root.$on('marker:click', (resto) => {
            this.showRestaurantInfo(resto);
        });

    }
}
</script>
