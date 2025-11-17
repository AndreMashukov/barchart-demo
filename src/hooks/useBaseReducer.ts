import React, {useReducer} from 'react';

interface BaseState {
  [key: string]: any;
}

interface BaseActions {
  [key: string]: (value: any) => void;
}

interface UseBaseReducerProps<T extends BaseState> {
  initialState: T;
}

interface UseBaseReducerReturn<T extends BaseState> {
  state: T;
  actions: BaseActions;
}

function baseReducer<T extends BaseState>(state: T, action: {type: string; payload: any}): T {
  return {
    ...state,
    [action.type]: action.payload,
  };
}

export function useBaseReducer<T extends BaseState>({
  initialState,
}: UseBaseReducerProps<T>): UseBaseReducerReturn<T> {
  const [state, dispatch] = useReducer(baseReducer, initialState);

  const actions = React.useMemo(() => {
    const actionCreators: BaseActions = {};
    Object.keys(initialState).forEach((key) => {
      const actionName = `set${key.charAt(0).toUpperCase() + key.slice(1)}`;
      actionCreators[actionName] = (value: any) => {
        dispatch({type: key, payload: value});
      };
    });
    return actionCreators;
  }, [initialState]);

  return {state: state as T, actions};
}