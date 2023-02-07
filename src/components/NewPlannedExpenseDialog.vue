<template>
  <div>
    <q-dialog ref="dialogRef" @hide="onDialogHide">
      <q-card class="q-dialog-plugin">
        <q-card-section class="row items-center">
          <div class="text-h6">Add a New Planned Expense</div>
        </q-card-section>

        <q-card-section>
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
          <q-btn color="primary" label="OK" @click="onOKClick" />
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
import { ref } from 'vue';
import { useDialogPluginComponent } from 'quasar';

const { dialogRef, onDialogOK, onDialogCancel, onDialogHide } =
  useDialogPluginComponent();

const expenseName = ref(null);
const expenseAmount = ref(null);
const link = ref(null);

function onOKClick() {
  onDialogOK({
    expenseName: expenseName.value,
    expenseAmount: expenseAmount.value,
    link: link.value,
  });
}
</script>

<style scoped></style>
