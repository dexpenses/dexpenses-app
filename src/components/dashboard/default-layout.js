export default [
  {
    x: 0,
    y: 0,
    w: 3,
    h: 2,
    i: '0',
    component: 'Kpi',
    props: { title: 'Average monthly total', func: 'aggregateAverageTotal', format: {style:'currency',currency:'EUR'} },
  },
  {
    x: 3,
    y: 0,
    w: 3,
    h: 2,
    i: '1',
    component: 'Kpi',
    props: {
      title: 'Current month',
      func: 'aggregateTotal',
      data: {
        start: {
          $now: {
            set: { day: 1, hour: 0, minute: 0, second: 0, millisecond: 0 },
          },
        },
      },
      format: {
        style:'currency',currency:'EUR'
      }
    },
  },
  { x: 6, y: 0, w: 3, h: 2, i: '2', component: 'TagCloud', props: {format:{style:'currency',currency:'EUR'}} },
  {
    x: 9,
    y: 0,
    w: 3,
    h: 2,
    i: '3',
    component: 'DoughnutAggregation',
    props: { func: 'groupByPaymentMethod', format: {style:'currency',currency:'EUR'} },
  },
  {
    x: 0,
    y: 3,
    w: 6,
    h: 3,
    i: '6',
    component: 'ExpensesOverTime',
  },
  {
    x: 6,
    y: 3,
    w: 6,
    h: 3,
    i: '7',
    component: 'Map',
    props: { center: '$home' },
  },
];
