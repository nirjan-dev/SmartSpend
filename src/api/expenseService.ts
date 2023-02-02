import { PlannedExpense } from 'src/types/expenses';
import { SalaryDetails } from 'src/types/salary';

export const getPlannedExpenses = () => {
  let plannedExpenses: PlannedExpense[] = [];

  const plannedExpensesFromStorage = localStorage.getItem(
    'SmartSpendPlannedExpenses'
  );

  if (plannedExpensesFromStorage) {
    plannedExpenses = JSON.parse(plannedExpensesFromStorage);
  }

  return plannedExpenses;
};

export const addPlannedExpense = (expense: Omit<PlannedExpense, 'id'>) => {
  const plannedExpenses = getPlannedExpenses();

  const expenseWithId = {
    ...expense,
    id: crypto.randomUUID(),
  };

  plannedExpenses.push(expenseWithId);

  localStorage.setItem(
    'SmartSpendPlannedExpenses',
    JSON.stringify(plannedExpenses)
  );

  return expenseWithId;
};

export const removePlannedExpense = (expense: PlannedExpense) => {
  const plannedExpenses = getPlannedExpenses();

  const filteredPlannedExpenses = plannedExpenses.filter(
    (expenseItem) => expenseItem.id !== expense.id
  );

  localStorage.setItem(
    'SmartSpendPlannedExpenses',
    JSON.stringify(filteredPlannedExpenses)
  );

  return filteredPlannedExpenses;
};

export const updatePlannedExpense = (expense: PlannedExpense) => {
  const plannedExpenses = getPlannedExpenses();

  const updatedPlannedExpenses = plannedExpenses.map((expenseItem) => {
    if (expenseItem.id === expense.id) {
      return expense;
    }

    return expenseItem;
  });

  localStorage.setItem(
    'SmartSpendPlannedExpenses',
    JSON.stringify(updatedPlannedExpenses)
  );

  return updatedPlannedExpenses;
};

export const getTimeFromExpense = (
  expense: PlannedExpense,
  salaryDetails: SalaryDetails
) => {
  const { salary, workHours, workDays } = salaryDetails;
  const { amount } = expense;

  const workHoursPerMonth = workHours * workDays;
  const workHoursPerYear = workHoursPerMonth * 12;

  const salaryPerHour = salary / workHoursPerYear;

  const timeToPay = amount / salaryPerHour;

  return getFormattedTime(timeToPay);
};

export const getFormattedTime = (time: number) => {
  // return time in the biggest to smallest units (hours, days, months, years)

  const years = Math.floor(time / 8760);
  const months = Math.floor((time % 8760) / 730);
  const days = Math.floor(((time % 8760) % 730) / 24);
  const hours = Math.floor((((time % 8760) % 730) % 24) / 1);

  let finalString = '';

  if (years > 0) {
    finalString += `${years} years `;
  }

  if (months > 0) {
    finalString += `${months} months `;
  }

  if (days > 0) {
    finalString += `${days} days `;
  }

  if (hours > 0) {
    finalString += `${hours} hours `;
  }

  return finalString;
};
