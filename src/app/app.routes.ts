import { Routes } from '@angular/router';
import { ListaNotasComponent } from './features/notas/pages/lista-notas/lista-notas.component';
import { NotasDetalleComponent } from './features/notas/pages/notas-detalle/notas-detalle.component';

export const routes: Routes = [
  { path: '', redirectTo: '', pathMatch: 'full' },

  {path:'',component: ListaNotasComponent},
  
  {path:'inicio',component: ListaNotasComponent},

  {path:'notas-detalle/:id',component: NotasDetalleComponent},

  { path: '**', redirectTo: '', pathMatch: 'full' }
];
