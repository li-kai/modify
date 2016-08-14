import {
  SET_SCHOOL,
  ATTACH_USER_MODULES,
  ADD_MODULE,
  ADD_ERROR,
  CHANGE_MODULE_COLOR,
  DELETE_MODULE,
  ON_CLICK_LESSON,
  ON_CLICK_OUTSIDE,
} from '../mutation-types';
/*
Timetable will be in charged of handling lessons from modules.
Specifically, timetable will be doing the following:
  - Allocating lesson types
  - Allocating lessons to a day (mon, tue, etc.)
  - Controlling the visibility status (selected, hidden, fade)
*/
// For visibility of lessons
const SELECTED = 'selected';
const HIDDEN = 'hidden';
const GHOSTED = 'ghosted';
const ONLY = 'only';
const INITIAL = 'initial';

// Hex code for colors
const colorsList = ['#42A5F5', '#4CAF50', '#EBB72C',
                    '#f64747', '#FF8300', '#BA68C8',
                    '#7BC0BF', '#607D8B', '#919191'];

const state = {
  school: 'NUS',
  year: 2016,
  semester: 1,
  week: {
    mon: [], tue: [], wed: [], thu: [], fri: [],
    sat: [], sun: [],
  },
  userModules: [],
  selectable: [],
  selected: {},
  colorCounter: -1,
  retrieveError: false,
};

// mutations
const mutations = {
  [SET_SCHOOL](state, school) {
    if (school === 'NUS' || school === 'NTU') {
      state.school = school;
    }
  },
  [ATTACH_USER_MODULES](state, userModules) {
    // clear out remnants
    state.userModules = [];
    state.selectable = [];
    Object.keys(state.week).forEach(day => {
      state.week[day] = [];
    });
    if (userModules) {
      state.userModules = userModules;
      for (let i = userModules.length - 1; i >= 0; i--) {
        allocateLessons(state, userModules[i]);
        sortByLengthDescending(state.week);
      }
    }
  },
  [ADD_MODULE](state, module) {
    state.retrieveError = false;

    // change all snake_case keys to camelCase ones
    const camelCaseModule = {};
    Object.keys(module).forEach((key) => {
      camelCaseModule[snakeCaseToCamelCase(key)] = module[key];
    });

    state.userModules.push(camelCaseModule);
    if (camelCaseModule.timetable) {
      allocateLessons(state, camelCaseModule);
      sortByLengthDescending(state.week);
    }

    // wrap color if more than 9 modules
    state.colorCounter = (state.colorCounter + 1) % colorsList.length;
    camelCaseModule.color = colorsList[state.colorCounter];
  },
  [ADD_ERROR](state) {
    state.retrieveError = true;
  },
  [CHANGE_MODULE_COLOR](state, module, colorInHex) {
    module.color = colorInHex;
  },
  [DELETE_MODULE](state, module) {
    const week = state.week;
    const code = module.code;
    const arrayOfKeys = Object.keys(week);
    for (let i = arrayOfKeys.length - 1; i >= 0; i--) {
      const day = arrayOfKeys[i];
      week[day] = week[day].filter(lesson => lesson.code !== code);
    }
    state.userModules.$remove(module);
  },
  // user starts to pick lesson type
  [ON_CLICK_LESSON](state, selectedLesson) {
    // user wants to select another lesson
    if (state.selectable.length === 0) {
      let module;
      // get the reference to modules (Array.prototype.find not in IE)
      for (let i = 0, len = state.userModules.length; i < len; i++) {
        module = state.userModules[i];
        if (module.code === selectedLesson.code) {
          break;
        }
      }

      // make selectable the list of lessons, make them ghosted
      state.selectable = module.timetable[selectedLesson.lessonType];
      for (let i = state.selectable.length - 1; i >= 0; i--) {
        const lesson = state.selectable[i];
        // make initial selected lesson look different from others
        if (lesson.classNo === selectedLesson.classNo) {
          lesson.displayStatus = INITIAL;
        } else {
          lesson.displayStatus = GHOSTED;
        }
      }
      state.selected = selectedLesson;

    // user has picked a lesson
    } else {
      // user clicked on same lesson type
      if (state.selected.code === selectedLesson.code &&
        state.selected.lessonType === selectedLesson.lessonType) {
        state.selected = selectedLesson;
      }
      setSelected(state);
    }
  },
  // user clicked outside, put previously selected back
  [ON_CLICK_OUTSIDE](state) {
    if (state.selectable.length > 0) {
      setSelected(state);
    }
  },
};

