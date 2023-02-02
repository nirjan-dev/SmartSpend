import { SalaryDetails } from 'src/types/salary';

export const getSalaryDetails = () => {
  let salaryDetails: SalaryDetails;

  const salaryDetailsFromStorage = localStorage.getItem(
    'SmartSpendSalaryDetails'
  );

  if (salaryDetailsFromStorage) {
    salaryDetails = JSON.parse(salaryDetailsFromStorage);

    return salaryDetails;
  }

  return null;
};

export const saveSalaryDetails = (salaryDetails: SalaryDetails) => {
  localStorage.setItem(
    'SmartSpendSalaryDetails',
    JSON.stringify(salaryDetails)
  );

  return salaryDetails;
};
