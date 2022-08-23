import { defineStore } from 'pinia';

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    // initialize state from local storage to enable user to stay logged in
    user: JSON.parse(localStorage.getItem('user') || null),
    returnUrl: null,
  }),
  actions: {
    async login(user: any) {
      // update pinia state
      this.user = user;

      // store user details and jwt in local storage to keep user logged in between page refreshes
      localStorage.setItem('user', JSON.stringify(user));

      // redirect to previous url or default to home page
      this.router.push(this.returnUrl || { name: 'home' });
    },
    logout() {
      this.user = null;
      localStorage.removeItem('user');
      this.router.push({ name: 'auth' });
    },
  },
});
