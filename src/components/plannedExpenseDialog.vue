<template>
  <div>
    <q-dialog ref="dialogRef" @hide="onDialogHide">
      <q-card class="q-dialog-plugin">
        <q-card-section class="row items-center">
          <div class="text-h6">{{ title }}</div>
        </q-card-section>

        <q-card-section>
          <q-form>
            <q-input
              v-model="name"
              label="Expense Name"
              type="text"
              filled
              class="q-mb-md"
            />

            <q-input
              v-model="amount"
              label="Expense Amount"
              type="number"
              filled
              class="q-mb-md"
            />

            <q-input
              v-model="link"
              label="Link"
              type="text"
              filled
              class="q-mb-md"
            />
          </q-form>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn color="primary" label="Save" @click="onOKClick" />
          <q-btn
            color="default"
            text-color="dark"
            label="Cancel"
            @click="onDialogCancel"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useDialogPluginComponent } from 'quasar';

const { dialogRef, onDialogOK, onDialogCancel, onDialogHide } =
  useDialogPluginComponent();

const props = defineProps<{
  name: string;
  amount: number;
  link: string;
  mode: 'add' | 'edit';
}>();

const name = ref(props.name ?? null);
const amount = ref(props.amount ?? null);
const link = ref(props.link ?? null);

const title = computed(() => {
  return props.mode === 'add'
    ? 'Add a New Planned Expense'
    : 'Edit Planned Expense';
});

function onOKClick() {
  onDialogOK({
    expenseName: name.value,
    expenseAmount: amount.value,
    link: link.value,
  });
}
</script>

<style scoped></style>
