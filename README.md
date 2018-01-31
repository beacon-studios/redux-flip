# redux-flip
Redux-flip is a utility library designed to scale out react-redux applications using functional practices.

The included utilities are all small, incremental changes to the redux API that make it more functional. Used together, they enable powerful new patterns and abstractions that allow redux to scale much more effectively.

### Why `redux-flip`?

There are already many great patterns available for scaling `react-redux` applications, from selectors and separated containers on the frontend to combined reducers and action creators on the backend. However, when applications hit a certain scale, the reducers become a bottleneck for complicated logic and there isn't a good standard paradigm for scaling reducers out. `redux-flip` is an interpretation of how reducers could scale if functional programming best practices are applied over `redux`'s existing API.

### Actions

### Reducers

The design of reducers in `redux-flip` is based around a reducer which is composed of mutators. Mutators are similar to a single `case` in a traditional switch-based reducer, in that they take a state and a specific action and return a new state. However, we provide additional utilities that allow for composing mutators together in a way that lends itself towards readability and scalability. By breaking down mutators into smaller functions that can be combined, it becomes possible to build up a library of domain-specific tools for updating your state object.

The following functions are designed to improve the scalability of redux reducers. 

`createReducer(initialState, mutatorMap)` takes an initialState and an object keyed by action type, where the values are a function of signature `(payload) => (state) => state`, and returns a regular redux reducer with signature `(state?, action) => state`.

`applyMutations(mutator[]) => (state) => state` takes an array of mutators and the current state and returns a new state based on applying each of the mutations to the state in turn. In this manner we can easily apply multiple mutations to the  state at once.

**Before**

```js
// constants/actionTypes.js

export const COMPLETE_TODO = 'COMPLETE_TODO';
export const DELETE_TODO = 'DELETE_TODO';
```

```js
// actions/todo.js

export const completeTodo = (todoId) => ({
  type: COMPLETE_TODO,
  payload: todoId,
});

export const deleteTodo = (todoId) => ({
  type: DELETE_TODO,
  payload: todoId,
});
```

```js
// reducers/todo.js

import * as R from 'ramda';
import {COMPLETE_TODO, DELETE_TODO} from '../constants/actionTypes';

const initialState = {
  byId: {},
  allIds: [],
};

const todoPath = (todoId) => ['byId', todoId];

export default function(state = initialState, action) {
  switch(action.type) {
    case COMPLETE_TODO:
      return R.assocPath([...todoPath(action.payload), 'isComplete'], true, state);
      
    case DELETE_TODO:
      return R.pipe(
        R.dissocPath(todoPath(action.payload)),
        R.over(R.lensProp('allIds'), R.reject(R.equals(action.payload))),
      )(state);
      
    default:
      return state;
  }
};
```

```js
// reducers/index.js

import {combineReducers} from 'redux';
import todo from './todo';

export default combineReducers({
  todo,
});
```

**After**
```
// mutators/todo.js

export const todoPath = (todoId) => ['byId', todoId];

export const completeTodo = (todoId) => R.assocPath([...todoPath(todoId), 'isComplete'], true);
export const deleteTodo = (todoId) => R.dissocPath(todoPath(todoId));
export const dropTodoId = (todoId) => R.over(R.lensProp('allIds'), R.reject(R.equals(todoId)));
```

```
// actions/todo.js
import {applyMutators} from 'redux-flip';
import * as mutators from '../mutators/todo';

export const completeTodo = createAction('COMPLETE_TODO', mutators.completeTodo);

export const deleteTodo = createAction('DELETE_TODO', (todoId) => applyMutators([
  mutators.deleteTodo(todoId),
  mutators.dropTodoId(todoId),
]));

export default [completeTodo, deleteTodo];
```

```
// actions/index.js
import {createReducer, createActionMap} from 'redux-flip';
import todoActions from './todo';

export default createReducer(createActionMap(todoActions));
```

### Containers

The following functions are designed to reduce boilerplate in containers:

`createMapStateToProps(stateMapper)` takes a function with the signature `(ownProps) => (state) => stateProps` and maps it to the normal mapStateToProps signature of `(state, ownProps) => stateProps`.

`createMapDispatchToProps(dispatchMapper)` takes a function with the signature `(ownProps) => (dispatch) => dispatchProps` and maps it to the normal mapDispatchToProps signature of `(dispatch, ownProps) => dispatchProps`.

`connect` is an enhancement on top of react-redux's built-in `connect` function that automatically applies `createMapStateToProps` and `createMapDispatchToProps`.

`bindSelectors(selectors) => (state) => boundSelectors` takes an object containing selectors, and returns an object of the same structure but with the selectors bound to the state.

`bindActionCreators(actionCreators) => (dispatch) => boundActionCreators` takes an object containing action creators, and returns an object of the same structure but with the action creators bound to `dispatch`. Because the function is curried and takes the `dispatch` function as its last argument, it can be used in a point-free style with `redux-flip`'s `mapDispatchToProps` syntax.

**Before**
```js
import {connect} from 'react-redux';

const makeMapStateToProps = (state, {todoId}) => {
   const todoSelector = makeTodoSelector(todoId);
   
   return (state) => ({
     todo: todoSelector(state),
   });
};

const mapDispatchToProps = (dispatch, {todoId}) => ({
  completeTodo: () => dispatch(completeTodo(todoId)),
  deleteTodo: () => dispatch(deleteTodo(todoId)),
});

connect(makeMapStateToProps, mapDispatchToProps)(MyComponent);
```

**After**
```js
import {connect} from 'redux-flip';

const mapStateToProps = ({todoId}) => bindSelectors({
  todo: makeTodoSelector(todoId),
});

const mapDispatchToProps = ({todoId}) => bindActionCreators({
  completeTodo: () => completeTodo(todoId),
  deleteTodo: () => deleteTodo(todoId),
});

connect(mapStateToProps, mapDispatchToProps)(MyComponent);
```
