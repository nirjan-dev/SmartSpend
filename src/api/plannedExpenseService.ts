import { getSalaryDetails } from 'src/api/SalaryService';
import { PlannedExpense } from 'src/types/PllannedExpense';
import { PlannedExpenseFromUser } from 'src/types/PllannedExpense';
import { SalaryDetails } from 'src/types/salary';
import { Storage } from '@capacitor/core';

export const getPlannedExpenses = async () => {
  let plannedExpenses: PlannedExpense[] = [];

  const plannedExpensesFromStorage = await Storage.get({
    key: 'SmartSpendPlannedExpenses',
  });

  if (plannedExpensesFromStorage.value) {
    plannedExpenses = JSON.parse(plannedExpensesFromStorage.value);
  }

  return plannedExpenses;
};

export const getActivePlannedExpenses = async () => {
  const plannedExpenses = await getPlannedExpenses();

  const activePlannedExpenses = plannedExpenses.filter(
    (expense) => !expense.dateArchived && !expense.datePurchased
  );

  return activePlannedExpenses;
};

export const getBoughtPlannedExpenses = async () => {
  const plannedExpenses = await getPlannedExpenses();

  const boughtPlannedExpenses = plannedExpenses.filter(
    (expense) => expense.datePurchased
  );

  return boughtPlannedExpenses;
};

export const getArchivedPlannedExpenses = async () => {
  const plannedExpenses = await getPlannedExpenses();

  const archivedPlannedExpenses = plannedExpenses.filter(
    (expense) => expense.dateArchived
  );

  return archivedPlannedExpenses;
};

export const addPlannedExpense = async (expense: PlannedExpenseFromUser) => {
  const plannedExpenses = await getPlannedExpenses();

  const expenseWithId = {
    ...expense,
    id: Math.random().toString(36).substr(2, 9),
    dateAdded: new Date().toISOString(),
  };

  plannedExpenses.push(expenseWithId);

  console.log('plannedExpenses', plannedExpenses);

  await Storage.set({
    key: 'SmartSpendPlannedExpenses',
    value: JSON.stringify(plannedExpenses),
  });

  return expenseWithId;
};

export const removePlannedExpense = async (expense: PlannedExpense) => {
  const plannedExpenses = await getPlannedExpenses();

  const filteredPlannedExpenses = plannedExpenses.filter(
    (expenseItem) => expenseItem.id !== expense.id
  );

  await Storage.set({
    key: 'SmartSpendPlannedExpenses',
    value: JSON.stringify(filteredPlannedExpenses),
  });

  return filteredPlannedExpenses;
};

export const updatePlannedExpense = async (expense: PlannedExpense) => {
  const plannedExpenses = await getPlannedExpenses();

  const updatedPlannedExpenses = plannedExpenses.map((expenseItem) => {
    if (expenseItem.id === expense.id) {
      return expense;
    }

    return expenseItem;
  });

  await Storage.set({
    key: 'SmartSpendPlannedExpenses',
    value: JSON.stringify(updatedPlannedExpenses),
  });

  return updatedPlannedExpenses;
};

export const getTimeFromAmount = (
  amount: number,
  salaryDetails: SalaryDetails
) => {
  if (!salaryDetails) {
    return null;
  }

  const hoursFromAmount = getHoursFromAmount(amount, salaryDetails);

  const timeWithSeparators = getTimeFromHours(hoursFromAmount, salaryDetails);

  return timeWithSeparators;
};

export const getHoursFromAmount = (
  amount: number,
  salaryDetails: SalaryDetails
) => {
  const { salary, workHours, workWeeks } = salaryDetails;

  const salaryPerHour = salary / (workHours * workWeeks);

  const hoursToPay = amount / salaryPerHour;

  return hoursToPay;
};

export const getTimeFromHours = (
  hours: number,
  salaryDetails: SalaryDetails
) => {
  const {
    workDays: workDaysPerWeek,
    workHours: workHoursPerWeek,
    workWeeks: numberOfWorkingWeeks,
  } = salaryDetails;

  const hoursPerDay = workHoursPerWeek / workDaysPerWeek; // 8
  const hoursPerWeek = workHoursPerWeek; // 40
  const hoursPerMonth = hoursPerWeek * numberOfWorkingWeeks; // 160
  const hoursPerYear = hoursPerMonth * 12; // 1920

  const years = Math.floor(hours / hoursPerYear);
  const months = Math.floor((hours - years * hoursPerYear) / hoursPerMonth);
  const weeks = Math.floor(
    (hours - years * hoursPerYear - months * hoursPerMonth) / hoursPerWeek
  );
  const days = Math.floor(
    (hours -
      years * hoursPerYear -
      months * hoursPerMonth -
      weeks * hoursPerWeek) /
      hoursPerDay
  );
  const hoursLeft =
    hours -
    years * hoursPerYear -
    months * hoursPerMonth -
    weeks * hoursPerWeek -
    days * hoursPerDay;

  let timeWithSeparators = '';

  if (years) {
    timeWithSeparators += `${getFormattedStringFromNumber(years, 'year')} `;
  }

  if (months) {
    timeWithSeparators += `${getFormattedStringFromNumber(months, 'month')} `;
  }

  if (weeks) {
    timeWithSeparators += `${getFormattedStringFromNumber(weeks, 'week')} `;
  }

  if (days) {
    timeWithSeparators += `${getFormattedStringFromNumber(days, 'day')} `;
  }

  if (hoursLeft) {
    timeWithSeparators += `${getFormattedStringFromNumber(hoursLeft, 'hour')}`;
  }

  return timeWithSeparators;
};

const getFormattedStringFromNumber = (number: number, timePeriod: string) => {
  const numberPart = number % 1 !== 0 ? number.toFixed(1) : number;

  let periodPart = timePeriod;
  if (number > 1) {
    periodPart = `${timePeriod}s`;
  }

  return `${numberPart} ${periodPart}`;
};

export const getAmountFromTime = (
  time: number,
  salaryDetails: SalaryDetails
) => {
  if (!salaryDetails) {
    return null;
  }

  const { salary, workHours, workWeeks } = salaryDetails;

  const salaryPerHour = salary / (workHours * workWeeks);

  const amountToPay = time * salaryPerHour;

  return amountToPay;
};

export const markPlannedExpenseAsBought = async (
  plannedExpense: PlannedExpense
) => {
  plannedExpense.datePurchased = new Date().toISOString();

  const updatedPlannedExpenses = await updatePlannedExpense(plannedExpense);

  if (!updatedPlannedExpenses) {
    return null;
  }

  const activePlannedExpenses = await getActivePlannedExpenses();

  return activePlannedExpenses;
};

export const markPlannedExpenseAsArchived = async (
  plannedExpense: PlannedExpense
) => {
  plannedExpense.dateArchived = new Date().toISOString();

  const updatedPlannedExpenses = await updatePlannedExpense(plannedExpense);

  if (!updatedPlannedExpenses) {
    return null;
  }

  const activePlannedExpenses = await getActivePlannedExpenses();

  return activePlannedExpenses;
};
