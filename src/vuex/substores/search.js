import {
  RETRIEVE_ALL_MODULES,
  RETRIEVE_ALL_ERROR,
  ADD_MODULE,
  DELETE_MODULE,
  TOGGLE_SEARCH_STATUS,
} from '../mutation-types';

const state = {
  listOfModules: [],
  retrieveAllError: false,
  isSearching: false,
  deletedModuleIndexes: {},
};

const mutations = {
  // Retrieve all modules to be searched
  [RETRIEVE_ALL_MODULES](state, list) {
    state.retrieveAllError = false;

    // sort by alphabetical
    list = list.sort((a, b) => a.code.localeCompare(b.code));
    // freeze the objects
    list.forEach(x => Object.freeze(x));
    state.listOfModules = list;
  },
  [RETRIEVE_ALL_ERROR](state) {
    state.retrieveAllError = true;
  },
  // Remove from searchable list
  [ADD_MODULE](state, module) {
    // get the reference to modules (Array.prototype.find not in IE)
    for (let i = 0, len = state.listOfModules.length; i < len; i++) {
      const mod = state.listOfModules[i];
      if (module.code === mod.code) {
        state.listOfModules.splice(i, 1);
        state.deletedModuleIndexes[mod.code] = i;
        break;
      }
    }
  },
  // Add it back to searchable list
  [DELETE_MODULE](state, module) {
    const deletedModule = Object.freeze({
      code: module.code,
      title: module.title,
    });
    const index = state.deletedModuleIndexes[module.code];
    // insert back at the position
    state.listOfModules.splice(index, 0, deletedModule);
  },
  [TOGGLE_SEARCH_STATUS](state) {
    state.isSearching = !state.isSearching;
  },
};

export default {
  state,
  mutations,
};
