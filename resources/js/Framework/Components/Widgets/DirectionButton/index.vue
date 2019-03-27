<template>
    <a @click="click"
        class="btn-floating btn-direction btn-large yellow darken-1 waves-effect waves-light z-depth-2 pulse"
        >
        <i class="material-icons red-text darken-4" v-if="!isLoading">directions</i>
        <Preloader v-if="isLoading" size="small"></Preloader>
    </a>
</template>

<script>
import DirectionService from '~/Application/Services/Direction';
import Preloader from '~/Framework/Components/Widgets/Preloader';

export default {
    name: 'DirectionButton',
    components: {
        Preloader
    },
    data() {
        return {
            isLoading: false,
            directionModal: null,
        }
    },
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
            if (Object.keys(this.selectedRestaurant).length === 0) {
                M.toast({
                    html: 'Please Select a restaurant',
                    displayLength: 2000
                });
                return;
            }

            this.isLoading = true;

            DirectionService.getDirections(
                this.placesService,
                this.selectedRestaurant.getCoordinates(),
                this.map).then(
                    ({routes}) => {
                    
                    let [route] = routes;
                    this.$root.$emit('steps:fetched', route.legs[0].steps);

                }).finally(() => {
                    this.directionModal.open();
                    this.isLoading = false;
                })
        },
    },
    mounted(){ 
        this.directionModal = M.Modal.init(document.querySelectorAll('#directionModal'))[0];
    }
}
</script>
