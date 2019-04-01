<template>
<div class="map-container">
    <div class="gmaps"></div>
    <DirectionButton></DirectionButton>
    <div class="restaurant-loader">
        <Loader v-show="isFetching"></Loader>
    </div>
    <a @click="setCurrentPosition"
        data-position="top" 
        :data-tooltip="directionMarker ? 'Remove Position':'Set Position'"
        class="btn-floating btn-remove-start-direction btn-large red darken-1 waves-effect waves-light z-depth-2"
        >
        <i class="material-icons white-text darken-4">add_location</i>
    </a>
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
        },
        directionMarker() {
            return this.$store.state.map.directionMarker;
        }

    },
    data() {
        return {
            drawManager: null,
            circle: null,
            isFetching: false,
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
                searchConfig.radius -= 400;

                if(searchConfig.radius < 0) {
                    searchConfig.radius = 0;
                }
            }

            this.isFetching = true;
            PlacesService.getDetails(this.service, searchType, searchConfig, this.$root, false)
                .then(rawRestaurants => {
                    
                    M.toast({
                        html:`<span>Found ${rawRestaurants.length} Restaurant/s</span>`
                    });

                    // rawRestaurants.forEach(resto => {
                    //     let restaurant = new RestaurantModel(resto);
                    //     this.$store.state.map.restaurants.push(restaurant);
                    // });

                })
                .finally(() => {
                    this.isFetching = false;
                });
        },
        setCurrentPosition() {
            if(this.directionMarker) {

                this.directionMarker.setMap(null);
                this.$store.dispatch('map/setDirectionMarker', null);
                this.drawManager.manager.setDrawingMode(null);

            } else {

                this.drawManager.manager.setDrawingMode(google.maps.drawing.OverlayType.MARKER);

            }
        }
    },
    mounted() {
        this.$root.$emit('map:mounted', true);

        this.$root.$on('circle:clear', () => {
            if(this.circle) {
                this.circle.setMap(null);
            }
        });

        M.Tooltip.init(document.querySelectorAll('.btn-remove-start-direction'));

    },
    created() {

        this.$root.$on('places:init', () => {
            this.drawManager = new DrawingManager(this.map);

            google.maps.event.addListener(this.drawManager.manager, 'circlecomplete', (event) => {
                // Get circle center and radius
                var center = event.getCenter();
                var radius = event.getRadius();

                event.setMap(null);
                if(radius) {
                    this.createCircle(center, radius);
                }
            });

            google.maps.event.addListener(this.drawManager.manager, 'markercomplete',  (marker) => {

                if(this.directionMarker) {
                    this.directionMarker.setMap(null);
                }
                this.drawManager.manager.setDrawingMode(null);
                marker.setDraggable(true);

                this.$store.dispatch('map/setDirectionMarker', marker);


            });

            google.maps.event.addListener(this.map,'click',function(event) {   

            });
        });
    }
}
</script>
