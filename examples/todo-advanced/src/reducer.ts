import { createReducer } from 'redux-flip';
import { actionMap, addTodo } from './actions';
import { IState } from './types';

const initialState: IState = {
  tasks: {
    byId: {},
    allIds: [],
  },
};

const reducer = createReducer(initialState, actionMap);
const initial = reducer(undefined, {});
console.log(initial);
const newState = reducer(initial, addTodo({ id: 'a', todo: 'get milk' }));
console.log(newState);