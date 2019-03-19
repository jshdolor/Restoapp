import Vue from 'vue';
import axios from 'axios';
import Boot from '~/Framework/Bootstrap';


//materialize js components
import '~/Framework/Plugins/Materialize';


/**
 * Make all global objects ready upon bootstrap
 * before toggling the switch.
 */

window.Vue = Vue;
window.axios = axios;
window.App = null;

/**
 * Lets light up our application and show the world
 * how awesome it is.
 */

export default new Boot();