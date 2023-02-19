import { SalaryDetails } from 'src/types/salary';
import { Preferences } from '@capacitor/preferences';

export const getSalaryDetails = async () => {
  let salaryDetails: SalaryDetails;

  const salaryDetailsFromPreferences = await Preferences.get({
    key: 'SmartSpendSalaryDetails',
  });

  if (salaryDetailsFromPreferences.value) {
    salaryDetails = JSON.parse(salaryDetailsFromPreferences.value);

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
