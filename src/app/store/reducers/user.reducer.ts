import { createReducer, on } from '@ngrx/store';
import * as UserActions from '@store/actions/user.actions';
import { User } from '@core/models';

export interface UserState {
    users: User[];
    selectedUser: User | null;
    loading: boolean;
    error: string | null;
}

export const initialState: UserState = {
    users: [],
    selectedUser: null,
    loading: false,
    error: null,
};

export const userReducer = createReducer(
    initialState,
    on(UserActions.loadUsers, (state) => ({
        ...state,
        loading: true,
        error: null,
    })),
    on(UserActions.loadUsersSuccess, (state, { users }) => ({
        ...state,
        users,
        loading: false,
    })),
    on(UserActions.loadUsersFailure, (state, { error }) => ({
        ...state,
        error,
        loading: false,
    })),
    on(UserActions.selectUser, (state, { userId }) => ({
        ...state,
        selectedUser: state.users.find((user) => user.id === userId) || null,
    })),
    on(UserActions.clearSelectedUser, (state) => ({
        ...state,
        selectedUser: null,
    }))
);
