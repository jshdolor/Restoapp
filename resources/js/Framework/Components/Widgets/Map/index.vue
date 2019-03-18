<template>
    <div class="map-container">
        <div class="gmaps"></div>
    </div>
</template>

<script>
import Config from '~/Application/Config';
import MapService from '~/Application/Services/Map';

export default {
    name: 'Map',
    computed: {
        map() {
            return this.$store.state.map.map;
        }
    },
    mounted() {
        this.$root.$emit('map:mounted', true);
    }
}

</script>


