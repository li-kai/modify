import localforage from 'localforage';
import {
  SET_SCHOOL,
  ADD_MODULE,
  DELETE_MODULE,
  CHANGE_MODULE_COLOR,
  ON_CLICK_LESSON,
} from './mutation-types';

const USER_MODULES = 'user-modules';
const USER_DEFAULT = 'user-default';

const localForagePlugin = store => {
  store.subscribe((mutation, { timetable }) => {
    if (mutation.type === ADD_MODULE ||
      mutation.type === DELETE_MODULE ||
      mutation.type === CHANGE_MODULE_COLOR ||
      // only save when user has selected
      mutation.type === ON_CLICK_LESSON && timetable.selectable.length === 0) {
      // store user modules with its uid
      localforage.setItem(
        USER_MODULES + timetable.school + timetable.year + timetable.semester,
        timetable.userModules,
      );
    }
    // todo: more 'set' methods for year and sems
    if (mutation.type === SET_SCHOOL || mutation.type === ADD_MODULE) {
      localforage.setItem(
        USER_DEFAULT,
        {
          school: timetable.school,
          year: timetable.year,
          sem: timetable.semester,
        },
      );
    }
  });
};

export default localForagePlugin;
