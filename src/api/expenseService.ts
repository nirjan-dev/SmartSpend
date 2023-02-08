import { Preferences } from '@capacitor/preferences';
import { getSalaryDetails } from 'src/api/SalaryService';
import { PlannedExpense } from 'src/types/expenses';
import { SalaryDetails } from 'src/types/salary';

export const getPlannedExpenses = async () => {
  let plannedExpenses: PlannedExpense[] = [];

  const plannedExpensesFromStorage = await Preferences.get({
    key: 'SmartSpendPlannedExpenses',
  });

  if (plannedExpensesFromStorage.value) {
    plannedExpenses = JSON.parse(plannedExpensesFromStorage.value);
  }

  return plannedExpenses;
};

export const addPlannedExpense = async (
  expense: Omit<PlannedExpense, 'id'>
) => {
  const plannedExpenses = await getPlannedExpenses();

  const expenseWithId = {
    ...expense,
    id: crypto.randomUUID(),
  };

  plannedExpenses.push(expenseWithId);

  await Preferences.set({
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

  await Preferences.set({
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

  await Preferences.set({
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
    timeWithSeparators += `${years.toFixed(2)} years `;
  }

  if (months) {
    timeWithSeparators += `${months.toFixed(2)} months `;
  }

  if (weeks) {
    timeWithSeparators += `${weeks.toFixed(2)} weeks `;
  }

  if (days) {
    timeWithSeparators += `${days.toFixed(2)} days `;
  }

  if (hoursLeft) {
    timeWithSeparators += `${hoursLeft.toFixed(2)} hours `;
  }

  return timeWithSeparators;
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
