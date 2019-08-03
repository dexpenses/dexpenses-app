export const fields = {
  header: { icon: 'title', displayName: 'Header' },
  amount: { icon: 'attach_money', displayName: 'Amount' },
  currency: { icon: 'attach_money', displayName: 'Currency' },
  date: { icon: 'date_range', displayName: 'Date' },
  time: { icon: 'access_time', displayName: 'Time' },
  paymentMethod: { icon: 'money', displayName: 'Payment Method' },
  placeType: { icon: 'place', displayName: 'Place Type' },
  placeTypeCategory: { icon: 'place', displayName: 'Place Type Category' },
};
export const paymentMethodIcons = {
  DEBIT: 'credit_card',
  CREDIT: 'credit_card',
  CASH: 'money',
};

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
