<template>
    <div id="app" v-if="!isLoading">
        <SideNav></SideNav>
        <Map></Map>
        <div id="direction" class="modal">
            <div class="modal-content">
                <h4>Modal Header</h4>
                <p>A bunch of text</p>
            </div>
            <div class="modal-footer">
                <a href="#!" class="modal-close waves-effect waves-green btn-flat">Okay</a>
            </div>
        </div>
        <div id="directionModal" class="modal modal-close">
            <div class="modal-content">
                <h4>Directions</h4>
                <ul>
                    <li v-for="step in steps" v-html="step.instructions"> </li>
                </ul>
            </div>
            <div class="modal-footer">
                <a href="#!" class="modal-close waves-effect waves-green btn-flat">Ok</a>
            </div>
        </div>
    </div>
</template>

<script>
import SideNav from '~/Framework/Components/Layout/SideNav';
import Map from '~/Framework/Components/Widgets/Map';
import MapService from '~/Application/Services/Map';
import Config from '~/Application/Config';

export default {
    name: 'App',
    data() {
        return {
            isLoading: true,
            steps:[]
        };
    },
    components: {
        SideNav,
        Map,
    },
    methods: {
        initMap() {

            let map = new google.maps.Map(
                    document.querySelector('.gmaps'), 
                    Config.map
                );

            this.$store.dispatch('map/declareMap', map);
            
            this.initPlaces(map);
        },
        initPlaces(map) {

            this.$store.dispatch(
                'map/declarePlacesService',
                new google.maps.places.PlacesService(map)
            );

            this.$root.$emit('places:init', true);
        }
    },
    created() {
        MapService.handle().then(response => {
            this.isLoading = false;
        });

        this.$root.$on('map:mounted', () => {
            this.initMap();
        });

        this.$root.$on('steps:fetched', (steps) => {
            this.steps = steps;
        })
    }
}
</script>