import { Component, inject, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NotasService } from '../../services/notas.service';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import Swal from 'sweetalert2';
import { E_Nota } from '../../models/notas.interface';

@Component({
  selector: 'app-notas-detalle',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  templateUrl: './notas-detalle.component.html',
  styleUrl: './notas-detalle.component.scss'
})
export class NotasDetalleComponent {

  private readonly _fb = inject(FormBuilder);
  private readonly _notasService = inject(NotasService);
  private readonly _router = inject(Router);
  private readonly _activatedRoute = inject(ActivatedRoute);

  // Control de Formulario
  notaForm!: FormGroup;

  nIdNota = signal<number>(0);
  rutaPrev: WritableSignal<string> = signal(
    '/inicio'
  );

  constructor() {
    this.generarFormulario();
  }

  async ngOnInit(): Promise<void> {
    // Obtener parametro de ruta
    const { id } = await firstValueFrom(this._activatedRoute.params);

    const nIdNota = Number(id);

    if (isNaN(nIdNota)) {
      // Si no es un numero regresamos a la vista anterior
      this._router.navigate([this.rutaPrev()]);
      return;
    }

    this.nIdNota.set(nIdNota); // Seteamos id

    this.configurarComponente();
  }

  configurarComponente() {
    if (this.nIdNota() > 0) {
      // Si el id es mayor a 0, obtenemos el detalle de la nota
      this.obtenerDetalleNota();
    }
  }

  generarFormulario() {
    this.notaForm = this._fb.group({
      sTitulo: [null, Validators.required],
      sDescripcion: [null]
    });
  }

  //#region Obtener detalle de la nota

    async obtenerDetalleNota(){
      const result = await firstValueFrom(this._notasService.verNotaDetalle(this.nIdNota()))

      if (!result) {
        console.error('No se pudo obtener el detalle de la nota');
        this._router.navigate([this.rutaPrev()]);
      } else {
        this.notaForm.patchValue({
          sTitulo: result.data.sTitulo,
          sDescripcion: result.data.sDescripcion
        });
      }

    }

  //#endregion

  //#region ACCIONES

    async guardarNota() {
      if (this.notaForm.invalid) {
        this.notaForm.markAllAsTouched();
        Swal.fire('¡Error!', 'Por favor, complete los campos requeridos.', 'error');
        return;
      }

      const data: E_Nota = {
        sTitulo: this.notaForm.get('sTitulo')?.value,
        sDescripcion: this.notaForm.get('sDescripcion')?.value
      }

      try {
        const result = await firstValueFrom(this._notasService.crearNota(data));

        if (result.success) {
          Swal.fire('¡Éxito!', result.message, 'success');
          this._router.navigate([this.rutaPrev()]);
        } else {
          Swal.fire('¡Error!', result.message, 'error');
        }

      } catch (error) {
        Swal.fire('¡Error!', 'Ocurrió un error al crear la nota.', 'error');
        console.error(error);
      }
    }

    async actualizarNota() {
      if (this.notaForm.invalid) {
        this.notaForm.markAllAsTouched();
        Swal.fire('¡Error!', 'Por favor, complete los campos requeridos.', 'error');
        return;
      }

      const data: E_Nota = {
        id: this.nIdNota(),
        sTitulo: this.notaForm.get('sTitulo')?.value,
        sDescripcion: this.notaForm.get('sDescripcion')?.value
      }

      try {
        const result = await firstValueFrom(this._notasService.actualizarNota(data));

        if (result.success) {
          Swal.fire('¡Éxito!', result.message, 'success');
          this._router.navigate([this.rutaPrev()]);
        } else {
          Swal.fire('¡Error!', result.message, 'error');
        }

      } catch (error) {
        Swal.fire('¡Error!', 'Ocurrió un error al actualizar la nota.', 'error');
        console.error(error);
      }
    }

    volver() {
      this._router.navigate([this.rutaPrev()]);
    }
  //#endregion

}
