import {
  RETRIEVE_MODULES_LIST,
  RETRIEVE_ALL_ERROR,
  ADD_MODULE,
  ATTACH_USER_MODULES,
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
  [RETRIEVE_MODULES_LIST](state, list) {
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
    for (let i = 0, len = state.listOfModules.length; i < len; i++) {
      const mod = state.listOfModules[i];
      if (module.code === mod.code) {
        state.listOfModules.splice(i, 1);
        state.deletedModuleIndexes[mod.code] = i;
        break;
      }
    }
  },
  /* Remove each module from searchable list
   * Looks similar to ADD_MODULE but this removes all
   * relevant modules in one parse
   */
  [ATTACH_USER_MODULES](state, userModules) {
    if (userModules) {
      let modulesToRemove = userModules.length;
      for (let i = 0, len = state.listOfModules.length - modulesToRemove; i < len; i++) {
        const mod = state.listOfModules[i];
        if (userModules.some(module => module.code === mod.code)) {
          // remove from listOfModules
          state.listOfModules.splice(i, 1);
          state.deletedModuleIndexes[mod.code] = i;
          modulesToRemove--;
          len--;
        }
        // no more modules to remove, early release
        if (modulesToRemove <= 0) {
          break;
        }
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
