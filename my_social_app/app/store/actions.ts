import { AppDispatch } from './store';

export const RESET_STORE = 'RESET_STORE';

export const resetStore = (dispatch: AppDispatch) => {
  dispatch({ type: RESET_STORE });
};
