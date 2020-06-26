import { combineReducers } from '@reduxjs/toolkit';
import undoable, { excludeAction } from 'redux-undo';
import graphInitReducer from './graphInitSlice';
import graphReducer, { setRange } from './graphSlice';

// History group that collapses both actions into 1 undo/redo
const undoGroup = (action, currentState, previousHistory) => {
  switch (action.type) {
    case 'graph/processGraphResponse':
      return previousHistory.group;
    case 'graph/addQuery':
      if (previousHistory.group !== null) {
        return `addDataGroup${previousHistory.past.length}`;
      }
      return 'addDataGroup';

    default:
      return null;
  }
};

// Enhanced graph reducer
const graphReducerHistory = undoable(graphReducer, {
  filter: excludeAction(setRange.type),
  group: undoGroup,
});

// Export combined reducers
export const investigateReducer = combineReducers({
  graphInit: graphInitReducer,
  graph: graphReducerHistory,
});

// Export all actions
export * from './graphInitSlice';
export * from './graphSlice';