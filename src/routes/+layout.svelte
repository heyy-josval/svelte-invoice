<script>
   import { signOut, onAuthStateChanged } from "firebase/auth";
   import { auth, db } from "./firebase";
   import {
      categories,
      clients,
      invoices,
      isLoaded,
      isLoggedIn,
      items,
      sellers,
      user,
   } from "../stores";
   import { onMount } from "svelte";
   import { collection, onSnapshot } from "firebase/firestore";
   const logout = async () => {
      await signOut(auth)
         .then(() => {
            $isLoggedIn = false;
            $user = {};
         })
         .catch((err) => {
            console.log(err);
         });
   };

   onMount(async () => {
      await new Promise((resolve) => {
         const unsubUsers = onSnapshot(collection(db, "clients"), (snap) => {
            $clients = snap.docs.map((doc) => ({
               id: doc.id,
               ...doc.data(),
            }));
            resolve();
         });
      });
      await new Promise((resolve) => {
         const unsubUsers = onSnapshot(collection(db, "sellers"), (snap) => {
            $sellers = snap.docs.map((doc) => ({
               id: doc.id,
               ...doc.data(),
            }));
            resolve();
         });
      });
      await new Promise((resolve) => {
         const unsubUsers = onSnapshot(collection(db, "items"), (snap) => {
            $items = snap.docs.map((doc) => ({
               id: doc.id,
               ...doc.data(),
            }));
            resolve();
         });
      });
      await new Promise((resolve) => {
         const unsubUsers = onSnapshot(collection(db, "categories"), (snap) => {
            $categories = snap.docs.map((doc) => ({
               id: doc.id,
               ...doc.data(),
            }));
            resolve();
         });
      });
      await new Promise((resolve) => {
         const unsubUsers = onSnapshot(collection(db, "invoices"), (snap) => {
            $invoices = snap.docs.map((doc) => ({
               id: doc.id,
               ...doc.data(),
            }));
            resolve();
         });
      });
      onAuthStateChanged(auth, (authUser) => {
         $user = authUser;
         $isLoggedIn = !!authUser;
         $isLoaded = true;
         console.log($user);
      });
   });
</script>

{#if $isLoaded}
   <nav>
      <ul style="display: flex; list-style: none;">
         <li><a href="/">Inicio</a></li>
         {#if $isLoggedIn}
            <li><a href="/profile">Perfil</a></li>
            <li><a href="/items">Productos</a></li>
            <li><a href="/categories">Categorias</a></li>
            <li><a href="/clients">Clientes</a></li>
            <li><a href="/sellers">Vendedores</a></li>
            <li><a href="/add-invoice">Hacer una facturación</a></li>
            <li><a href="/#" on:click={logout}>Logout</a></li>
         {:else}
            <li><a href="/login">Login</a></li>
         {/if}
      </ul>
   </nav>

   <div style="margin: 10px;">
      <slot />
   </div>
{:else}
   <h1>Cargando...</h1>
{/if}
