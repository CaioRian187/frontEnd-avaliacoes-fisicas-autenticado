export type GeneroEnum =
  | 'HOMEM_CISGENERO'
  | 'HOMEM_TRANSGENERO'
  | 'HOMEM_TRANSEXUAL'
  | 'MULHER_CISGENERO'
  | 'MULHER_TRANSGENERO'
  | 'MULHER_TRANSEXUAL'
  | 'GENERO_NAO_BINARIO'
  | 'AGENERO'
  | 'GENERO_FLUIDO'
  | 'BIGENERO'
  | 'POLIGENERO'
  | 'GENERO_NEUTRO'
  | 'PREFIRO_NAO_RESPONDER'
  | 'INDEFINIDO';

export const GENERO_OPTIONS: { value: GeneroEnum; label: string }[] = [
  { value: 'HOMEM_CISGENERO', label: 'Homem Cisgênero' },
  { value: 'HOMEM_TRANSGENERO', label: 'Homem Transgênero' },
  { value: 'HOMEM_TRANSEXUAL', label: 'Homem Transexual' },
  { value: 'MULHER_CISGENERO', label: 'Mulher Cisgênero' },
  { value: 'MULHER_TRANSGENERO', label: 'Mulher Transgênero' },
  { value: 'MULHER_TRANSEXUAL', label: 'Mulher Transexual' },
  { value: 'GENERO_NAO_BINARIO', label: 'Gênero Não-Binário' },
  { value: 'AGENERO', label: 'Agênero' },
  { value: 'GENERO_FLUIDO', label: 'Gênero Fluido' },
  { value: 'BIGENERO', label: 'Bigênero' },
  { value: 'POLIGENERO', label: 'Poligênero' },
  { value: 'GENERO_NEUTRO', label: 'Gênero Neutro' },
  { value: 'PREFIRO_NAO_RESPONDER', label: 'Prefiro não responder' },
  { value: 'INDEFINIDO', label: 'Indefinido' },
];

export const generoLabel = (genero?: GeneroEnum | string): string => {
  return GENERO_OPTIONS.find((item) => item.value === genero)?.label ?? "";
};
