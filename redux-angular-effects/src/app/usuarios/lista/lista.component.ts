import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { map } from 'rxjs/operators';
import { Usuario } from '../../models/usuario.model';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.reducers';
import { cargarUsuarios } from '../../store/actions/usuarios.actions';

@Component({
    selector: 'app-lista',
    templateUrl: './lista.component.html',
    styleUrls: ['./lista.component.scss']
})
export class ListaComponent implements OnInit {
    usuarios: Usuario[] = [];
    loading: boolean = false;
    error: any;

    constructor(
        private store: Store<AppState>
        // Vamos a quitar el servicio desde componentes
        // private usuarioSrv: UsuarioService
        ) {
        console.log('1')
        this.store.select('usuarios')
            .subscribe( ({ users, loading, error }) => {
                console.log('hola')
                this.usuarios = users;
                this.loading  = loading;
                this.error    = error;
            });
    }

    ngOnInit(): void {
        this.store.dispatch( cargarUsuarios() );

        // this.usuarioSrv.getUsers()
        //     .subscribe( res => this.usuarios = res);

    }
}