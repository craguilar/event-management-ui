/**
 * Main Event object .
 * @export
 * @interface Event
 */
export interface ExpenseCategory {
  id?: string;
  category: string;
  amountProjected?: number;
  amountPaid?: number;
  amountTotal?: number;
  expenses?: (Expense | undefined)[];
}

export interface Expense {
  id?: string;
  whoPaid: string;
  timePaidOn: string;
  amountPaid: number;
}

export interface ExpensesSummary {
  projectedTotal: number;
  paidTotal: number;
  actualTotal: number;
}
