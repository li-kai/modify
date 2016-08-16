import api from '../api';
import * as types from './mutation-types';

export const setSchool = ({ dispatch }, school) => {
  dispatch(types.SET_SCHOOL, school);
};

export const setUserTimetable = ({ dispatch }, school, year, sem) => {
  // first get the list of all modules
  api.getModulesList(school, year, sem).then(response => {
    dispatch(types.RETRIEVE_MODULES_LIST, response);
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

/*
Gets the timetable from local forage, by default meaning if the user
changes the school or semester, this is the last saved timetable.
For a new user, this becomes NUS, 2016, sem 1 timetable.
*/
export const setDefaultTimetable = ({ dispatch }) => {
  const defaults = api.getDefault();
  const modulesList = defaults.then((response) => {
    if (response) {
      return api.getModulesList(...response);
    }
    return api.getModulesList('NUS', 2016, 1);
  });
  const userModules = defaults.then((response) => {
    if (response) {
      return api.getUserModules(...response);
    }
    return api.getUserModules('NUS', 2016, 1);
  });
  Promise.all([defaults, modulesList, userModules]).then(values => {
    if (values[0]) dispatch(types.SET_SCHOOL, values[0][0]);
    dispatch(types.RETRIEVE_MODULES_LIST, values[1]);
    dispatch(types.ATTACH_USER_MODULES, values[2]);
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
