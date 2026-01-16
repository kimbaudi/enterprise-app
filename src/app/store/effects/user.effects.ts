import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import * as UserActions from '../actions/user.actions';
import { ApiService } from '../../core/services/api.service';
import { User } from '@core/models';

@Injectable()
export class UserEffects {
    private actions$ = inject(Actions);
    private apiService = inject(ApiService);

    loadUsers$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UserActions.loadUsers),
            switchMap(() =>
                this.apiService.get<User[]>('/users').pipe(
                    map((users) => UserActions.loadUsersSuccess({ users })),
                    catchError((error) =>
                        of(UserActions.loadUsersFailure({ error: error.message }))
                    )
                )
            )
        )
    );
}
