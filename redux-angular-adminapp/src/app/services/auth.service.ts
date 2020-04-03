import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';
import { AngularFirestore } from '@angular/fire/firestore';

import 'firebase/firestore';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as auth from '../auth/auth.actions';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private _auth: AngularFireAuth,
    public firestore: AngularFirestore,
    private _store: Store<AppState>
  ) { }

  initAuthListener() {
    this._auth.authState.subscribe( fuser => {

      if ( fuser ) {
        this.firestore.doc(`${fuser.uid}/usuario`).valueChanges()
          .subscribe( firestoreUser => {
            const tempUser = new Usuario(
              'asd',
              'dssd',
              'dsadsadsad'
            );
            this._store.dispatch( auth.setUser({ user: tempUser }) );
          });

      } else {
        this._store.dispatch( auth.unsetUser() );
      }

    });
  }

  crearUsuario(
    nombre: string,
    email: string,
    password: string) {

    return this._auth.createUserWithEmailAndPassword(email, password)
      .then( ({ user }) => {
        const newUser = new Usuario(
          user.uid,
          nombre,
          user.email
        );

        return this.firestore.doc(`${ user.uid }/usuario`)
          .set({ ...newUser })
          .then( () => {
          });

      }).catch( err => {

      });
  }

  logearUsuario(correo, password) {
    return this._auth.signInWithEmailAndPassword(correo, password);
  }

  logoutUsuario() {
    return this._auth.signOut();
  }

  isLogged() {
    return this._auth.authState.pipe(
      map( fUser => fUser !== null )
    );
  }
}