export default {
  state,
  mutations,
};

function snakeCaseToCamelCase(text) {
  return text.replace(/_\w/g, m => m[1].toUpperCase());
}

function setSelected(state) {
  const classNo = state.selected.classNo;
  state.selectable.forEach(lesson => {
    if (lesson.classNo !== classNo) {
      lesson.displayStatus = HIDDEN;
    } else {
      lesson.displayStatus = SELECTED;
    }
  });
  // reset state
  state.selectable = [];
}

function sortByLengthDescending(week) {
  for (let i = week.length - 1; i >= 0; i--) {
    week[i].sort((a, b) => b.hours - a.hours);
  }
}

function allocateLessons(state, module) {
  if (Array.isArray(module.timetable)) {
    const lessons = {};
    // came from api, no processing done yet, so let's get to work
    for (let i = module.timetable.length - 1; i >= 0; i--) {
      const lesson = createLesson(module.timetable[i], module.code);
      insertLessonByType(lessons, lesson);

      // add to the timetable
      state.week[lesson.dayText].push(lesson);
    }
    // set those with only one choice as displayStatus 'ONLY'
    Object.values(lessons).forEach((listOfLessons) => {
      const classNo = listOfLessons[0].classNo;
      if (listOfLessons.every(lesson => lesson.classNo === classNo)) {
        listOfLessons.forEach(lesson => {
          lesson.displayStatus = ONLY;
        });
      }
    });
    // replace with the sorted version
    module.timetable = lessons;
  } else {
    // came from forage, just restore back data
    Object.values(module.timetable).forEach((listOfLessons) => {
      for (let i = listOfLessons.length - 1; i >= 0; i--) {
        const lesson = listOfLessons[i];
        state.week[lesson.dayText].push(lesson);
      }
    });
  }
  // Object.freeze(module.Timetable)
  // Object.freeze(module)
}

function insertLessonByType(categorizedLessons, lesson) {
  const lessonType = lesson.lessonType;
  // if lessonType is already in the categorizedLessons object
  if (categorizedLessons.hasOwnProperty(lessonType)) {
    // check if this lesson also belongs to the one selected previously
    const selectedClassNo = categorizedLessons[lessonType][0].classNo;
    if (lesson.classNo === selectedClassNo) {
      lesson.displayStatus = SELECTED;
    } else {
      lesson.displayStatus = HIDDEN;
    }
    categorizedLessons[lessonType].push(lesson);
  // add lessonType to categorizedLessons, and add lesson to it
  } else {
    // first lesson to be added will be selected
    lesson.displayStatus = SELECTED;
    categorizedLessons[lessonType] = [lesson];
  }
}

function createLesson(data, code) {
  const lesson = {};
  Object.keys(data).forEach((key) => {
    lesson[snakeCaseToCamelCase(key)] = data[key];
  });

  // if weekText is too long, and contains commas
  if (lesson.weekText === 'Every week') {
    lesson.weekText = '';
  }

  // convert 18:00:00 to 1800 format
  lesson.startTime = lesson.startTime.slice(0, 5).replace(':', '');
  lesson.endTime = lesson.endTime.slice(0, 5).replace(':', '');
  // set num of hours for lesson
  lesson.hours = calculateHours(lesson.startTime, lesson.endTime);

  lesson.code = code;
  lesson.lessonType = lesson.lessonType.toLowerCase();
  lesson.dayText = lesson.dayText.toLowerCase();

  // set uid for tracking
  lesson.uid = code + lesson.lessonType + lesson.classNo + lesson.venue;
  // these properties no longer change, so Vue will optimize
  /*
  for (let property in lesson) {
    Object.freeze(lesson[property]);
  }
  */
  return lesson;
}

function calculateHours(startTime, endTime) {
  const startMinutes = startTime.slice(2);
  const hour = parseInt(endTime.slice(0, 2), 10) - parseInt(startTime.slice(0, 2), 10);
  const minutes = parseInt(endTime.slice(2), 10) - parseInt(startMinutes, 10);
  return hour + (minutes / 60);
}
