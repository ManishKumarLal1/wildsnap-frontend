export interface User {
  id: string;
  username: string;
  avatar: string;
  xp: number;
  level: number;
  speciesDiscovered: number;
  streak: number;
  lastObservationDate: string | null;
  location: string;
}