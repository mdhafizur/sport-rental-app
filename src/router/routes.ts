import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',

    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '/',
        name: 'auth',
        component: () => import('pages/AuthPage.vue'),
      },
      {
        path: '/home',
        name: 'home',
        component: () => import('pages/IndexPage.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/items',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: 'create',
        name: 'create-item',
        component: () => import('pages/items/CreateItemPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'list',
        name: 'list-item',
        component: () => import('pages/items/ListItemPage.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/inventories',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: 'create',
        name: 'create-inventory',
        component: () => import('pages/inventories/CreateInventoryPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'list',
        name: 'list-inventory',
        component: () => import('pages/inventories/ListInventoryPage.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/bookings',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: 'create',
        name: 'create-booking',
        component: () => import('pages/bookings/CreateBookingPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'list',
        name: 'list-booking',
        component: () => import('pages/bookings/ListBooking.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/test',
    name: 'test',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '/', component: () => import('pages/IndexPage.vue') }],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
