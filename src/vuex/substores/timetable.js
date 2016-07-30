import {
  ATTACH_USER_MODULES,
  ADD_MODULE,
  ADD_ERROR,
  CHANGE_MODULE_COLOR,
  DELETE_MODULE,
  ON_CHOOSING_LESSON,
  ON_CHOSEN_LESSON,
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
const colorsList = ['#42A5F5', '#4CAF50', '#FBC02D',
                    '#f64747', '#FB8C00', '#BA68C8',
                    '#80CBC4', '#BDBDBD', '#90A4AE'];

const state = {
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
  [ATTACH_USER_MODULES](state, userModules) {
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
    state.userModules.push(module);
    if (Object.prototype.hasOwnProperty.call(module, 'Timetable')) {
      allocateLessons(state, module);
      sortByLengthDescending(state.week);
    }

    // wrap color if more than 9 modules
    state.colorCounter = (state.colorCounter + 1) % colorsList.length;
    module.Color = colorsList[state.colorCounter];
  },
  [ADD_ERROR](state) {
    state.retrieveError = true;
  },
  [CHANGE_MODULE_COLOR](state, module, colorInHex) {
    module.Color = colorInHex;
  },
  [DELETE_MODULE](state, module) {
    const week = state.week;
    const moduleCode = module.ModuleCode;
    const arrayOfKeys = Object.keys(week);
    for (let i = arrayOfKeys.length - 1; i >= 0; i--) {
      const day = arrayOfKeys[i];
      week[day] = week[day].filter(lesson => lesson.moduleCode !== moduleCode);
    }
    state.userModules.$remove(module);
  },
  [ON_CHOOSING_LESSON](state, lesson) {
    // user starts to pick lesson type
    // make all lesson types ghosted to be selectable

    // get the reference to modules
    const module = state.userModules.find(module => module.ModuleCode === lesson.moduleCode);

    // make selectable the list of lessons
    state.selectable = module.Timetable[lesson.lessonType];
    state.selectable.forEach(lesson => {
      lesson.displayStatus = GHOSTED;
    });
    // make initial selected lesson look different from others
    lesson.displayStatus = INITIAL;
    state.selected = lesson;
  },
  [ON_CHOSEN_LESSON](state, lesson) {
    // user clicked on same lesson type
    if (state.selected.moduleCode === lesson.moduleCode &&
      state.selected.lessonType === lesson.lessonType) {
      state.selected = lesson;
    }
    setSelected(state);
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
  if (Array.isArray(module.Timetable)) {
    const lessons = {};
    // came from api, no processing done yet, so let's get to work
    for (let i = module.Timetable.length - 1; i >= 0; i--) {
      const lesson = createLesson(module.Timetable[i], module.ModuleCode);
      insertLessonByType(lessons, lesson);

      // add to the timetable
      state.week[lesson.dayText].push(lesson);
    }
    Object.values(lessons).forEach((listOfLessons) => {
      const classNo = listOfLessons[0].classNo;
      if (listOfLessons.every(lesson => lesson.classNo === classNo)) {
        listOfLessons.forEach(lesson => {
          lesson.displayStatus = ONLY;
        });
      }
    });
    // replace with the sorted version
    module.Timetable = lessons;
  } else {
    // came from forage, just restore back data
    Object.values(module.Timetable).forEach((listOfLessons) => {
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

function createLesson(data, moduleCode) {
  const lesson = {};
  Object.keys(data).forEach((property) => {
    // Convert TitleCase to camelCase
    const firstLetter = property.charAt(0).toLowerCase();
    const properProperty = firstLetter + property.slice(1);
    lesson[properProperty] = data[property];
  });

  // if weekText is too long, and contains commas
  if (~lesson.weekText.indexOf(',') && lesson.weekText.length > 5) {
    lesson.weekText = `Weeks ${commaSeparatedToRange(lesson.weekText)}`;
  } else if (lesson.weekText === 'Every Week') {
    lesson.weekText = '';
  }

  // set num of hours for lesson
  lesson.hours = calculateHours(lesson.startTime, lesson.endTime);

  lesson.moduleCode = moduleCode;
  lesson.lessonType = lesson.lessonType.slice(0, 3).toLowerCase();
  lesson.dayText = lesson.dayText.slice(0, 3).toLowerCase();

  // set uid for tracking
  lesson.uid = lesson.lessonType + moduleCode + lesson.venue;

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

// outputs '1,2,3,4,5' to '1-5'
function commaSeparatedToRange(weekText) {
  // get rid of duplicates and convert to array of numbers
  const noDuplicates = new Set(weekText.split(','));
  const numberArray = Array.from(noDuplicates).map(Number);

  // check that the array does not contains NaN
  if (numberArray.every(num => Number.isInteger(num))) {
    numberArray.sort((a, b) => a - b); // sort it in ascending order
  } else {
    return weekText; // throw back the original string
  }

  // 2d array, where each sub array is a range
  const arr = [[numberArray[0]]];
  let index = 0;
  for (let i = 1, len = numberArray.length; i < len; i++) {
    const num = numberArray[i];
    const last = arr[index].length - 1;
    // check if number belongs in current sub array
    if (num === (arr[index][last] + 1)) {
      arr[index].push(num);
    // create a new one
    } else {
      index++;
      arr[index] = [num];
    }
  }

  // join first and last if it contains more than 1 element
  // then join the ranges to form string
  return arr.map(range => {
    if (range.length > 1) {
      return `${range[0]}-${range[range.length - 1]}`;
    }
    return range[0];
  }).join(', ');
}
