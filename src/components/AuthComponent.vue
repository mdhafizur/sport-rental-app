<!-- eslint-disable max-len -->
<template>
  <div>
    <template v-if="props.tab === 'signup'">
      <div class="text-center q-mb-lg">Sign up with</div>
    </template>
    <template v-else>
      <div class="text-center q-mb-lg">Sign in with</div>
    </template>
    <div class="flex flex-center">
      <q-btn class="flex flex-center q-px-lg q-py-sm q-mb-md" size="md" label="Google" @click="google"
        color="primary" />
    </div>
    <template v-if="props.tab === 'signup'">
      <p class="text-center">Sign up with credentials</p>
    </template>
    <template v-else>
      <p class="text-center">Sign in with credentials</p>
    </template>

    <q-form @submit="submitForm">
      <q-input v-model="formData.email" outlined class="q-mb-md" type="email" label="Email" />
      <q-input v-model="formData.password" outlined class="q-mb-md" type="password" label="Password" />
      <div class="row">
        <q-space />
        <q-btn type="submit" color="primary" :label="tab === 'signin' ? 'Login' : 'Register'" />
      </div>
    </q-form>

    <div class="text-center q-my-md">
      <q-btn v-if="tab !== 'signup'" flat @click="forgotPassword" label="Forgot Password?" color="green"
        class="text-capitalize rounded-borders" />
    </div>

    <q-dialog v-model="resetPwdDialog">
      <ForgotPassword />
    </q-dialog>
  </div>
</template>

<script setup lang="ts">

import { reactive, ref } from 'vue';
import {
  createUserWithEmailAndPassword, getRedirectResult, GoogleAuthProvider,
  signInWithEmailAndPassword, signInWithPopup, signInWithRedirect,
} from '@firebase/auth';
import { auth } from 'src/firebase';
import ForgotPassword from 'components/ForgotPassword.vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';

import { useAuthStore } from 'src/stores/auth.store';

const authStore = useAuthStore();

const $router = useRouter();
const $q = useQuasar();
const formData = reactive({
  email: '',
  password: '',
});
const resetPwdDialog = ref(false);

const props = defineProps({
  tab: { type: String, required: true },
});

const signInExistingUser = async (email: string, password: any) => {
  console.log('signInExistingUser', email, password);
  signInWithEmailAndPassword(auth, email, password)
    .then((result: any) => {
      $q.notify({ message: 'Sign In Success.' });
      authStore.login(result.user);
      $router.push({ name: 'home' });
    })
    .catch((error: any) => {
      $q.notify({ message: error.message, icon: 'warning', color: 'red' });
      console.log(error);
    });
};

const createUser = (email: any, password: any) => {
  console.log(email, password);

  createUserWithEmailAndPassword(auth, email, password)
    .then((result: any) => {
      console.log(result);
      authStore.login(result.user);
      $q.notify({ message: 'Sign Up Successful.', icon: 'success', color: 'green' });
      $router.push('/home');
    })
    .catch((error: any) => {
      $q.notify({ message: error.message, icon: 'warning', color: 'red' });
      console.log(error);
    });
};

const submitForm = () => {
  if (props.tab === 'signin') {
    signInExistingUser(formData.email, formData.password);
  } else {
    createUser(formData.email, formData.password);
  }
};

const google = async () => {
  const provider = new GoogleAuthProvider();
  provider.addScope('profile');
  provider.addScope('email');

  signInWithPopup(auth, provider)
    .then((result: any) => {
      console.log('result', result);
      authStore.login(result.user);
      $q.notify({ message: 'Sign In Success.', color: 'green', position: 'top-right' });
    })
    .catch((error: any) => console.log('error', error));
};

const forgotPassword = () => {
  resetPwdDialog.value = true;
};

</script>

<style scoped>
</style>