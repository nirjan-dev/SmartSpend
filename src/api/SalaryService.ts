import { Preferences } from '@capacitor/preferences';
import { SalaryDetails } from 'src/types/salary';

export const getSalaryDetails = async () => {
  let salaryDetails: SalaryDetails;

  const salaryDetailsFromStorage = await Preferences.get({
    key: 'SmartSpendSalaryDetails',
  });

  if (salaryDetailsFromStorage.value) {
    salaryDetails = JSON.parse(salaryDetailsFromStorage.value);

    return salaryDetails;
  }

  return null;
};

export const saveSalaryDetails = async (salaryDetails: SalaryDetails) => {
  await Preferences.set({
    key: 'SmartSpendSalaryDetails',
    value: JSON.stringify(salaryDetails),
  });

  return salaryDetails;
};
