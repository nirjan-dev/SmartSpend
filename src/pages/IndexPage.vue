<template>
  <q-page class="q-px-md">
    <!-- Title -->
    <h1 class="text-h5">Planned expenses</h1>

    <!-- Form to enter expenses -->
    <q-form>
      <q-input
        v-model="expenseName"
        label="Expense Name"
        type="text"
        filled
        class="q-mb-md"
      />

      <q-input
        v-model="expenseAmount"
        label="Expense Amount"
        type="number"
        filled
        class="q-mb-md"
      />

      <q-input v-model="link" label="Link" type="text" filled class="q-mb-md" />

      <q-btn
        label="Submit"
        type="submit"
        color="primary"
        class="q-mb-md"
        @click="submitExpense"
      />
    </q-form>

    <!-- List of planned expenses -->
    <q-list bordered class="q-mt-md">
      <q-item
        v-for="plannedExpense in plannedExpenses"
        :key="plannedExpense.id"
      >
        <q-item-section>
          <q-item-label>{{ plannedExpense.name }}</q-item-label>
          <q-item-label caption>
            {{ expenseToTime(plannedExpense.amount) }}
          </q-item-label>

          <q-item-label caption>
            <a :href="plannedExpense.link" target="_blank">
              {{ plannedExpense.link }}
            </a>
          </q-item-label>

          <q-item-label caption> {{ plannedExpense.amount }} </q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn
            round
            color="negative"
            icon="delete"
            @click="deleteExpense(plannedExpense)"
          />
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, reactive, Ref, ref } from 'vue';
import { useRouter } from 'vue-router';
import {
  addPlannedExpense,
  getPlannedExpenses,
  getTimeFromAmount,
  removePlannedExpense,
} from 'src/api/expenseService';
import { getSalaryDetails } from 'src/api/SalaryService';
import { PlannedExpense } from 'src/types/expenses';
import { SalaryDetails } from 'src/types/salary';

const expenseName = ref(null);
const expenseAmount = ref(null);
const link = ref(null);
const plannedExpenses: Ref<PlannedExpense[]> = ref([]);
let salaryDetails: SalaryDetails;

onMounted(() => {
  const storedSalaryDetails = getSalaryDetails();
  if (!storedSalaryDetails) {
    alert('Please enter your salary details first');
    useRouter().push('/settings');
    return;
  }

  salaryDetails = reactive(storedSalaryDetails);
  plannedExpenses.value = getPlannedExpenses();
});

const expenseToTime = (amount: number) => {
  const time = getTimeFromAmount(amount);
  return time;
};

const submitExpense = (e: Event) => {
  e.preventDefault();
  if (!expenseName.value || !expenseAmount.value || !link.value) {
    alert('Please enter all the details');
    return;
  }

  const plannedExpense = {
    name: expenseName.value,
    amount: expenseAmount.value,
    link: link.value,
  };

  const newPlannedExpense = addPlannedExpense(plannedExpense);

  if (!newPlannedExpense) {
    alert('Error adding expense');
    return;
  }

  plannedExpenses.value.push(newPlannedExpense);

  alert('Expense added successfully');
};

const deleteExpense = (plannedExpense: PlannedExpense) => {
  const updatedPlannedExpenses = removePlannedExpense(plannedExpense);

  if (!updatedPlannedExpenses) {
    alert('Error deleting expense');
    return;
  }

  plannedExpenses.value = updatedPlannedExpenses;
};
</script>
