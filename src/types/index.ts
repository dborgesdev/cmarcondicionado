export interface Photo {
  url: string;
  alt: string;
  width?: number;
  height?: number;
  srcSet?: string;
  preview?: string;
}
export interface Media {
  source_url: string;
  alt_text?: string;
  media_details?: {
    width?: number;
    height?: number;
    sizes?: Record<string, { source_url: string; width: number }>;
  };
}
export interface AcfImage {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
  sizes?: Record<string, string | number>;
}
export interface WPPost {
  id: number;
  slug: string;
  date?: string;
  title: { rendered: string };
  content?: { rendered: string };
  featured_media?: number;
  "categorias-pecas"?: number[];
  "tipos-trabalho"?: number[];
  _embedded?: { "wp:featuredmedia"?: Media[] };
  cm_galeria?: {
    url: string;
    alt: string;
    width: number;
    height: number;
    preview_url?: string;
    srcset?: string;
  }[];
  acf?: {
    codigo_referencia?: string;
    marca_fabricante?: string;
    compatibilidade?: string;
    estado_peca?: string;
    preco?: number | string;
    exibir_preco?: boolean;
    disponibilidade?: string;
    galeria?: Record<string, AcfImage | false>;
  };
}
export interface Item {
  id: number;
  slug: string;
  name: string;
  html: string;
  cover?: Photo;
  photos: Photo[];
  categories: number[];
}
export interface Work extends Item {
  date?: string;
  galleryAvailable: boolean;
}
export interface Piece extends Item {
  code: string;
  brand: string;
  compatibility: string;
  condition: string;
  availability: string;
  price?: number;
}
export interface Term {
  id: number;
  name: string;
  slug: string;
}
