import type { PlatoMenu } from './menu-types';

export interface MenuDiaData {
  precio: number;
  precioTerraza: number;
  activo: boolean;
  platos: PlatoMenu[];
}

export const menuDefecto: MenuDiaData = {
  precio: 25,
  precioTerraza: 26.5,
  activo: true,
  platos: [
    { nombre: 'Ensalada mixta', descripcion: '', categoria: 'entrante', orden: 0 },
    { nombre: 'Sopa castellana', descripcion: '', categoria: 'entrante', orden: 1 },
    { nombre: 'Croquetas caseras', descripcion: '', categoria: 'entrante', orden: 2 },
    { nombre: 'Pimientos del piquillo rellenos', descripcion: '', categoria: 'entrante', orden: 3 },
    { nombre: 'Filete de ternera a la plancha', descripcion: '', categoria: 'principal', orden: 0 },
    { nombre: 'Merluza en salsa verde', descripcion: '', categoria: 'principal', orden: 1 },
    { nombre: 'Pollo asado con patatas', descripcion: '', categoria: 'principal', orden: 2 },
    { nombre: 'Estofado de cerdo', descripcion: '', categoria: 'principal', orden: 3 },
    { nombre: 'Agua o refresco', descripcion: '', categoria: 'bebida', orden: 0 },
    { nombre: 'Copa de vino de la casa', descripcion: '', categoria: 'bebida', orden: 1 },
    { nombre: 'Caña', descripcion: '', categoria: 'bebida', orden: 2 },
    { nombre: 'Flan casero', descripcion: '', categoria: 'postre', orden: 0 },
    { nombre: 'Fruta del tiempo', descripcion: '', categoria: 'postre', orden: 1 },
    { nombre: 'Café o infusión', descripcion: '', categoria: 'postre', orden: 2 },
  ],
};
