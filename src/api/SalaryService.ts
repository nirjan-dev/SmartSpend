import { SalaryDetails } from 'src/types/salary';
import { Storage } from '@capacitor/core';

export const getSalaryDetails = async () => {
  let salaryDetails: SalaryDetails;

  const salaryDetailsFromStorage = await Storage.get({
    key: 'SmartSpendSalaryDetails',
  });

  if (salaryDetailsFromStorage.value) {
    salaryDetails = JSON.parse(salaryDetailsFromStorage.value);

    return salaryDetails;
  }

  return null;
};

export const saveSalaryDetails = async (salaryDetails: SalaryDetails) => {
  await Storage.set({
    key: 'SmartSpendSalaryDetails',
    value: JSON.stringify(salaryDetails),
  });

  return salaryDetails;
};
