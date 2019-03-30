<template>
<div class="map-container">
    <div class="gmaps"></div>
    <DirectionButton></DirectionButton>
    <div class="restaurant-loader">
        <Loader v-show="isFetching"></Loader>
    </div>
</div>
</template>

<script>
import Config from '~/Application/Config';
import MapService from '~/Application/Services/Map';
import PlacesService from '~/Application/Services/Places';
import DrawingManager from '~/Application/Managers/GoogleDraw';
import RestaurantModel from '~/Application/Models/Restaurant';

import DirectionButton from '~/Framework/Components/Widgets/DirectionButton';

import Loader from '~/Framework/Components/Widgets/Preloader';

import {
    propertyValue,
    pluck
} from '~/Framework/Helpers';


export default {
    name: 'Map',
    components: {
        DirectionButton,
        Loader,
    },
    computed: {
        map() {
            return this.$store.state.map.map;
        },
        service() {
            return this.$store.state.map.placesService;
        },
        restaurants() {
            return this.$store.state.map.restaurants;
        },
        markers() {
            return pluck(this.restaurants, 'marker');
        },
        filters() {
            return this.$store.state.map.filters;
        },
        queryText() {
            return pluck(this.filters.filter(p => p.status), 'name').join(',');
        }
    },
    data() {
        return {
            manager: null,
            circle: null,
            isFetching: false
        }
    },
    watch: {
        markers: {
            handler(newMarkers, oldValue) {
                
                //remove old markers
                oldValue.forEach(marker => marker.setMap(null));

                newMarkers.forEach(marker => {
                    if(!newMarkers)
                    {
                        return;
                    }
                    marker.setMap(this.map);
                });
            },
        }
    },
    methods: {
        createCircle(center, radius) {
            if (this.circle) {
                this.circle.setMap(null);
            }

            this.circle = new google.maps.Circle({
                fillColor: '#ffffff',
                fillOpacity: .6,
                strokeWeight: 1,
                strokeColor: '#ff0000',
                draggable: false,
                editable: false,
                map: this.map,
                center: center,
                radius: radius
            });

            this.getRestaurantsInRadius(center, radius);

        },
        getRestaurantsInRadius(center, radius) {

            let searchConfig = {
                location: center,
                radius: radius,
                type: ['restaurant'],
            };

            let searchType = 0;

            if(this.queryText !== '') {
                searchConfig.name = this.queryText;
                //the search is acting weird: getting places outside the radius
                searchConfig.radius -= 200;
            }

            this.isFetching = true;
            PlacesService.getDetails(this.service, searchType, searchConfig)
                .then(rawRestaurants => {
                    
                    M.toast({
                        html:`<span>Found ${rawRestaurants.length} Restaurant/s</span>`
                    });

                    rawRestaurants.forEach(resto => {
                        let restaurant = new RestaurantModel(resto);
                        this.$store.state.map.restaurants.push(restaurant);
                    });

                })
                .finally(() => {
                    this.isFetching = false;
                });
        }
    },
    mounted() {
        this.$root.$emit('map:mounted', true);
    },
    created() {

        this.$root.$on('places:init', () => {
            let dm = new DrawingManager(this.map);

            google.maps.event.addListener(dm.manager, 'circlecomplete', (event) => {
                // Get circle center and radius
                var center = event.getCenter();
                var radius = event.getRadius();

                event.setMap(null);
                if(radius) {
                    this.createCircle(center, radius);
                }
            });
        });
    }
}
</script>
