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
      dayOfWeek: {
        type: String;
        enum: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday'
        ];
      };
      start: {
        type: String;
      };
      end: {
        type: String;
      };
    }
  ];
  commission: {
    type: Number;
  };
  image: {
    type: String;
  };
}
