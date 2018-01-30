import {
  MapStateToPropsParam,
  MapDispatchToPropsParam,
  Dispatch,
  InferableComponentEnhancerWithProps,
  MergeProps,
  connect as originalConnect
} from 'react-redux';

import {
  IAction,
  IActionMap,
  IStateMapper,
  IDispatchMapper,
  IMutator
} from './types';


export function createReducer<TState, TActions extends IAction<any>>(
  initialState: TState,
  actions: IActionMap<TState, TActions>,
) {
  return (state: TState = initialState, action: TActions | any) => {
    if(action && typeof action === 'object' && 'type' in action && action.type in actions) {
      const mutator = actions[action.type](action);
      return mutator(state);

    } else {
      return state;
    }
  };
}

export function createMapStateToProps<TState, TStateProps, TOwnProps = {}>(
  mapper: IStateMapper<TState, TStateProps, TOwnProps>,
): MapStateToPropsParam<TStateProps, TOwnProps, TState> {
  return (state: TState, ownProps: TOwnProps): TStateProps => {
    return mapper(ownProps)(state);
  };
}

export function createMapDispatchToProps<TDispatchProps, TOwnProps = {}>(
  mapper: IDispatchMapper<TDispatchProps, TOwnProps>,
): MapDispatchToPropsParam<TDispatchProps, TOwnProps> {
  return (dispatch: Dispatch<any>, ownProps: TOwnProps): TDispatchProps => {
    return mapper(ownProps)(dispatch);
  };
}

export function applyMutations<S>(effects: Array<IMutator<S>>): IMutator<S> {
  return (state: S) => effects.reduce((newState, effect) => effect(newState), state);
}

export function connect<TState, TOwnProps = {}, TStateProps = {}, TDispatchProps = {}, TMergedProps = {}>(
  mapStateToProps: null | undefined | IStateMapper<TState, TStateProps, TOwnProps>,
  mapDispatchToProps: null | undefined | IDispatchMapper<TDispatchProps, TOwnProps>,
  mergeProps: MergeProps<TStateProps, TDispatchProps, TOwnProps, TMergedProps>,
): InferableComponentEnhancerWithProps<TMergedProps, TOwnProps>;

export function connect<TState, TOwnProps = {}, TStateProps = {}, TDispatchProps = {}>(
  mapStateToProps: null | undefined | IStateMapper<TState, TStateProps, TOwnProps>,
  mapDispatchToProps: null | undefined | IDispatchMapper<TDispatchProps, TOwnProps>,
): InferableComponentEnhancerWithProps<TStateProps & TDispatchProps, TOwnProps> {
  const stateMapper = mapStateToProps && createMapStateToProps(mapStateToProps);
  const dispatchMapper = mapDispatchToProps && createMapDispatchToProps(mapDispatchToProps);

  if(dispatchMapper) {
    return originalConnect(stateMapper, dispatchMapper);
  } else {
    return originalConnect(stateMapper);
  }
}
