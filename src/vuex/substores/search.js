import {
  RETRIEVE_ALL_MODULES,
  RETRIEVE_ALL_ERROR,
  ADD_MODULE,
  DELETE_MODULE,
  TOGGLE_SEARCH_STATUS,
} from '../mutation-types';

const state = {
  listOfModules: {},
  retrieveAllError: false,
  isSearching: false,
};

// Create an object storing various mutations. We will write the mutation
const mutations = {
  // Retrieve all modules to be searched
  [RETRIEVE_ALL_MODULES](state, list) {
    state.retrieveAllError = false;
    state.listOfModules = list;
  },
  [RETRIEVE_ALL_ERROR](state) {
    state.retrieveAllError = true;
  },
  // Remove from searchable list
  [ADD_MODULE](state, module) {
    delete state.listOfModules[module.code];
  },
  // Add it back to searchable list
  [DELETE_MODULE](state, module) {
    state.listOfModules[module.code] = module.title;
  },
  [TOGGLE_SEARCH_STATUS](state) {
    state.isSearching = !state.isSearching;
  },
};

export default {
  state,
  mutations,
};
