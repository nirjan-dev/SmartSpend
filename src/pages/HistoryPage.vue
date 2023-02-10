<template>
  <q-page>
    <!-- Title -->
    <h1 class="text-h5 text-center">History</h1>

    <q-tabs
      v-model="tab"
      dense
      class="text-grey"
      active-color="primary"
      indicator-color="primary"
      align="justify"
      narrow-indicator
    >
      <q-tab name="bought" label="Bought" />
      <q-tab name="archived" label="Archived" />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="bought">
        <!-- List of planned expenses -->
        <q-list class="q-mt-md" separator>
          <q-item
            v-for="plannedExpense in boughtPlannedExpenses"
            :key="plannedExpense.id"
            class="q-mb-md border-bottom"
          >
            <q-item-section class="q-py-md">
              <q-item-label class="text-h6 q-mb-sm"
                >{{ plannedExpense.name }}
                <a
                  class="text-caption"
                  :href="plannedExpense.link"
                  target="_blank"
                >
                  <q-icon name="link" size="xs" class="q-ml-md" />
                  {{ plannedExpense.link }}
                </a>
              </q-item-label>

              <q-item-label caption class="q-mb-sm">
                {{ getFormmattedDate(plannedExpense.datePurchased) }}
              </q-item-label>

              <q-item-label class="text-negative text-bold q-mb-sm">
                {{ plannedExpense.amount }} {{ salaryDetails.currency }} -
                {{ expenseToTime(plannedExpense.amount) }}
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn
                round
                icon="delete"
                @click="deleteExpense(plannedExpense)"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </q-tab-panel>

      <q-tab-panel name="archived">
        <!-- List of planned expenses -->
        <q-list class="q-mt-md" separator>
          <q-item
            v-for="plannedExpense in archivedPlannedExpenses"
            :key="plannedExpense.id"
            class="q-mb-md border-bottom"
          >
            <q-item-section class="q-py-md">
              <q-item-label class="text-h6 q-mb-sm"
                >{{ plannedExpense.name }}
                <a
                  class="text-caption"
                  :href="plannedExpense.link"
                  target="_blank"
                >
                  <q-icon name="link" size="xs" class="q-ml-md" />
                  {{ plannedExpense.link }}
                </a>
              </q-item-label>

              <q-item-label caption class="q-mb-sm">
                {{ getFormmattedDate(plannedExpense.dateArchived) }}
              </q-item-label>

              <q-item-label class="text-negative text-bold q-mb-sm">
                {{ plannedExpense.amount }} {{ salaryDetails.currency }} -
                {{ expenseToTime(plannedExpense.amount) }}
              </q-item-label>
            </q-item-section>
            <q-item-section side>
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
import { onMounted, reactive, Ref, ref } from 'vue';
import { useRouter } from 'vue-router';
import {
  getArchivedPlannedExpenses,
  getBoughtPlannedExpenses,
  getTimeFromAmount,
  removePlannedExpense,
} from 'src/api/plannedExpenseService';
import { getSalaryDetails } from 'src/api/SalaryService';
import { PlannedExpense } from 'src/types/PllannedExpense';
import { SalaryDetails } from 'src/types/salary';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const router = useRouter();
const boughtPlannedExpenses = ref<PlannedExpense[]>([]);
const archivedPlannedExpenses = ref<PlannedExpense[]>([]);
const tab: Ref<'bought' | 'archived'> = ref('bought');

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

const getFormmattedDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-Us', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
</script>
