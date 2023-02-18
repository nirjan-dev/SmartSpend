<template>
  <q-page>
    <!-- Title -->
    <h1 class="text-h5 q-my-lg text-weight-regular" style="opacity: 0.6">
      History
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

    <q-tabs
      v-model="tab"
      dense
      class="text-grey q-mt-md"
      active-color="primary"
      indicator-color="primary"
      align="justify"
      narrow-indicator
    >
      <q-tab name="bought" class="text-capitalize" label="Bought" />
      <q-tab name="archived" label="Archived" class="text-capitalize" />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="bought" class="q-px-xs">
        <!-- List of planned expenses -->
        <q-list class="q-mt-md" separator>
          <q-item
            v-for="plannedExpense in sortedBoughtPlannedExpenses"
            :key="plannedExpense.id"
            class="q-mb-md border-bottom q-px-sm"
            dense
          >
            <q-item-section class="q-py-md">
              <q-item-label class="flex items-center"
                ><span class="text-capitalize text-h6 q-mr-sm">
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

              <q-item-label>
                <q-rating
                  v-model="plannedExpense.rating"
                  readonly
                  color="primary"
                />
              </q-item-label>

              <q-item-label caption class="q-mb-sm">
                {{ getFormmattedDate(plannedExpense.datePurchased) }}
              </q-item-label>

              <q-item-label class="text-bold q-mb-sm">
                {{ plannedExpense.amount }} {{ salaryDetails.currency }} -
                {{ expenseToTime(plannedExpense.amount) }}
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn
                round
                icon="edit"
                @click="onEditPlannedExpenseClick(plannedExpense)"
                class="q-mb-md"
              />
              <q-btn
                round
                icon="delete"
                @click="deleteExpense(plannedExpense)"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </q-tab-panel>

      <q-tab-panel name="archived" class="q-px-xs">
        <!-- List of planned expenses -->
        <q-list class="q-mt-md" separator>
          <q-item
            v-for="plannedExpense in sortedArchivedPlannedExpenses"
            :key="plannedExpense.id"
            class="q-mb-md border-bottom"
          >
            <q-item-section class="q-py-md">
              <q-item-label class="flex items-center"
                ><span class="text-capitalize text-h6 q-mr-sm">
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
                {{ getFormmattedDate(plannedExpense.datePurchased) }}
              </q-item-label>

              <q-item-label class="text-bold q-mb-sm">
                {{ plannedExpense.amount }} {{ salaryDetails.currency }} -
                {{ expenseToTime(plannedExpense.amount) }}
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn
                round
                icon="edit"
                @click="onEditPlannedExpenseClick(plannedExpense)"
                class="q-mb-md"
              />
              <q-btn
                round
                icon="delete"
                @click="deleteExpense(plannedExpense)"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, Ref, ref } from 'vue';
import { useRouter } from 'vue-router';
import {
  getArchivedPlannedExpenses,
  getBoughtPlannedExpenses,
  getTimeFromAmount,
  removePlannedExpense,
  updatePlannedExpense,
} from 'src/api/plannedExpenseService';
import { getSalaryDetails } from 'src/api/SalaryService';
import { PlannedExpense } from 'src/types/PllannedExpense';
import { SalaryDetails } from 'src/types/salary';
import { useQuasar } from 'quasar';
import plannedExpenseDialog from 'src/components/plannedExpenseDialog.vue';

const $q = useQuasar();
const router = useRouter();
const boughtPlannedExpenses = ref<PlannedExpense[]>([]);
const archivedPlannedExpenses = ref<PlannedExpense[]>([]);
const tab: Ref<'bought' | 'archived'> = ref('bought');
const sortByOptions = ['Date added', 'Amount', 'Rating'];
const sortBy = ref(sortByOptions[0]);

const sortOrderOptions = ['Descending', 'Ascending'];
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

  boughtPlannedExpenses.value = await getBoughtPlannedExpenses();
  archivedPlannedExpenses.value = await getArchivedPlannedExpenses();
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

  boughtPlannedExpenses.value = await getBoughtPlannedExpenses();
  archivedPlannedExpenses.value = await getArchivedPlannedExpenses();

  $q.notify({
    message: 'Expense deleted successfully',
    color: 'positive',
    icon: 'done',
    position: 'top',
  });
};

const sortedBoughtPlannedExpenses = computed(() => {
  if (sortBy.value === 'Date added') {
    // return a sorted plannedExpenses array without mutating the original array and based on the sortOrder

    const sortedPlannedExpenses = [...boughtPlannedExpenses.value].sort(
      (a, b) =>
        new Date(a.datePurchased ?? a.dateAdded).getTime() -
        new Date(b.datePurchased ?? a.dateAdded).getTime()
    );

    if (sortOrder.value === 'Descending') {
      sortedPlannedExpenses.reverse();
    }

    return sortedPlannedExpenses;
  }

  if (sortBy.value === 'Amount') {
    const sortedPlannedExpenses = [...boughtPlannedExpenses.value].sort(
      (a, b) => b.amount - a.amount
    );

    if (sortOrder.value === 'Ascending') {
      sortedPlannedExpenses.reverse();
    }

    return sortedPlannedExpenses;
  }

  if (sortBy.value === 'Rating') {
    const sortedPlannedExpenses = [...boughtPlannedExpenses.value].sort(
      (a, b) => (b.rating ?? 0) - (a.rating ?? 0)
    );

    if (sortOrder.value === 'Ascending') {
      sortedPlannedExpenses.reverse();
    }

    return sortedPlannedExpenses;
  }

  return boughtPlannedExpenses.value;
});

const sortedArchivedPlannedExpenses = computed(() => {
  if (sortBy.value === 'Date added') {
    // return a sorted plannedExpenses array without mutating the original array and based on the sortOrder

    const sortedPlannedExpenses = [...archivedPlannedExpenses.value].sort(
      (a, b) =>
        new Date(a.dateArchived ?? a.dateAdded).getTime() -
        new Date(b.dateArchived ?? b.dateAdded).getTime()
    );

    if (sortOrder.value === 'Descending') {
      sortedPlannedExpenses.reverse();
    }

    return sortedPlannedExpenses;
  }

  if (sortBy.value === 'Amount') {
    const sortedPlannedExpenses = [...archivedPlannedExpenses.value].sort(
      (a, b) => b.amount - a.amount
    );

    if (sortOrder.value === 'Ascending') {
      sortedPlannedExpenses.reverse();
    }

    return sortedPlannedExpenses;
  }

  return archivedPlannedExpenses.value;
});

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
      rating?: number;
    }) => {
      console.log(data);

      const updatedPlannedExpense = {
        ...plannedExpense,
        name: data.expenseName,
        amount: data.expenseAmount,
        link: data.link,
        rating: data.rating,
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

      boughtPlannedExpenses.value = await getBoughtPlannedExpenses();
      archivedPlannedExpenses.value = await getArchivedPlannedExpenses();

      $q.notify({
        message: 'Expense updated successfully',
        color: 'positive',
        icon: 'done',
        position: 'top',
      });
    }
  );
};

const getFormmattedDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-Us', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
</script>
