<template>
    <div class='info-window'>
        <h6 v-text="details.name"></h6>
        <ul>
            <li>Visitors: <b>{{details.visitors}} </b></li>
            <li v-if="details.phoneNumber">Phone Number: {{details.phoneNumber}}</li>
            <li v-if="details.address">Address: {{details.address}}</li>
            <li v-if="details.website">Website: {{details.website}}</li>
            <li>Rating: {{details.rating}}</li>
        </ul>
    </div>
</template>
<script>
export default {
    name : 'InfoWindow',
    props: ['details'],
    methods: {

    }
}
</script>