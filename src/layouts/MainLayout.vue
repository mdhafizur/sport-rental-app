<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <!-- <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          Quasar App
        </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar> -->

      <q-toolbar class="bg-primary text-white q-my-md shadow-2">
        <q-btn
          flat
          round
          dense
          icon="menu"
          class="q-mr-sm"
          @click="toggleLeftDrawer"
        />
        <!-- <q-separator dark vertical inset /> -->
        <!-- <q-btn stretch flat label="Link" /> -->

        <q-space />

        <!-- <q-btn-dropdown stretch flat label="Dropdown">
          <q-list>
            <q-item-label header>Folders</q-item-label>
            <q-item v-for="n in 3" :key="`x.${n}`" clickable v-close-popup tabindex="0">
              <q-item-section avatar>
                <q-avatar icon="folder" color="secondary" text-color="white" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Photos</q-item-label>
                <q-item-label caption>February 22, 2016</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-icon name="info" />
              </q-item-section>
            </q-item>
            <q-separator inset spaced />
            <q-item-label header>Files</q-item-label>
            <q-item v-for="n in 3" :key="`y.${n}`" clickable v-close-popup tabindex="0">
              <q-item-section avatar>
                <q-avatar icon="assignment" color="primary" text-color="white" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Vacation</q-item-label>
                <q-item-label caption>February 22, 2016</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-icon name="info" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
        <q-separator dark vertical /> -->
        <!-- <q-btn stretch flat label="Sign Up" :to="{ name: 'signup' }" />
        <q-separator dark vertical />
        <q-btn stretch flat label="Sign In" :to="{ name: 'signin' }" />
        <q-separator dark vertical /> -->
        <q-btn v-if="user" stretch flat label="Logout" @click="logOut" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Essential Links </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, onMounted, onUpdated } from 'vue';
import EssentialLink, {
  EssentialLinkProps,
} from 'components/EssentialLink.vue';
import { signOut } from 'firebase/auth';
import { auth } from 'src/firebase';

import { useAuthStore } from 'src/stores/auth.store';
import { useQuasar } from 'quasar';
// import { storeToRefs } from 'pinia';

const authStore = useAuthStore();
// const { user } = storeToRefs(authStore);

const $q = useQuasar();

const user = ref({});

const essentialLinks: EssentialLinkProps[] = [
  {
    title: 'Docs',
    caption: 'quasar.dev',
    icon: 'school',
    link: 'https://quasar.dev',
  },
  {
    title: 'Github',
    caption: 'github.com/quasarframework',
    icon: 'code',
    link: 'https://github.com/quasarframework',
  },
  {
    title: 'Discord Chat Channel',
    caption: 'chat.quasar.dev',
    icon: 'chat',
    link: 'https://chat.quasar.dev',
  },
  {
    title: 'Forum',
    caption: 'forum.quasar.dev',
    icon: 'record_voice_over',
    link: 'https://forum.quasar.dev',
  },
  {
    title: 'Twitter',
    caption: '@quasarframework',
    icon: 'rss_feed',
    link: 'https://twitter.quasar.dev',
  },
  {
    title: 'Facebook',
    caption: '@QuasarFramework',
    icon: 'public',
    link: 'https://facebook.quasar.dev',
  },
  {
    title: 'Quasar Awesome',
    caption: 'Community Quasar projects',
    icon: 'favorite',
    link: 'https://awesome.quasar.dev',
  },
];

const leftDrawerOpen = ref(false);

onMounted(() => {
  leftDrawerOpen.value = false;
  user.value = authStore.user || null;
});

onUpdated(() => {
  user.value = authStore.user || null;
});

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

const logOut = () => {
  signOut(auth)
    .then(() => {
      authStore.logout();
      $q.notify({
        message: 'Signed Out.',
        color: 'red',
        position: 'top-right',
      });
    })
    .catch((error) => {
      // An error happened.
      console.log(error);
    });
};
</script>
