<template>
    <a @click="click" class="btn-floating btn-direction btn-large yellow darken-1 waves-effect waves-light z-depth-2 pulse">
        <i class="material-icons red-text darken-4">directions</i>
    </a>
</template>
<script>

import DirectionService from '~/Application/Services/Direction';

export default {
    name: 'DirectionButton',
    computed: {
        selectedRestaurant() {
            return this.$store.state.map.selectedRestaurant;
        },
        placesService() {
            return this.$store.state.map.placesService;
        },
        map() {
            return this.$store.state.map.map;
        }
    },
    methods: {
        click() {
            if(Object.keys(this.selectedRestaurant).length === 0) {
                M.toast({html:'Please Select a restaurant', displayLength: 2000});
                return;
            }

            DirectionService.getDirections(
                this.placesService, 
                this.selectedRestaurant.getCoordinates(),
                this.map
            );
        },
    }
}
</script>