<!-- eslint-disable object-shorthand -->
<!-- eslint-disable max-len -->
<template>
  <div class="q-pa-md row justify-center">
    <div class="col-10 col-sm-6 col-md-6 col-lg-4">
      <q-list bordered separator>
        <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
          <div v-show="showSimulatedReturnData">

            <q-item clickable v-ripple v-for="item in itemsStore.getItems" :key="item.id" v-bind="item">
              <q-item-section top thumbnail class="q-ml-none">
                <img src="https://cdn.quasar.dev/img/mountains.jpg">
              </q-item-section>

              <q-item-section>
                <q-item-label>{{ item.title }}</q-item-label>
                <q-item-label caption>
                  RM: {{ item.price }}
                </q-item-label>
              </q-item-section>

              <q-item-section side top>
                <!-- <q-item-label caption>meta</q-item-label> -->
                <q-icon name="delete" color="red" @click="deleteItem(item.id)" />
              </q-item-section>
            </q-item>
          </div>

        </transition>
      </q-list>
      <q-inner-loading :showing="visible" label="Please wait..." label-class="text-teal"
        label-style="font-size: 1.1em" />
    </div>
  </div>
</template>

<script setup lang="ts">

import {
  onMounted, ref, watch,
} from 'vue';
import { useQuasar } from 'quasar';
import {
  collection, deleteDoc, getDocs, doc,
} from 'firebase/firestore';
import { firestore } from 'src/firebase';
import { useItemsStore } from 'src/stores/items.store';

const visible = ref(true);
const showSimulatedReturnData = ref(false);
const itemsStore = useItemsStore();
const $q = useQuasar();

const deleteItem = async (id: string) => {
  console.log(id);
  await deleteDoc(doc(firestore, 'items', id)).then((response) => {
    console.log('delete response', response);
    itemsStore.setItems(itemsStore.items.filter((item) => item.id !== id));
    $q.notify({ message: 'Item deleted' });
  }).catch((error) => {
    console.log(error);
  });
};

watch(itemsStore.items, (newData) => {
  console.log('newData', newData);
  itemsStore.items = newData;
});

onMounted(async () => {
  const querySnapshot = await getDocs(collection(firestore, 'items'));
  itemsStore.setItems(querySnapshot.docs.map((item): any => ({
    ...item.data(),
    id: item.id,
  })));
});

setTimeout(() => {
  visible.value = false;
  showSimulatedReturnData.value = true;
}, 3000);

</script>
