export class EmployeeModel {
  _id?: string;
  __v?: number;
  specialty: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  workingHours: [
    {
      // dayOfWeek: {
      //   type: String;
      //   enum: [
      //     'Monday',
      //     'Tuesday',
      //     'Wednesday',
      //     'Thursday',
      //     'Friday',
      //     'Saturday',
      //     'Sunday'
      //   ];
      // };
      dayOfWeek: string;
      // start: {
      //   type: String;
      // };
      // end: {
      //   type: String;
      // };
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
