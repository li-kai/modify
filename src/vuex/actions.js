import api from '../api';
import * as types from './mutation-types';

export const setSchool = ({ dispatch }, school) => {
  dispatch(types.SET_SCHOOL, school);
};

export const setUserTimetable = ({ dispatch }, school, year, sem) => {
  // first get the list of all modules
  api.getModulesList(school, year, sem).then((response) => {
    dispatch(types.RETRIEVE_MODULES_LIST, response);
  })
  .catch(() => {
    dispatch(types.RETRIEVE_ALL_ERROR);
  });
  // then get the previously saved modules, if any
  api.getUserModules(school, year, sem).then((response) => {
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
  api.getDefault().then((settings) => {
    // by default its 'NTU', for now
    if (!settings) {
      settings = {
        school: 'NTU',
        year: 2016,
        sem: 1,
      };
    }
    dispatch(types.SET_SCHOOL, settings.school);

    api.getModulesList(settings.school, settings.year, settings.sem).then((modulesList) => {
      dispatch(types.RETRIEVE_MODULES_LIST, modulesList);
    });
    api.getUserModules(settings.school, settings.year, settings.sem).then((userModules) => {
      dispatch(types.ATTACH_USER_MODULES, userModules);
    });
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
