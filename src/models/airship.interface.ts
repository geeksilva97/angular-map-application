export interface Airship {
  name: string;
  maximumSpeed: number; //km/h
  fastCruiseSpeed: number;
  range: number; // autonomia com um tanque padrão
  endurance: number; // milissecond
}