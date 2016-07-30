/* eslint-disable */
import * as localforage from "localforage"
import {
  ATTACH_USER_MODULES,
  ADD_MODULE,
  DELETE_MODULE,
  ON_CLICK_LESSON
} from './mutation-types'

const STORAGE_KEY = 'modify-modules'

const localStoragePlugin = store => {
  const storage = window.localStorage
  if (!isStoragePresent(storage)) {
    return // no storage, early return
  }
  localforage.getItem(STORAGE_KEY).then(function (value) {
    console.log('success')
    console.log(value)
  }).catch(function (err) {
    console.log('error')
    console.log(err)
  })
  const timetable = JSON.parse(storage.getItem(STORAGE_KEY))
  store.dispatch(ATTACH_USER_MODULES, timetable)

  store.subscribe((mutation, { timetable }) => {
    if (mutation.type === ADD_MODULE ||
      mutation.type === DELETE_MODULE ||
      mutation.type === ON_CLICK_LESSON) {
      storage.setItem(STORAGE_KEY, JSON.stringify(timetable))
    }
  })
}

function isStoragePresent (storage) {
  const test = 'test'
  try {
    storage.setItem(test, test)
    storage.removeItem(test)
    return true
  } catch (e) {
    return false
  }
}

export default [localStoragePlugin]