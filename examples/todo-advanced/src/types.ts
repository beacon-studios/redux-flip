import { IMutator } from 'redux-flip';

export interface ITask {
  id: string;
  todo: string;
}

export interface IState {
  tasks: {
    byId: { [key: string]: ITask };
    allIds: string[];
  };
}

export type IStateMutator = IMutator<IState>;