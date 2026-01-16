import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from '../reducers/user.reducer';

export const selectUserState = createFeatureSelector<UserState>('users');

export const selectAllUsers = createSelector(
    selectUserState,
    (state: UserState) => state.users
);

export const selectSelectedUser = createSelector(
    selectUserState,
    (state: UserState) => state.selectedUser
);

export const selectUsersLoading = createSelector(
    selectUserState,
    (state: UserState) => state.loading
);

export const selectUsersError = createSelector(
    selectUserState,
    (state: UserState) => state.error
);

export const selectUserById = (userId: string) =>
    createSelector(selectAllUsers, (users) =>
        users.find((user) => user.id === userId)
    );
