import { applyMutations, createAction } from 'redux-flip';
import { IState, ITask } from '../types';
import { insertTask, insertTaskId, dropTask, removeTaskId } from '../mutators';

export const addTodo = createAction(
  'ADD_TODO',
  (task: ITask) => applyMutations<IState>([
    insertTask(task),
    insertTaskId(task.id),
  ])
);

export const completeTodo = createAction(
  'COMPLETE_TODO',
  (taskId: string) => applyMutations<IState>([
    dropTask(taskId),
    removeTaskId(taskId),
  ]),
);

export default [addTodo, completeTodo];