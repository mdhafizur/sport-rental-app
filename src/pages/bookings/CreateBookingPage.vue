<!-- eslint-disable max-len -->
<template>
  <div>
    <div class="q-pa-md row justify-center">
      <div class="col-10 col-sm-6 col-md-6 col-lg-4">
        <div v-show="showSimulatedReturnData">
          <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
            <q-select filled v-model="formData.item" :options="data.options" :loading="loading"
              @virtual-scroll="onScroll" @update:model-value="onItemChange" />
          </q-form>

          <q-dialog v-model="card">
            <q-card class="my-card">
              <!-- <q-img src="https://cdn.quasar.dev/img/chicken-salad.jpg" /> -->

              <q-carousel transition-prev="slide-right" transition-next="slide-left" swipeable animated v-model="slide"
                control-color="primary" navigation-icon="radio_button_unchecked" navigation padding height="200px"
                class="bg-white shadow-1 rounded-borders">

                <q-carousel-slide v-for="(image, index) in selectedItem.data[0].images" :key="index"
                  :name="increaseIndex(index)" class="column no-wrap flex-center">
                  <q-img :src="image" />
                  <div class="q-mt-md text-center">
                    Image Caption
                  </div>
                </q-carousel-slide>
              </q-carousel>

              <!-- <q-carousel transition-prev="slide-right" transition-next="slide-left" swipeable animated v-model="slide"
                control-color="primary" navigation-icon="radio_button_unchecked" navigation padding height="200px"
                class="bg-white shadow-1 rounded-borders">
                <q-carousel-slide :name="1" class="column no-wrap flex-center">
                  <q-icon name="style" color="primary" size="56px" />
                  <div class="q-mt-md text-center">
                    capo
                  </div>
                </q-carousel-slide>
                <q-carousel-slide :name="2" class="column no-wrap flex-center">
                  <q-icon name="live_tv" color="primary" size="56px" />
                  <div class="q-mt-md text-center">
                    capo
                  </div>
                </q-carousel-slide>
                <q-carousel-slide :name="3" class="column no-wrap flex-center">
                  <q-icon name="layers" color="primary" size="56px" />
                  <div class="q-mt-md text-center">
                    capo
                  </div>
                </q-carousel-slide>
                <q-carousel-slide :name="4" class="column no-wrap flex-center">
                  <q-icon name="terrain" color="primary" size="56px" />
                  <div class="q-mt-md text-center">
                    capo
                  </div>
                </q-carousel-slide>
              </q-carousel> -->

              <q-card-section>
                <q-btn fab color="primary" icon="place" class="absolute"
                  style="top: 0; right: 12px; transform: translateY(-50%);" />

                <div class="row no-wrap items-center">
                  <div class="col text-h6 ellipsis">
                    {{ selectedItem.data[0].title }}
                  </div>
                  <div class="col-auto text-grey text-caption q-pt-md row no-wrap items-center">
                    <q-icon name="place" />
                    {{ selectedItem.data[0].price }}
                  </div>
                </div>

                <q-rating v-model="stars" :max="5" size="32px" />
              </q-card-section>

              <q-card-section class="q-pt-none">
                <div class="text-subtitle1">
                  $・Italian, Cafe
                </div>
                <div class="text-caption text-grey">
                  Small plates, salads & sandwiches in an intimate setting.
                </div>
              </q-card-section>

              <q-separator />

              <q-card-actions align="right">
                <q-btn v-close-popup flat color="primary" label="Reserve" />
                <q-btn v-close-popup flat color="primary" round icon="event" />
              </q-card-actions>
            </q-card>
          </q-dialog>
        </div>
        <q-inner-loading :showing="visible" label="Please wait..." label-class="text-teal"
          label-style="font-size: 1.1em" />
      </div>
    </div>
    {{ selectedItem }}
  </div>
</template>

<script setup lang="ts">

import { onMounted, reactive, ref as REF } from 'vue';
import { useItemsStore } from 'src/stores/items.store';
import { useQuasar } from 'quasar';

const itemsStore = useItemsStore();
const visible = REF(true);
const showSimulatedReturnData = REF(false);
const loading = REF(false);
const card = REF(false);
const stars = REF(3);
const slide = REF(1);

const selectedItem = reactive({
  data: null,
});

const $q = useQuasar();

const data = reactive({
  options: [],
});

const formData = reactive({
  item: null,
});

const increaseIndex = (index) => index + 1;

const onItemChange = (item) => {
  const itemId = item.value;
  selectedItem.data = itemsStore.getItems.filter((elem) => elem.id === itemId);
  card.value = true;
  console.log(selectedItem);
};

onMounted(async () => {
  await itemsStore.fetchItems();
  data.options = itemsStore.getItems.map((item) => ({ label: item.title, value: item.id }));
  console.log('options:', data);
});

const onScroll = ({ to, ref }) => {
  console.log(to, ref);
};

const onSubmit = async () => {
  console.log('submit');
};

const onReset = () => {
  console.log('reset');
};

setTimeout(() => {
  visible.value = false;
  showSimulatedReturnData.value = true;
}, 3000);

</script>
