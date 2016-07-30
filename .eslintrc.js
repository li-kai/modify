module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  extends: 'airbnb-base',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // adapt most from airbnb, with a few changes
  'rules': {
    'import/no-unresolved': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    // allow console during development
    'no-console': process.env.NODE_ENV === 'production' ? 2 : 0,
    // allow functions to be hoisted
    "no-use-before-define": [2, "nofunc"],
    // shadowing and reassign is allowed or else vuex won't work
    "no-shadow": 0,
    "no-param-reassign": 0,
  }
}
