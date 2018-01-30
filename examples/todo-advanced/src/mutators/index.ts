import * as R from 'ramda';
import { IMutator } from 'redux-flip';
import { IState, ITask } from '../types';

export const insertTask = (task: ITask): IMutator<IState> =>
  R.set(R.lensPath(['tasks', 'byId', task.id]), task);

export const insertTaskId = (taskId: string): IMutator<IState> =>
  R.over(R.lensPath(['tasks', 'allIds']), R.append(taskId));

export const dropTask = (taskId: string): IMutator<IState> =>
  R.dissocPath(['tasks', 'byId', taskId]);

export const removeTaskId = (taskId: string): IMutator<IState> =>
  R.over(R.lensPath(['tasks', 'allIds']), R.reject(R.equals(taskId)));
