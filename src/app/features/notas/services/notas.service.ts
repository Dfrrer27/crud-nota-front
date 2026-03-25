import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment';
import { ApiResponse, E_Nota } from '../models/notas.interface';

@Injectable({
  providedIn: 'root'
})
export class NotasService {

  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl + 'Notas';

  constructor() { }

  listarNotas(){
    return this.http.get<ApiResponse<E_Nota[]>>(this.apiUrl);
  }

  verNotaDetalle(id: number) {
    return this.http.get<ApiResponse<E_Nota>>(`${this.apiUrl}/${id}`);
  }

  crearNota(nota: E_Nota) {
    return this.http.post<ApiResponse<E_Nota>>(this.apiUrl, nota);
  }

  actualizarNota(nota: E_Nota) {
    return this.http.put<ApiResponse<E_Nota>>(`${this.apiUrl}/${nota.id}`, nota);
  }

  eliminarNota(id: number) {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`);
  }

}
