<template>
  <v-container>
    <Condition v-model="rules[0].condition" />
    <div>
      {{rules[0].condition}}
    </div>
  </v-container>
</template>
<script>
import Condition from '@/components/rules/Condition.vue';

export default {
  name: 'Rules',
  components: {
    Condition,
  },
  data() {
    return {
      rules: [
        {
          condition: {
            paymentMethod: 'DEBIT',
          },
        },
        {
          condition: {
            $and: [
              {
                header: ['markt', true],
              },
              {
                amount: ['<', 10],
              },
              {
                currency: 'EUR',
              },
              {
                $or: [
                  {
                    date: ['weekday', '==', 6],
                  },
                  {
                    date: ['weekday', '==', 7],
                  },
                ],
              },
              {
                $not: {
                  paymentMethod: 'DEBIT',
                },
              },
              {
                time: ['after', '16:00'],
              },
            ],
          },
          tags: ['tag'],
        },
      ],
    };
  },
};
</script>
