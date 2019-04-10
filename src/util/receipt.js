export const fields = {
  header: { icon: 'title', displayName: 'Header' },
  amount: { icon: 'attach_money', displayName: 'Amount' },
  currency: { icon: 'attach_money', displayName: 'Currency' },
  date: { icon: 'date_range', displayName: 'Date' },
  time: { icon: 'access_time', displayName: 'Time' },
  paymentMethod: { icon: 'money', displayName: 'Payment Method' },
};
export const paymentMethods = [
  { name: 'DEBIT', displayName: 'Debit Card', icon: 'credit_card' },
  { name: 'CREDIT', displayName: 'Credit Card', icon: 'credit_card' },
  { name: 'CASH', displayName: 'Cash', icon: 'money' },
  { name: 'PAYPAL', displayName: 'PayPal' },
];

export const currencies = ['EUR', 'USD', 'GBP'];

export const dateFields = [
  {
    name: 'weekday',
    displayName: 'Weekday',
  },
  {
    name: 'dayOfMonth',
    displayName: 'Day of Month',
  },
  {
    name: 'quarter',
    displayName: 'Quarter',
  },
  {
    name: 'weekYear',
    displayName: 'Week of Year',
  },
];

export const weekdays = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];
