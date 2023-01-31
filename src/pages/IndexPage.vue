<template>
  <q-page class="row items-center justify-evenly">
    <!-- Title -->
    <h1 class="text-h5">Please Enter your monthly salary</h1>

    <!-- Form to enter salary -->
    <q-form class="col-6">
      <q-input
        v-model="salary"
        label="Salary"
        type="number"
        filled
        class="q-mb-md"
      />

      <q-input
        v-model="hours"
        label="Working hours per week"
        type="number"
        filled
        class="q-mb-md"
      />

      <q-input
        v-model="days"
        label="Working days per week"
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
import { ref } from 'vue';

const salary = ref(0);
const hours = ref(40);
const days = ref(5);

const submitSalary = () => {
  alert(
    `Your salary is ${salary.value} and you work ${hours.value} hours per week and ${days.value} days per week`
  );
};
</script>
