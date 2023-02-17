<template>
  <q-page>
    <!-- Title -->
    <h1 class="text-h5 q-my-lg text-weight-regular" style="opacity: 0.6">
      Planned expenses
    </h1>

    <!-- sorting controls -->
    <q-item-label class="q-mt-md">
      <q-select
        v-model="sortBy"
        :options="sortByOptions"
        label="Sort by"
        filled
        behavior="menu"
        dense
      />
    </q-item-label>

    <q-item-label class="q-mt-md">
      <q-select
        v-model="sortOrder"
        :options="sortOrderOptions"
        label="Sort order"
        filled
        behavior="menu"
        dense
      />
    </q-item-label>

    <!-- List of planned expenses -->
    <q-list
      class="q-mt-md"
      separator
      v-if="sortedPlannedExpenses && sortedPlannedExpenses.length > 0"
    >
      <q-item
        v-for="plannedExpense in sortedPlannedExpenses"
        :key="plannedExpense.id"
        class="q-mb-md border-bottom q-px-sm"
        dense
      >
        <q-item-section class="q-py-md">
          <q-item-label class="flex items-center">
            <span class="text-capitalize text-h6 q-mr-sm">
              {{ plannedExpense.name }}
            </span>
            <a
              v-if="plannedExpense.link"
              class="text-caption"
              style="text-decoration: none"
              :href="plannedExpense.link"
              target="_blank"
            >
              <q-icon name="link" size="xs" />
              {{ plannedExpense.link }}
            </a>
          </q-item-label>

          <q-item-label caption class="q-mb-sm">
            {{ getFormmattedDate(plannedExpense.dateAdded) }}
          </q-item-label>

          <q-item-label class="text-bold q-mb-md">
            {{ plannedExpense.amount }} {{ salaryDetails.currency }} :
            {{ expenseToTime(plannedExpense.amount) }}
          </q-item-label>

          <q-btn
            color="negative"
            icon="shopping_cart"
            outline
            label="Mark as bought"
            @click="onBoughtClick(plannedExpense)"
            class="text-capitalize q-mb-md"
          />

          <q-btn
            icon="delete"
            outline
            label="Archive"
            class="text-capitalize"
            @click="onArchiveClick(plannedExpense)"
          />
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

    <!-- Empty state -->
    <div v-else class="q-mt-md">
      <q-card class="bg-grey-2">
        <q-card-section class="row items-center">
          <!-- instructions -->
          <div class="q-mt-md">
            <p>
              To add a new planned expense, click the button in the bottom right
              corner.
            </p>

            <p>
              Once, you add an expense try to keep it in here without buying it
              for at least a week so you can be sure that you really need it.
            </p>

            <p>
              If you buy an expense, click the "Bought" button. This will remove
              the expense from the list and move it to the History page. Once
              you have bought an item you can also rate it by going to it on the
              History page and editing it.
            </p>

            <p>
              If you don't buy an expense, click the "Archive" button. This will
              remove the expense from the list and also move it to the History
              page.
            </p>

            <p>
              After creating a planned expense, You can also edit an expense by
              clicking the "Edit" button next to it.
            </p>

            <p>
              You can also delete an expense by clicking the "Delete" button
              next to it. This won't move it to the History page.
            </p>
          </div>
        </q-card-section>
      </q-card>
    </div>

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
import { computed, onMounted, reactive, Ref, ref } from 'vue';
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
const sortByOptions = ['Date added', 'Amount'];
const sortBy = ref(sortByOptions[0]);

const sortOrderOptions = ['Ascending', 'Descending'];
const sortOrder = ref(sortOrderOptions[0]);

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

const sortedPlannedExpenses = computed(() => {
  if (sortBy.value === 'Date added') {
    // return a sorted plannedExpenses array without mutating the original array and based on the sortOrder

    const sortedPlannedExpenses = [...plannedExpenses.value].sort(
      (a, b) =>
        new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime()
    );

    if (sortOrder.value === 'Descending') {
      sortedPlannedExpenses.reverse();
    }

    return sortedPlannedExpenses;
  }

  if (sortBy.value === 'Amount') {
    const sortedPlannedExpenses = [...plannedExpenses.value].sort(
      (a, b) => b.amount - a.amount
    );

    if (sortOrder.value === 'Ascending') {
      sortedPlannedExpenses.reverse();
    }

    return sortedPlannedExpenses;
  }

  return plannedExpenses.value;
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
  console.log('clickkkk');
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

      console.log('adding planned expense', plannedExpense);
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
