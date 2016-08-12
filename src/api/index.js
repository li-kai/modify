import Vue from 'vue';
import VueResource from 'vue-resource';
import localforage from 'localforage';

Vue.use(VueResource);
// Vue.http.options.crossOrigin = true;
// Vue.http.options.xhr = { withCredentials: true };
const API_ROOT = 'https://api.modify.sg/';
const AllModulesResource = Vue.resource(`${API_ROOT}modulesList/nus/2016/1`);
const ModuleResource = Vue.resource(`${API_ROOT}modules/nus/2016/1/{/moduleCode}`);

const USER_MODULES_KEY = 'user-modules';
const ALL_MODULES_KEY = 'modify-modules';

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

export default {
  getAllModules() {
    return getFromForage(ALL_MODULES_KEY, AllModulesResource.get());
  },
  getUserModules() {
    return localforage.getItem(USER_MODULES_KEY);
  },
  getModule(moduleCode) {
    return getFromForage(moduleCode, ModuleResource.get({ moduleCode }));
  },
};
