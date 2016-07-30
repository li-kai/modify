import api from '../api';
import * as types from './mutation-types';

/*
function saveInForage (key, stuff) {
  const object = {data: stuff, date: new Date()};
  localforage.setItem(key, object);
};

function get (key, apiCall) {
  localforage.getItem(key).then(function (value) {
    if (value) {
      const differenceInSeconds = (new Date() - value.date) / 1000;
      // one day
      if (Math.abs(differenceInSeconds) < 86400) {
        return value.data;
      }
    }
    return apiCall();
  }).catch(function (err) {
    return apiCall();
  });
}
*/

export const retrieveAllModules = ({ dispatch }) => {
  api.getAllModules().then(response => {
    dispatch(types.RETRIEVE_ALL_MODULES, response);
  }).catch(err => {
    console.error(err);
    dispatch(types.RETRIEVE_ALL_ERROR);
  });
};

export const addModule = ({ dispatch }, moduleCode) => {
  api.getModule(moduleCode).then(response => {
    dispatch(types.ADD_MODULE, response);
  }).catch(err => {
    console.error(err);
    dispatch(types.ADD_ERROR);
  });
};

function makeAction(type) {
  return ({ dispatch }, arg) => dispatch(type, arg);
}

export const deleteModule = makeAction(types.DELETE_MODULE);
export const toggleSearchStatus = makeAction(types.TOGGLE_SEARCH_STATUS);

export const changeModuleColor = ({ dispatch }, module, colorHex) => {
  dispatch(types.CHANGE_MODULE_COLOR, module, colorHex);
};

export const onClickLesson = makeAction(types.ON_CLICK_LESSON);
export const onClickOutside = ({ dispatch }) => {
  dispatch(types.ON_CLICK_OUTSIDE);
};
