<!-- eslint-disable max-len -->
<template>
  <div class="flex flex-center">
    <q-card style="width: 500px; max-width: 80vw;">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">
          <template v-if="!emailSent">
            <div class="text-center q-mb-lg"> Reset Password</div>
          </template>
          <template v-else>
            <div class="text-center q-mb-lg"> Reset Password</div>
          </template>
        </div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section class="q-pt-md">
        <template v-if="!emailSent">
          <div class="text-center q-mb-lg">
            <q-form ref="resetPasswordForm">
              <q-input type="email" v-model="form.email" label="Email *" lazy-rules
                :rules="[val => (val && val.length > 0) || 'Please type your email']" />
            </q-form>
            <q-card-actions align="right">
              <div class="row q-mt-xs">
                <q-btn class="q-pl-md q-pr-md q-mr-md text-capitalize rounded-borders" label="Submit" color="primary"
                  @click="initiatePasswordReset" />
              </div>
            </q-card-actions>
          </div>
        </template>
        <template v-else>
          <q-form ref="resetPasswordForm">
            <q-input type="text" v-model="form.email" label="Enter Reset Code *" lazy-rules
              :rules="[val => (val && val.length > 0) || 'Please type your reset code']" />
          </q-form>
          <q-card-actions align="right">
            <div class="row q-mt-xs">
              <q-btn class="q-pl-md q-pr-md q-mr-md text-capitalize rounded-borders" label="Submit" color="primary"
                @click="confirmPassword" />
            </div>
          </q-card-actions>
        </template>

      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">

import { confirmPasswordReset, sendPasswordResetEmail, verifyPasswordResetCode } from 'firebase/auth';
import { reactive, ref } from 'vue';
import { auth } from 'src/firebase';
import { useQuasar } from 'quasar';

const $q = useQuasar();

const emailSent = ref(false);

const form = reactive({
  email: '',
  code: '',
  newPassword: '',
});

const initiatePasswordReset = () => {
  console.log('initiatePasswordReset', form.email);
  sendPasswordResetEmail(auth, form.email)
    .then((response) => {
      $q.notify({ message: 'Passwrd reset link sent successfully', color: 'green', position: 'top-right' });
      emailSent.value = true;
      console.log(response);
    }).catch((error) => {
      console.log(error.message);
    });
};

const confirmPassword = async () => {
  console.log('initiatePasswordReset', form.email);
  confirmPasswordReset(auth, form.code, form.newPassword).then((response) => {
    console.log(response);
  }).catch((error) => {
    console.log(error.message);
  });
};
</script>

<style scoped>
</style>
