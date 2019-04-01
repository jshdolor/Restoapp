export default {

    declareMap(state, data) {
        state.map = data;
    },

    storeRestaurants(state, data) {
        state.restaurants = data;
    },

    concatRestaurants(state, data) {
        state.restaurants.push(data);
    },

    storePlaceId(state, data) {
        state.placeId = data;
    },

    declarePlacesService(state, data) {
        state.placesService = data;
    },

    storeMarkers(state, data) {
        state.markers = data;
    },

    setSelectedRestaurant(state, data) {
        state.selectedRestaurant = data;
    },

    toggleFilter(state, data) {
        state.filters[data.index].status = data.status;
    },

    setDirectionMarker(state, data) {
        state.directionMarker = data;
    },
}