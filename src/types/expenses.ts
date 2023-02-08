export type PlannedExpense = {
  name: string;
  amount: number;
  link?: string;
  id: string;
};

export type PlannedExpenseWithoutId = Omit<PlannedExpense, 'id'>;

export type PlannedExpenseWithTime = PlannedExpense & { time: string };
