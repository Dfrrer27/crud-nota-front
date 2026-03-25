import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NotasService } from '../../services/notas.service';
import { E_Nota } from '../../models/notas.interface';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lista-notas',
  standalone: true,
  imports: [
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    CommonModule
  ],
  templateUrl: './lista-notas.component.html',
  styleUrl: './lista-notas.component.scss'
})
export class ListaNotasComponent {

  // Inyección de dependencias
  private readonly _notasService = inject(NotasService);
  private readonly _router = inject(Router);

  // Variables
  public listaNotas: E_Nota[] = [];
  public displayedColumns : string[] = ['accion','sTitulo','sDescripcion','dFechaCreacion','dFechaModificacion', 'bEstado'];

  constructor(){
    this.obtenerNotas();
  }

  //#region Obtener notas

    async obtenerNotas(){
      const result = await firstValueFrom(this._notasService.listarNotas())

      if (result.data.length > 0){
        this.listaNotas = result.data;
      } else {
        this.listaNotas = [];
        console.log(result.message);
      }
    }

  //#endregion

  //#region Navegación

    nuevo(){
      this._router.navigate(['/notas-detalle',0]);
    }

    editar(objeto:E_Nota){
      console.log('Editar nota con id:', objeto.id);
      this._router.navigate(['/notas-detalle', objeto.id]);
    }

  //#endregion

  //#region Eliminar nota

    async eliminar(objeto:E_Nota){
      var resp = await Swal.fire({
        title: '¿Desea continuar?',
        text: 'Si confirma, se eliminará la nota seleccionada.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar'
      })

      if (!resp.isConfirmed) {
        return;
      } else {
        await this.eliminarNota(objeto.id!);
        Swal.fire('¡Eliminado!', 'La nota ha sido eliminada.', 'success');
        this.obtenerNotas();
      }
    }

    async eliminarNota(id: number){
      try {
        const result = await firstValueFrom(this._notasService.eliminarNota(id))
        if (result.success){
          return true;
        } else {
          return false;
        }
      } catch (error) {
        console.error(error);
        return false;
      }
    }
  
  //#endregion

}
