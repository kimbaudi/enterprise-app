import { ActionReducerMap } from '@ngrx/store';
import { userReducer, UserState } from './reducers/user.reducer';

export interface AppState {
    users: UserState;
}

export const appReducers: ActionReducerMap<AppState> = {
    users: userReducer,
};
