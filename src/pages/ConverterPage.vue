<template>
  <div>
    <h1 class="text-h5 q-my-lg text-weight-regular" style="opacity: 0.6">
      Convert money and time
    </h1>

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

      <q-input
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
      />
    </q-form>
  </div>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import {
  getAmountFromTime,
  getTimeFromAmount,
} from 'src/api/plannedExpenseService';
import { getSalaryDetails } from 'src/api/SalaryService';
import { SalaryDetails } from 'src/types/salary';
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const amount = ref(0);
const time = ref('');
const hours = ref(0);
const days = ref(0);
const weeks = ref(0);
const months = ref(0);
const years = ref(0);
const $q = useQuasar();
const router = useRouter();
let salaryDetails: SalaryDetails = reactive({} as SalaryDetails);

onMounted(async () => {
  const storedSalaryDetails = await getSalaryDetails();
  if (!storedSalaryDetails) {
    $q.notify({
      message: 'Please enter your salary details',
      color: 'warning',
      icon: 'warning',
      position: 'top',
    });
    router.push('/settings');
    return;
  }

  salaryDetails = reactive(storedSalaryDetails);
});

const getTimeObjectFromTotalTime = (totalTime: string) => {
  // convert a string like 1 year 2 months 3 weeks 4 days 5 hours to an object

  const timePeriods = {
    year: 0,
    month: 0,
    week: 0,
    day: 0,
    hour: 0,
  };

  const regex = /(\d*\.?\d+)\s*(year|month|week|day|hour)s?/g;
  let match;

  while ((match = regex.exec(totalTime)) !== null) {
    const [_, value, period] = match;
    (timePeriods as any)[period] = parseFloat(value);
  }

  return timePeriods;
};

const onAmountUpdate = (value: number) => {
  const totalTime = getTimeFromAmount(Number(value), salaryDetails) ?? '0';

  const timeSections = getTimeObjectFromTotalTime(totalTime);

  time.value = totalTime;
  hours.value = timeSections.hour;
  days.value = timeSections.day;
  weeks.value = timeSections.week;
  months.value = timeSections.month;
  years.value = timeSections.year;
};

const onTimeUpdate = () => {
  amount.value =
    getAmountFromTime(
      {
        hours: Number(hours.value),
        days: Number(days.value),
        weeks: Number(weeks.value),
        months: Number(months.value),
        years: Number(years.value),
      },
      salaryDetails
    ) || 0;

  onAmountUpdate(amount.value);
};
</script>

<style scoped></style>
