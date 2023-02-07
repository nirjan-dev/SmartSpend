import { getSalaryDetails } from 'src/api/SalaryService';
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

export const getTimeFromAmount = (amount: number) => {
  const salaryDetails = getSalaryDetails();

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

export const getAmountFromTime = (time: number) => {
  const salaryDetails = getSalaryDetails();

  if (!salaryDetails) {
    return null;
  }

  const { salary, workHours, workWeeks } = salaryDetails;

  const salaryPerHour = salary / (workHours * workWeeks);

  const amountToPay = time * salaryPerHour;

  return amountToPay;
};
