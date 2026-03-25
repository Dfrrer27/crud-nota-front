export interface E_Nota {
  id?: number,
  sTitulo: string,
  sDescripcion: string,
  dFechaCreacion?: Date,
  dFechaModificacion?: Date,
  bEstado?: boolean,
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}