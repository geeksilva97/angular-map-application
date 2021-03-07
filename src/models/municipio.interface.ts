export interface Municipio {
  id: number;
  microrregiao: MicroRegiao;
  nome: string;
  ['regiao-imediata']?: any;
}

export interface MicroRegiao {
  id: number;
  nome: string;
  mesorregiao: MesoRegiao;
}

export interface MesoRegiao {
  id: number;
  UF: UFData;
  nome: string;
}

export interface UFData {
  id: number;
  sigla: string;
  nome: string;
  regiao?: any;
}