import api from '../api';
import * as types from './mutation-types';

export const setSchool = ({ dispatch }, school) => {
  dispatch(types.SET_SCHOOL, school);
};

export const retrieveAllModules = ({ dispatch }, school, year, sem) => {
  // first get the list of all modules
  api.getAllModules(school, year, sem).then(response => {
    dispatch(types.RETRIEVE_ALL_MODULES, response);
    return api.getUserModules(school, year, sem);
  })
  // then get the previously saved modules, if any
  .then(response => {
    dispatch(types.ATTACH_USER_MODULES, response);
  })
  .catch(() => {
    dispatch(types.RETRIEVE_ALL_ERROR);
  });
};

export const addModule = ({ dispatch }, school, year, sem, moduleCode) => {
  api.getModule(school, year, sem, moduleCode).then(response => {
    dispatch(types.ADD_MODULE, response);
  }).catch(() => {
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
