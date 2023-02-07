<template>
  <q-page class="q-px-md">
    <!-- Title -->
    <h1 class="text-h5">Planned expenses</h1>

    <!-- List of planned expenses -->
    <q-list class="q-mt-md" separator>
      <q-item
        v-for="plannedExpense in plannedExpenses"
        :key="plannedExpense.id"
        class="q-mb-md border-bottom"
      >
        <q-item-section class="q-py-md">
          <q-item-label class="text-h6 q-mb-sm">{{
            plannedExpense.name
          }}</q-item-label>
          <q-item-label class="text-negative text-bold">
            {{ plannedExpense.amount }} -
            {{ expenseToTime(plannedExpense.amount) }}
          </q-item-label>

          <q-item-label caption class="q-mb-sm">
            <a :href="plannedExpense.link" target="_blank">
              {{ plannedExpense.link }}
            </a>
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn
            round
            color="primary"
            icon="edit"
            @click="onEditPlannedExpenseClick(plannedExpense)"
            class="q-mb-md"
          />

          <q-btn
            round
            color="negative"
            icon="delete"
            @click="deleteExpense(plannedExpense)"
          />
        </q-item-section>
      </q-item>
    </q-list>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn
        fab
        icon="add"
        color="accent"
        @click="onNewPlannedExpenseClick()"
      />
    </q-page-sticky>
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
import { useQuasar } from 'quasar';
import NewPlannedExpenseDialog from 'components/NewPlannedExpenseDialog.vue';

const plannedExpenses: Ref<PlannedExpense[]> = ref([]);
const $q = useQuasar();

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

const deleteExpense = (plannedExpense: PlannedExpense) => {
  const updatedPlannedExpenses = removePlannedExpense(plannedExpense);

  if (!updatedPlannedExpenses) {
    alert('Error deleting expense');
    return;
  }

  plannedExpenses.value = updatedPlannedExpenses;
};

const onNewPlannedExpenseClick = () => {
  $q.dialog({
    title: 'New Planned Expense',
    message: 'Enter the details of the planned expense',
    component: NewPlannedExpenseDialog,
    cancel: true,
    persistent: true,
  }).onOk(
    (data: { expenseName: string; expenseAmount: number; link: string }) => {
      console.log(data);

      const plannedExpense = {
        name: data.expenseName,
        amount: data.expenseAmount,
        link: data.link,
      };

      const newPlannedExpense = addPlannedExpense(plannedExpense);

      if (!newPlannedExpense) {
        alert('Error adding expense');
        return;
      }

      plannedExpenses.value.push(newPlannedExpense);

      alert('Expense added successfully');
    }
  );
};
</script>
