export class ClientModel {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  image?: string;
  appointments: string[];
  preferences: string[];
  specialOffersNotification: string;
  userType: string;
}
