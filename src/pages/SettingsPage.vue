<template>
  <q-page>
    <!-- Title -->
    <h1 class="text-h5 q-my-lg text-weight-regular" style="opacity: 0.6">
      Save your monthly salary
    </h1>

    <!-- Form to enter salary -->
    <q-form>
      <q-input
        v-model="salary"
        label="Salary per month"
        type="number"
        filled
        class="q-mb-md"
      />

      <q-input
        v-model="currency"
        label="Currency"
        type="text"
        filled
        class="q-mb-md"
      />

      <q-input
        v-model="workHours"
        label="Working hours per week"
        type="number"
        filled
        class="q-mb-md"
      />

      <q-input
        v-model="workDays"
        label="Working days per week"
        type="number"
        filled
        class="q-mb-md"
      />

      <q-input
        v-model="workWeeks"
        label="Working weeks per month"
        type="number"
        filled
        class="q-mb-md"
      />

      <q-btn
        label="Save"
        type="submit"
        color="primary"
        class="q-mb-md"
        @click="submitSalary"
      />
    </q-form>
    <!-- Form to enter expenses -->
  </q-page>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { getSalaryDetails, saveSalaryDetails } from 'src/api/SalaryService';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

let salary = ref(0);
let workHours = ref(40);
let workWeeks = ref(4);
let workDays = ref(5);
let currency = ref('USD');

const $q = useQuasar();
const router = useRouter();

onMounted(async () => {
  const salaryDetails = await getSalaryDetails();

  console.log('Salary Dettails page');

  if (salaryDetails) {
    salary.value = salaryDetails.salary;
    workHours.value = salaryDetails.workHours;
    workWeeks.value = salaryDetails.workWeeks;
  }
});

const submitSalary = async (e: Event) => {
  e.preventDefault();

  if (!salary.value || !workHours.value || !workWeeks.value) {
    $q.notify({
      message: 'Please enter all the details',
      color: 'negative',
      position: 'top',
    });
    return;
  }

  const updatedSalary = await saveSalaryDetails({
    salary: salary.value,
    workHours: workHours.value,
    workWeeks: workWeeks.value,
    workDays: workDays.value,
    currency: currency.value,
  });

  if (updatedSalary) {
    $q.notify({
      message: 'Salary details saved',
      color: 'positive',
      position: 'top',
    });
    router.push('/');
  } else {
    $q.notify({
      message: 'Error saving salary details',
      color: 'negative',
      position: 'top',
    });
  }
};
</script>
