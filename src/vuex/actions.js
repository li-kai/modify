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
For a new user, this becomes NTU, 2016, sem 1 timetable.
*/
export const setDefaultTimetable = ({ dispatch }) => {
  const previous = api.getDefault();
  const modulesList = previous.then((response) => {
    if (response) {
      return api.getModulesList(response.school, response.year, response.sem);
    }
    return api.getModulesList('NTU', 2016, 1);
  });
  const userModules = previous.then((response) => {
    if (response) {
      return api.getUserModules(response.school, response.year, response.sem);
    }
    return api.getUserModules('NTU', 2016, 1);
  });
  Promise.all([previous, modulesList, userModules]).then(values => {
    const previousSettings = values[0];
    // by default its 'NTU', for now
    const school = previousSettings ? previousSettings.school : 'NTU';
    // set the school as before
    dispatch(types.SET_SCHOOL, school);
    // set the modules list as before
    dispatch(types.RETRIEVE_MODULES_LIST, values[1]);
    // set the modules
    const modules = values[2];
    dispatch(types.ATTACH_USER_MODULES, modules);
    /* TODO: decide if modules should auto update and how to handle auto update
    if (modules) {
      modules.forEach((module) => {
        api.getModule(school, values[0].year, values[0].sem, module.code).then(response => {
          dispatch(types.ADD_MODULE, response);
        })
      })
    }
    */
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
