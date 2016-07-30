import Vue from 'vue';
import VueResource from 'vue-resource';
import localforage from 'localforage';

Vue.use(VueResource);
// Vue.http.options.crossOrigin = true
// Vue.http.options.xhr = {withCredentials: true}
const API_ROOT = '//api.nusmods.com/2016-2017/1/';
const AllModulesResource = Vue.resource(`${API_ROOT}moduleList.json?callback=?`);
const ModuleResource = Vue.resource(`${API_ROOT}modules/{/moduleCode}.json`);

const MODULE_KEY = 'modify-modules';

function getFromForage(key, apiCall) {
  return localforage.getItem(key).then((value) => {
    if (value) {
      const differenceInSeconds = (new Date() - value.date) / 1000;
      // one day
      if (Math.abs(differenceInSeconds) < 86400) {
        return Promise.resolve(value.data);
      }
    }
    return apiCall.then((value) => {
      const object = {
        data: value.data,
        date: new Date(),
      };
      localforage.setItem(key, object);
      return value.data;
    });
  });
}

export default {
  getAllModules() {
    return getFromForage(MODULE_KEY, AllModulesResource.get());
  },
  getModule(moduleCode) {
    return getFromForage(moduleCode, ModuleResource.get({ moduleCode }));
  },
};
