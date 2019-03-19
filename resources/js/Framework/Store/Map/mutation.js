export default {

    declareMap(state, data) {
        state.map = data;
    },

    storeRestaurants(state, data) {
        state.restaurants = data;
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
}