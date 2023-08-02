import { writable } from "svelte/store";

export const user = writable({});
export const isLoggedIn = writable(false);
export const isLoaded = writable(false);

export const clients = writable([]);
export const sellers = writable([]);
export const items = writable([]);
export const categories = writable([]);
export const invoices = writable([]);