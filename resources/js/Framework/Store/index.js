import Vuex from 'vuex';
import Vue from 'vue';
Vue.use(Vuex);

import map from './Map';

export default new Vuex.Store({
    modules : {
        map
    }
});