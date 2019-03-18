<template>
    <div id="App" v-if="!isLoading">
        <SideNav></SideNav>
        <Map></Map>
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
            isLoading: true
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
    }
}
</script>