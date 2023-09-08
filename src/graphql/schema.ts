import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type CreateResponse {
    created: Boolean
    error: Boolean
    limit_reached: Boolean
  }

  input EmergencyCardInput {
    name: String!
    phone_number: String!
  }

  type EmergencyCard {
    name: String!
    phone_number: String!
  }

  input BpmCardInput {
    date: String!
    bpm: Int!
  }

  type BpmCard {
    date: String!
    bpm: Int!
  }

  input CommunicationCardInput {
    category: String!
    text: String!
  }

  type CommunicationCard {
    category: String!
    text: String!
  }

  input EventCardInput {
    date: String!
    text: String!
  }

  type EventCard {
    date: String!
    text: String!
  }

  input MedicineCardInput {
    name: String!
    quantity: Int!
    time_interval: Int!
  }

  type MedicineCard {
    name: String!
    quantity: Int!
    time_interval: Int!
  }

  input ProfessionalCardInput {
    name: String!
    job: String!
    phone_number: String!
  }

  type ProfessionalCard {
    name: String!
    job: String!
    phone_number: String!
  }

  input ExerciseCardInput {
    name: String!
    minutes: Int!
  }

  type ExerciseCard {
    name: String!
    minutes: Int!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    height: Int
    weight: Int
    address: String
    emergency_card: [EmergencyCard!]
    bpm_card: [BpmCard!]
    communication_card: [CommunicationCard!]
    event_card: [EventCard!]
    medicine_card: [MedicineCard!]
    professional_card: [ProfessionalCard!]
    exercise_card: [ExerciseCard!]
  }

  input UserGoogle {
    uid: ID!
    displayName: String!
    email: String!
  }

  type UserGoogleType {
    uid: ID!
    displayName: String!
    email: String!
  }

  input CreateColumnValue {
    user_id: ID!
    column_name: String!
    item: CardInput!
  }

  input CardInput {
    emergency_card: EmergencyCardInput
    bpm_card: BpmCardInput
    communication_card: CommunicationCardInput
    event_card: EventCardInput
    medicine_card: MedicineCardInput
    professional_card: ProfessionalCardInput
    exercise_card: ExerciseCardInput
  }

  type Query {
    user(userToken: String!): User!
    authenticate(user: UserGoogle!): String!
  }

  type Mutation {
    createColumnValue(value: CreateColumnValue): CreateResponse!
  }
`;
