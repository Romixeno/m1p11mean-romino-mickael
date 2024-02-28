import { EmployeeModel } from './employee.model';
import { ServiceModel } from './service.model';

export class PreferencesModel {
  favoriteService: string[];
  favoriteEmployee: string[];
}

export class PreferencesModelPopulated {
  favoriteService: ServiceModel[];
  favoriteEmployee: EmployeeModel[];
}
