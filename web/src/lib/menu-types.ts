export interface PlatoMenu {
  id?: string;
  nombre: string;
  descripcion: string;
  categoria: 'entrante' | 'principal' | 'bebida' | 'postre';
  orden: number;
}

export interface MenuDia {
  id?: string;
  precio: number;
  precioTerraza: number;
  activo: boolean;
  platos: PlatoMenu[];
  updatedAt?: string;
}

export interface PlatoCarta {
  id?: string;
  nombre: string;
  precio: string;
  imagen: string;
  badge: string;
  descripcion: string;
  visible: boolean;
  orden: number;
  updatedAt?: string;
}

export interface PlatoEstrella {
  nombre: string;
  subtitulo: string;
  descripcion: string;
  detalle: string;
  precio: string;
  imagen: string;
  updatedAt?: string;
}
