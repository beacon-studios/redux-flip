import { IActionMap, createActionMap } from 'redux-flip';
import { IState } from '../types';
import todoActions from './todos';

export * from './todos';

export const actionMap: IActionMap<IState, any> = createActionMap(todoActions);