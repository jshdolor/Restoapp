<template>
    <div class="chip waves-effect waves-light" :class="{'chip-checked': checked}" @click="toggle">
        <small >{{formattedType}}</small>
        <i  v-show="checked" 
            class="close material-icons">
            close
        </i>
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
    }
}
</script>