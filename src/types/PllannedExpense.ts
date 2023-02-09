export type PlannedExpense = {
  name: string;
  amount: number;
  link?: string;
  id: string;
  dateAdded: string;
  datePurchased?: string;
  dateArchived?: string;
};

export type PlannedExpenseWithoutId = Omit<PlannedExpense, 'id'>;

export type PlannedExpenseFromUser = Omit<PlannedExpense, 'id' | 'dateAdded'>;

export type PlannedExpenseWithTime = PlannedExpense & { time: string };
