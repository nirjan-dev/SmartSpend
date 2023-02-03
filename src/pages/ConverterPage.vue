<template>
  <div>
    <h1 class="text-h5">Convert between money and time</h1>

    <q-form class="col-6">
      <q-input
        v-model="amount"
        label="Amount"
        type="number"
        filled
        name="amount"
        class="q-mb-md"
        @update:model-value="onAmountUpdate"
      />

      <q-input
        v-model="time"
        label="Total Time"
        type="text"
        filled
        name="time"
        class="q-mb-md"
        readonly
      />

      <!-- <q-input
        v-model="hours"
        label="Hours"
        type="number"
        filled
        name="hours"
        class="q-mb-md"
        @update:model-value="onTimeUpdate"
      />

      <q-input
        v-model="days"
        label="Days"
        type="number"
        filled
        name="days"
        class="q-mb-md"
        @update:model-value="onTimeUpdate"
      />

      <q-input
        v-model="weeks"
        label="Weeks"
        type="number"
        filled
        name="weeks"
        class="q-mb-md"
        @update:model-value="onTimeUpdate"
      />

      <q-input
        v-model="months"
        label="Months"
        type="number"
        filled
        name="months"
        class="q-mb-md"
        @update:model-value="onTimeUpdate"
      />

      <q-input
        v-model="years"
        label="Years"
        type="number"
        filled
        name="years"
        class="q-mb-md"
        @update:model-value="onTimeUpdate"
      /> -->
    </q-form>
  </div>
</template>

<script setup lang="ts">
import { getAmountFromTime, getTimeFromAmount } from 'src/api/expenseService';
import { ref } from 'vue';

const amount = ref(0);
const time = ref('');
const hours = ref(0);
const days = ref(0);
const weeks = ref(0);
const months = ref(0);
const years = ref(0);

const getTimeObjectFromTotalTime = (totalTime: string) => {
  const years = Number(totalTime.split('years')[0]);
  const months = Number(totalTime.split('months')[0].split('years')[1]);
  const weeks = Number(totalTime.split('weeks')[0].split('months')[1]);
  const days = Number(totalTime.split('days')[0].split('weeks')[1]);
  const hours = Number(totalTime.split('hours')[0].split('days')[1]);

  return {
    years,
    months,
    weeks,
    days,
    hours,
  };
};

const onAmountUpdate = (value: number) => {
  const totalTime = getTimeFromAmount(Number(value)) ?? '0';

  const timeSections = getTimeObjectFromTotalTime(totalTime);

  time.value = totalTime;
  hours.value = timeSections.hours;
  days.value = timeSections.days;
  weeks.value = timeSections.weeks;
  months.value = timeSections.months;
  years.value = timeSections.years;
};

const onTimeUpdate = () => {
  const totalTimeInHours =
    hours.value +
    days.value * 24 +
    weeks.value * 24 * 7 +
    months.value * 24 * 7 * 4 +
    years.value * 24 * 7 * 4 * 12;

  amount.value = getAmountFromTime(totalTimeInHours) || 0;
};
</script>

<style scoped></style>
