export default {

    declareMap({commit}, data) {
        commit('declareMap', data);
    },
    storeRestaurants({commit}, data) {
        commit('storeRestaurants', data);
    },
    concatRestaurants({commit}, data) {
        commit('concatRestaurants', data);
    },
    storePlaceId({commit}, data) {
        commit('storePlaceId', data);
    },
    declarePlacesService({commit}, data) {
        commit('declarePlacesService',data);
    },
    storeMarkers({commit}, data) {
        commit('storeMarkers',data);
    },
    setSelectedRestaurant({commit}, data) {
        commit('setSelectedRestaurant',data);
    },
    toggleFilter({commit}, data) {
        commit('toggleFilter',data);
    },

    setDirectionMarker({commit}, data) {
        commit('setDirectionMarker',data);
    },

};