import {
  ADD_MODULE,
  DELETE_MODULE,
  HIDE_MODULE,
  ADD_ERROR,
  CHANGE_MODULE_COLOR,
} from '../mutation-types'

const state = {
  userModules: [],
  retrieveError: false,
  colorCounter: -1
}

const colorsList = ['#42A5F5', '#4CAF50', '#FBC02D', '#e74c3c', '#FB8C00', '#BA68C8', '#80CBC4', '#BDBDBD', '#90A4AE']

// Create an object storing various mutations. We will write the mutation
const mutations = {
  [ADD_MODULE] (state, module) {
    state.retrieveError = false
    /*
    // add a 'isShown' var to module
    module.isShown = true
    // add a 'color' var to module
    module.color = state.colorCounter++
    */
    state.userModules.push(module)

    const colorClass = '.module__' + module.ModuleCode
    // wrap color if more than 9 modules
    state.colorCounter = (state.colorCounter + 1) % colorsList.length
    document.styleSheets[0].insertRule(colorClass + '{color:' + colorsList[state.colorCounter] + ';}', 0)
  },
  [ADD_ERROR] (state) {
    state.retrieveError = true
  },
  [DELETE_MODULE] (state, module) {
    const index = state.userModules.indexOf(module)
    document.styleSheets[0].deleteRule(state.userModules.length - index - 1)
    state.userModules.$remove(module)
  },
  [HIDE_MODULE] (state, index) {
    const isShown = state.userModules[index].isShown
    state.userModules[index].isShown = !isShown
  },
  [CHANGE_MODULE_COLOR] (state, module, colorHex) {
    const index = state.userModules.length - state.userModules.indexOf(module) - 1
    const cssRuleCode = document.all ? 'rules' : 'cssRules' // account for IE and FF
    let rule = document.styleSheets[0][cssRuleCode][index]
    rule.style['color'] = colorHex
  }
}

export default {
  state,
  mutations
}
