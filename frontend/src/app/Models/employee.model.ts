export class EmployeeModel {
  __v: string;
  _id: string;
  specialty: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  workingHours: [
    {
      dayOfWeek: string;
      start: string;
      end: string;
    }
  ];
  commission: {
    type: Number;
  };
  image: {
    type: String;
  };
  userType: {
    type: string;
  };
}
