<!-- eslint-disable object-shorthand -->
<!-- eslint-disable max-len -->
<template>
  <div class="q-pa-md row justify-center">
    <div class="col-10 col-sm-6 col-md-6 col-lg-4">
      <q-form class="q-gutter-md" @submit="onSubmit" @reset="onReset">
        <q-input
          v-model="inventory.title"
          filled
          label="Inventory Name *"
          hint="Name of the inventory"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Please type something']"
        />

        <!-- <q-input filled type="text" v-model="inventory.item" label="inventory Item *" step="any" lazy-rules :rules="[
        val => val !== null && val !== '' || 'Please select your Item',
        // val => val > 0 && val < 100 || 'Please type a real price'
      ]" /> -->

        <q-select
          v-model="inventory.item"
          filled
          :emit-value="false"
          :options="options.data"
          label="Label (stacked)"
          stack-label
          :dense="dense"
          :options-dense="denseOpts"
        />

        <q-input
          v-model="inventory.quantity"
          filled
          type="number"
          label="inventory quantity *"
          step="any"
          lazy-rules
          :rules="[
            (val) =>
              (val !== null && val !== '') || 'Please type your quantity',
            // val => val > 0 && val < 100 || 'Please type a real price'
          ]"
        />

        <q-toggle v-model="accept" label="I accept the license and terms" />

        <div>
          <q-btn label="Submit" type="submit" color="primary" />
          <q-btn
            label="Reset"
            type="reset"
            color="primary"
            flat
            class="q-ml-sm"
          />
        </div>
      </q-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { onMounted, reactive, ref } from 'vue';

import { collection, addDoc } from 'firebase/firestore';
import { firestore } from 'src/firebase';
import { useItemsStore } from 'src/stores/items.store';
import { Item } from 'src/interfaces';

const $q = useQuasar();

const inventory = reactive({
  title: '' || null,
  item: {
    label: null,
    value: null,
  },
  quantity: 0,
});

const accept = ref(false);

const itemsStore = useItemsStore();

const options = reactive({
  data: [],
});

const dense = ref(false);
const denseOpts = ref(false);

const onSubmit = async () => {
  console.log('inventory', inventory);
  if (accept.value !== true) {
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: 'You need to accept the license and terms first',
    });
  } else {
    try {
      const docRef = await addDoc(collection(firestore, 'inventories'), {
        title: inventory.title,
        itemId: inventory.item.value,
        quantity: Number(inventory.quantity),
      });
      console.log('Document written with ID: ', docRef.id);
    } catch (error) {
      console.log('Error adding document: ', error);
    }
    $q.notify({
      color: 'green-4',
      textColor: 'white',
      icon: 'cloud_done',
      message: 'Submitted',
    });
  }
};

const onReset = () => {
  inventory.title = null;
  inventory.item = null;
  inventory.quantity = 0;
};

onMounted(async () => {
  await itemsStore.fetchItems();
  options.data = itemsStore.getItems.map((item) => ({
    label: item.title,
    value: item.id,
  }));
  // options = [{ label: 'BMW', value: 'car' }, { label: 'Samsung Phone', value: 'phone' }];
  console.log('options:', options);
});
</script>
