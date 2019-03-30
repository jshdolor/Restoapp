<template>
    <div class="chip waves-effect waves-light" 
        :class="{'chip-checked': filter.status}" @click="toggle">
        <small >{{filter.name}}</small>
        
    </div>
</template>
<script>
export default {
    name: 'Chip',
    props: ['filter'],
    methods: {
        toggle() {
            this.checked = !this.checked;
            this.$store.dispatch('map/toggleFilter',{name:this.filter.name, status:this.checked});
        }
    },
    mounted() {
        this.$root.$on('chip:reset', () => {
            this.$store.dispatch('map/toggleFilter',{name:this.filter.name, status:false});
        })
    }
}
</script>