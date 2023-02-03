<template>
  <q-page class="row items-center justify-evenly">
    <!-- Title -->
    <h1 class="text-h5">Please Enter your monthly salary</h1>

    <!-- Form to enter salary -->
    <q-form class="col-6">
      <q-input
        v-model="salary"
        label="Salary per month"
        type="number"
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
        label="Submit"
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
import { getSalaryDetails, saveSalaryDetails } from 'src/api/SalaryService';
import { onMounted, ref } from 'vue';

let salary = ref(0);
let workHours = ref(40);
let workWeeks = ref(4);
let workDays = ref(5);

onMounted(() => {
  const salaryDetails = getSalaryDetails();

  if (salaryDetails) {
    salary.value = salaryDetails.salary;
    workHours.value = salaryDetails.workHours;
    workWeeks.value = salaryDetails.workWeeks;
  }
});

const submitSalary = (e: Event) => {
  e.preventDefault();

  if (!salary.value || !workHours.value || !workWeeks.value) {
    alert('Please enter all the details');
    return;
  }

  const updatedSalary = saveSalaryDetails({
    salary: salary.value,
    workHours: workHours.value,
    workWeeks: workWeeks.value,
    workDays: workDays.value,
  });

  if (updatedSalary) {
    alert('Salary details saved successfully');
  } else {
    alert('Error saving salary details');
  }
};
</script>
