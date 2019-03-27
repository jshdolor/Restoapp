<template>
    <div class="chip waves-effect waves-light" :class="{'chip-checked': checked}" @click="toggle">
        <small >{{formattedType}}</small>
        
    </div>
</template>
<script>
export default {
    name: 'Chip',
    props: ['type'],
    computed: {
        formattedType() {
            return this.type.replace(/_/g,' ');
        }
    },
    methods: {
        toggle() {
            this.checked = !this.checked;
            this.$emit('chip:toggled', {[this.type]: this.checked});
        }
    },
    data() {
        return {
            checked: true
        }
    },
    mounted() {
        this.$root.$on('chip:reset', () => {
            this.checked = true;
        })
    }
}
</script>