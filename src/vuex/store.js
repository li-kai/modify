import Vue from 'vue';
import Vuex from 'vuex';
import createLogger from 'vuex/logger';

import timetable from './substores/timetable';
import search from './substores/search';
import plugin from './plugin';

// Make vue aware of Vuex
Vue.use(Vuex);
Vue.config.debug = process.env.NODE_ENV !== 'production';

// Combine the initial state and the mutations to create a Vuex store.
// This store can be linked to our app.
export default new Vuex.Store({
  modules: {
    timetable,
    search,
  },
  plugins: [plugin, createLogger()],
  strict: process.env.NODE_ENV !== 'production',
});
