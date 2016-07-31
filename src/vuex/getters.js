/* gets list of all module codes and descriptions only */
export const getAllModules = state => state.search.listOfModules;
export const getAllModulesResponse = state => state.search.retrieveAllError;
/* checks if user is searching for a module */
export const getSearchStatus = state => state.search.isSearching;

/* gets the specific module timetable */
export const getWeek = state => state.timetable.week;
export const getUserModules = state => state.timetable.userModules;
export const getNumOfModules = state => Object.keys(state.timetable.userModules).length;
export const getModuleResponse = state => state.timetable.retrieveError;
export const getSelectable = state => state.timetable.selectable;
