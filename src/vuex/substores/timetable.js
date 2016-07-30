import {
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
  - Injecting css styles (yes it's allowed)
*/
// For visibility of lessons
const SELECTED = 'selected';
const HIDDEN = 'hidden';
const GHOSTED = 'ghosted';
const ONLY = 'only';
const INITIAL = 'initial';

// Hex code for colors
const colorsList = ['#42A5F5', '#4CAF50', '#FBC02D',
                    '#e74c3c', '#FB8C00', '#BA68C8',
                    '#80CBC4', '#BDBDBD', '#90A4AE'];

const state = {
  week: {
    mon: [],
    tue: [],
    wed: [],
    thu: [],
    fri: [],
  },
  userModules: [],
  selectable: [],
  selected: {},
  colorCounter: -1,
  retrieveError: false,
};

// mutations
const mutations = {
  [ADD_MODULE](state, module) {
    state.retrieveError = false;
    state.userModules.push(module);
    if (module.hasOwnProperty('Timetable')) {
      allocateLessons(state, module);
      sortByLengthDescending(state.week);
    }
    // wrap color if more than 9 modules
    state.colorCounter = (state.colorCounter + 1) % colorsList.length;
    module.Color = colorsList[state.colorCounter];
    insertCSSClass(module);
  },
  [ADD_ERROR](state) {
    state.retrieveError = true;
  },
  [CHANGE_MODULE_COLOR](state, module, colorHex) {
    const index = state.userModules.length - state.userModules.indexOf(module) - 1;
    const cssRuleCode = document.all ? 'rules' : 'cssRules'; // account for IE and FF
    const rule = document.styleSheets[0][cssRuleCode][index];
    rule.style.color = colorHex;
    module.Color = colorHex;
  },
  [DELETE_MODULE](state, module) {
    const moduleCode = module.ModuleCode;
    Object.values(state.week).filter(lesson => !lesson.moduleCode.match(moduleCode));
    state.userModules.$remove(module);
  },
  [ON_CLICK_LESSON](state, lesson) {
    // user starts to pick lesson type
    // make all lesson types ghosted to be selectable
    if (state.selectable.length === 0) {
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

    // user has picked a lesson, hide all other lessons
    } else {
      // user clicked on same lesson type
      if (state.selected.moduleCode === lesson.moduleCode &&
        state.selected.lessonType === lesson.lessonType) {
        state.selected = lesson;
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

// set color for module via inserting it in a stylesheet
function insertCSSClass(module) {
  const colorClass = `.module__${module.ModuleCode}`;
  const color = module.Color;
  document.styleSheets[0].insertRule(`${colorClass}{color:${color};}`, 0);
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
  const lessons = {};
  for (const data of module.Timetable) {
    const lesson = createLesson(data, module.ModuleCode);

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
