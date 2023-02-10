<template>
  <q-page>
    <!-- Title -->
    <h1 class="text-h5 text-center">Planned expenses</h1>

    <!-- List of planned expenses -->
    <q-list class="q-mt-md" separator>
      <q-item
        v-for="plannedExpense in plannedExpenses"
        :key="plannedExpense.id"
        class="q-mb-md border-bottom"
      >
        <q-item-section class="q-py-md">
          <q-item-label class="text-h6 q-mb-sm"
            >{{ plannedExpense.name }}
            <a class="text-caption" :href="plannedExpense.link" target="_blank">
              <q-icon name="link" size="xs" class="q-ml-md" />
              {{ plannedExpense.link }}
            </a>
          </q-item-label>

          <q-item-label caption class="q-mb-sm">
            {{ getFormmattedDate(plannedExpense.dateAdded) }}
          </q-item-label>

          <q-item-label class="text-negative text-bold q-mb-sm">
            {{ plannedExpense.amount }} {{ salaryDetails.currency }} -
            {{ expenseToTime(plannedExpense.amount) }}
          </q-item-label>

          <q-item-label class="q-mt-lg">
            <q-btn
              color="negative"
              icon="shopping_cart"
              outline
              label="Bought"
              @click="onBoughtClick(plannedExpense)"
              class="q-mr-sm"
            />

            <q-btn
              icon="delete"
              outline
              label="Archive"
              @click="onArchiveClick(plannedExpense)"
            />
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn
            round
            icon="edit"
            @click="onEditPlannedExpenseClick(plannedExpense)"
            class="q-mb-md"
          />

          <q-btn round icon="delete" @click="deleteExpense(plannedExpense)" />
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
  getActivePlannedExpenses,
  getPlannedExpenses,
  getTimeFromAmount,
  markPlannedExpenseAsArchived,
  markPlannedExpenseAsBought,
  removePlannedExpense,
  updatePlannedExpense,
} from 'src/api/plannedExpenseService';
import { getSalaryDetails } from 'src/api/SalaryService';
import {
  PlannedExpense,
  PlannedExpenseFromUser,
} from 'src/types/PllannedExpense';
import { SalaryDetails } from 'src/types/salary';
import { useQuasar } from 'quasar';
import plannedExpenseDialog from 'src/components/plannedExpenseDialog.vue';

const plannedExpenses: Ref<PlannedExpense[]> = ref([]);
const $q = useQuasar();
const router = useRouter();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let salaryDetails: SalaryDetails;

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
  plannedExpenses.value = await getActivePlannedExpenses();
});

const expenseToTime = (amount: number) => {
  const time = getTimeFromAmount(amount, salaryDetails);
  return time;
};

const deleteExpense = async (plannedExpense: PlannedExpense) => {
  const updatedPlannedExpenses = await removePlannedExpense(plannedExpense);

  if (!updatedPlannedExpenses) {
    $q.notify({
      message: 'Error deleting expense',
      color: 'negative',
      icon: 'error',
      position: 'top',
    });
    return;
  }

  plannedExpenses.value = updatedPlannedExpenses;

  $q.notify({
    message: 'Expense deleted successfully',
    color: 'positive',
    icon: 'done',
    position: 'top',
  });
};

const getFormmattedDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-Us', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const onNewPlannedExpenseClick = () => {
  $q.dialog({
    component: plannedExpenseDialog,
    componentProps: {
      mode: 'add',
    },
  }).onOk(
    async (data: {
      expenseName: string;
      expenseAmount: number;
      link: string;
    }) => {
      const plannedExpense = {
        name: data.expenseName,
        amount: data.expenseAmount,
        link: data.link,
      };

      const newPlannedExpense = await addPlannedExpense(plannedExpense);

      if (!newPlannedExpense) {
        $q.notify({
          message: 'Error adding expense',
          color: 'negative',
          icon: 'error',
          position: 'top',
        });
        return;
      }

      plannedExpenses.value.push(newPlannedExpense);

      $q.notify({
        message: 'Expense added successfully',
        color: 'positive',
        icon: 'done',
        position: 'top',
      });
    }
  );
};

const onEditPlannedExpenseClick = (plannedExpense: PlannedExpense) => {
  // edit the planned expense using the plannedExpense Dialog

  $q.dialog({
    component: plannedExpenseDialog,
    componentProps: {
      ...plannedExpense,
      mode: 'edit',
    },
  }).onOk(
    async (data: {
      expenseName: string;
      expenseAmount: number;
      link: string;
    }) => {
      console.log(data);

      const updatedPlannedExpense = {
        ...plannedExpense,
        name: data.expenseName,
        amount: data.expenseAmount,
        link: data.link,
      };

      const updatedPlannedExpenses = await updatePlannedExpense(
        updatedPlannedExpense
      );

      if (!updatedPlannedExpenses) {
        $q.notify({
          message: 'Error updating expense',
          color: 'negative',
          icon: 'error',
          position: 'top',
        });
        return;
      }

      plannedExpenses.value = updatedPlannedExpenses;

      $q.notify({
        message: 'Expense updated successfully',
        color: 'positive',
        icon: 'done',
        position: 'top',
      });
    }
  );
};

const onBoughtClick = async (plannedExpense: PlannedExpense) => {
  const updatedPlannedExpenses = await markPlannedExpenseAsBought(
    plannedExpense
  );

  if (!updatedPlannedExpenses) {
    $q.notify({
      message: 'Error updating expense',
      color: 'negative',
      icon: 'error',
      position: 'top',
    });
    return;
  }

  plannedExpenses.value = updatedPlannedExpenses;

  $q.notify({
    message: 'Marked Expense as bought',
    color: 'positive',
    icon: 'done',
    position: 'top',
  });
};

const onArchiveClick = async (plannedExpense: PlannedExpense) => {
  const updatedPlannedExpenses = await markPlannedExpenseAsArchived(
    plannedExpense
  );

  if (!updatedPlannedExpenses) {
    $q.notify({
      message: 'Error updating expense',
      color: 'negative',
      icon: 'error',
      position: 'top',
    });
    return;
  }

  plannedExpenses.value = updatedPlannedExpenses;

  $q.notify({
    message: 'Archived Expense',
    color: 'positive',
    icon: 'done',
    position: 'top',
  });
};
</script>
