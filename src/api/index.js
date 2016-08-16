import Vue from 'vue';
import VueResource from 'vue-resource';
import localforage from 'localforage';
import {
  USER_MODULES_KEY,
  MODULES_LIST_KEY,
  USER_SETTINGS_KEY,
  userOnboardModule,
} from '../constants';

Vue.use(VueResource);
// Vue.http.options.crossOrigin = true;
// Vue.http.options.xhr = { withCredentials: true };
const API_ROOT = 'https://api.modify.sg/';
const ModulesListResource = Vue.resource(`${API_ROOT}modulesList/{/school}/{/year}/{/sem}`);
const ModuleResource = Vue.resource(`${API_ROOT}modules/{/school}/{/year}/{/sem}/{/moduleCode}`);

function getFromForage(key, apiCall) {
  return localforage.getItem(key).then((value) => {
    if (value) {
      const differenceInSeconds = (new Date() - value.date) / 1000;
      // cache for one day
      if (Math.abs(differenceInSeconds) < 86400) {
        return Promise.resolve(value.data);
      }
    }
    return apiCall.then((response) => {
      const data = response.json();
      const object = {
        data,
        date: new Date(),
      };
      // save to local forage with date
      localforage.setItem(key, object);
      return data;
    });
  });
}

/**
  * Returns either user modules if they are present, or retrieve onboard module
  */
function getUserModulesOrOnboardModules(combinedKey) {
  return localforage.getItem(combinedKey).then((value) => {
    if (value) {
      return Promise.resolve(value);
    }
    // check all keys, and check if user has ANY previous usage
    return localforage.keys().then((keys) => {
      // do some clean up on this step
      if (keys.length > 50) {
        keys.forEach((key) => {
          if (key.indexOf('-') === -1 && key.indexOf('user') === -1) {
            localforage.removeItem(key);
          }
        });
      }
      // user has used modify before
      if (keys.some(key => key.indexOf(USER_MODULES_KEY) !== -1)) {
        return Promise.resolve(null); // but not this particular set
      }
      return Promise.resolve(userOnboardModule);
    });
  });
}

export default {
  getDefault() {
    return localforage.getItem(USER_SETTINGS_KEY);
  },
  getModulesList(school, year, sem) {
    return getFromForage(
      MODULES_LIST_KEY + school + year + sem,
      ModulesListResource.get({ school, year, sem }),
    );
  },
  getUserModules(school, year, sem) {
    return getUserModulesOrOnboardModules(USER_MODULES_KEY + school + year + sem);
  },
  getModule(school, year, sem, moduleCode) {
    return getFromForage(
      moduleCode,
      ModuleResource.get({ school, year, sem, moduleCode })
    );
  },
};
