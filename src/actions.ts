import { IMutator, IActionHandler } from './types';

export function createAction<TState, TType extends string, TPayload>(
  type: TType,
  handler: (payload: TPayload) => IMutator<TState>,
) {
  const creator = (payload: TPayload) => ({ type, payload });
  const action: IActionHandler<TState, TType, TPayload> = Object.assign(creator, { type, handler });
  return action;
}

export function createActionMap<TState>(
  handlers: Array<IActionHandler<TState, any, any>>,
) {
  return handlers.reduce((obj, handler) => ({
    ...obj,
    [handler.type]: handler.handler
  }), {});
}