import api from '../api';
import * as types from './mutation-types';

export const retrieveAllModules = ({ dispatch }) => {
  api.getAllModules().then(response => {
    dispatch(types.RETRIEVE_ALL_MODULES, response);
  }).catch(err => {
    console.error(err);
    dispatch(types.RETRIEVE_ALL_ERROR);
  });
};

export const attachUserModules = ({ dispatch }) => {
  api.getUserModules().then(response => {
    dispatch(types.ATTACH_USER_MODULES, response);
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

export const onChoosingLesson = makeAction(types.ON_CHOOSING_LESSON);
export const onChosenLesson = makeAction(types.ON_CHOSEN_LESSON);
export const onClickOutside = ({ dispatch }) => {
  dispatch(types.ON_CLICK_OUTSIDE);
};
