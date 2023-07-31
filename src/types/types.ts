import { Request, Response } from "express";

type EmergencyCardType = {
  name: string;
  phone_number: string;
};

type BpmCardType = {
  date: string;
  bpm: number;
};

type CommunicationCardType = {
  category: string;
  text: string;
};

type EventCardType = {
  date: string;
  text: string;
};

type MedicineCardType = {
  name: string;
  quantity: number;
  time_interval: number;
};

type ProfessionalCardType = {
  name: string;
  job: string;
  phone_number: string;
};

type ExerciseCardType = {
  name: string;
  minutes: number;
};

export type ColumnType =
  | EmergencyCardType
  | BpmCardType
  | CommunicationCardType
  | EventCardType
  | MedicineCardType
  | ProfessionalCardType
  | ExerciseCardType;

export interface ValueInterface {
  column_name: string;
  item: ColumnType;
  user_id: string;
}

export interface UserFromDB {
  id: string;
  name: string;
  email: string;
  age: number;
  height: number;
  weight: number;
  address: string;
  emergency_card: EmergencyCardType[];
  bpm_card: BpmCardType[];
  communication_card: CommunicationCardType[];
  event_card: EventCardType[];
  medicine_card: MedicineCardType[];
  professional_card: ProfessionalCardType[];
  exercise_card: ExerciseCardType[];
}

export type UserInfo = {
  uid: string;
  displayName: string;
  email: string;
};

export interface MyContext {
  req: Request;
  res: Response;
}

export interface CreateResult {
  created?: boolean;
  error?: boolean;
  limit_reached?: boolean;
}
