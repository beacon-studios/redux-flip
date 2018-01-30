import { Dispatch } from 'react-redux';

export interface IAction<TType extends string> {
  type: TType;
}

export interface IActionWithPayload<TType extends string, TPayload> extends IAction<TType> {
  payload: TPayload;
}

export type IMutator<TState> = (state: TState) => TState;
export type IStateMapper<TState, TStateProps, TOwnProps = {}> = (ownProps: TOwnProps) => (state: TState) => TStateProps;
export type IDispatchMapper<TDispatchProps, TOwnProps = {}> = (ownProps: TOwnProps) => (dispatch: Dispatch<any>) => TDispatchProps;

export interface IActionHandler<TState, TType extends string, TPayload> {
  type: TType,
  (payload: TPayload): IActionWithPayload<TType, TPayload>;
  handler(payload: TPayload): IMutator<TState>;
}

export interface IActionMap<TState, TActions extends IAction<any>> {
  /* TODO: once TypeScript supports advanced types as key, key should be A['type'] */
  [key: string]: (action: TActions) => IMutator<TState>;
}