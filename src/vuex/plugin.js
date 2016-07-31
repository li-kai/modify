import localforage from 'localforage';
import {
  ADD_MODULE,
  DELETE_MODULE,
  CHANGE_MODULE_COLOR,
  ON_CLICK_LESSON,
} from './mutation-types';

const STORAGE_KEY = 'user-modules';

const localForagePlugin = store => {
  store.subscribe((mutation, { timetable }) => {
    if (mutation.type === ADD_MODULE ||
      mutation.type === DELETE_MODULE ||
      mutation.type === CHANGE_MODULE_COLOR ||
      // only save when user has selected
      mutation.type === ON_CLICK_LESSON && timetable.selectable.length === 0) {
      localforage.setItem(STORAGE_KEY, timetable.userModules);
    }
  });
};

export default localForagePlugin;
