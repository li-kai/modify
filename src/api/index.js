import Vue from 'vue';
import VueResource from 'vue-resource';
import localforage from 'localforage';

Vue.use(VueResource);
// Vue.http.options.crossOrigin = true;
// Vue.http.options.xhr = { withCredentials: true };
const API_ROOT = 'https://api.modify.sg/';
const ModulesListResource = Vue.resource(`${API_ROOT}modulesList/{/school}/{/year}/{/sem}`);
const ModuleResource = Vue.resource(`${API_ROOT}modules/{/school}/{/year}/{/sem}/{/moduleCode}`);

const USER_MODULES_KEY = 'user-modules';
const MODULES_LIST_KEY = 'modify-modules';
const USER_DEFAULT = 'user-default';

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
  getDefault() {
    return localforage.getItem(USER_DEFAULT);
  },
  getModulesList(school, year, sem) {
    return getFromForage(
      MODULES_LIST_KEY + school + year + sem,
      ModulesListResource.get({ school, year, sem }),
    );
  },
  getUserModules(school, year, sem) {
    return localforage.getItem(USER_MODULES_KEY + school + year + sem);
  },
  getModule(school, year, sem, moduleCode) {
    return getFromForage(
      moduleCode,
      ModuleResource.get({ school, year, sem, moduleCode })
    );
  },
};
