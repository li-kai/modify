export const userOnboardModule = [
  {
    availability: null,
    code: 'MOD101',
    color: '#E84664',
    credit: 0,
    department: 'Modify',
    description: 'Just showing you the ropes, delete me!',
    examDuration: null,
    examTime: null,
    examVenue: null,
    preclusion: null,
    prerequisite: null,
    remarks: null,
    timetable: {
      Fixed: [
        {
          code: 'MOD101',
          lessonType: 'I am',
          classNo: 'fixed.',
          venue: 'I\'m your only',
          weekText: 'choice.',
          dayText: 'tue',
          displayStatus: 'only',
          startTime: '1000',
          endTime: '1200',
          hours: 2,
          uid: 'MOD1010lecFixedIcan\'t',
        },
      ],
      Click: [
        {
          code: 'MOD101',
          lessonType: 'Click',
          classNo: 'on me!',
          venue: 'I can be',
          weekText: 'swapped.',
          dayText: 'mon',
          displayStatus: 'selected',
          startTime: '0900',
          endTime: '1000',
          hours: 1,
          uid: 'MOD101Clickon me!I can',
        },
        {
          code: 'MOD101',
          lessonType: 'Click',
          classNo: 'to select',
          venue: 'me. I will be',
          weekText: 'swapped.',
          dayText: 'mon',
          displayStatus: 'hidden',
          startTime: '1000',
          endTime: '1100',
          hours: 1,
          uid: 'MOD101Clickto select me.I was',
        },
      ],
    },
    title: 'Intro to Modify',
  },
];

/* eslint-disable */
// Hex code for colors
export const colorsList = ['#42A5F5', '#4CAF50', '#EBB72C',
                           '#f64747', '#FF8300', '#BA68C8',
                           '#7BC0BF', '#607D8B', '#919191'];
/* eslint-enable */

export const USER_MODULES_KEY = 'user-modules';
export const MODULES_LIST_KEY = 'modify-modules';
export const USER_SETTINGS_KEY = 'user-settings';
