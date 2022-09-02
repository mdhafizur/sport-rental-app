<!-- eslint-disable max-len -->
<template>
  <div class="q-pa-md row justify-center">
    <div class="col-10 col-sm-6 col-md-6 col-lg-4">
      <q-page class="flex q-pa-md">
        <q-card class="full-width">
          <q-tabs
            v-model="tab"
            dense
            class="text-grey"
            active-color="primary"
            indicator-color="primary"
            align="justify"
            narrow-indicator
          >
            <q-tab name="signin" label="Sign In" />
            <q-tab name="signup" label="Sign Up" />
          </q-tabs>

          <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="signin">
              <AuthComponent :tab="tab" />
            </q-tab-panel>

            <q-tab-panel name="signup">
              <AuthComponent :tab="tab" />
            </q-tab-panel>
          </q-tab-panels>
        </q-card>
      </q-page>
    </div>
  </div>
</template>

<script setup lang="ts">
import AuthComponent from 'components/AuthComponent.vue';
import { ref } from 'vue';

const tab = ref('signin');
</script>
