<script>
   import { doc, deleteDoc, updateDoc } from "firebase/firestore";
   import { categories } from "../../stores";
   import Modal from "svelte-simple-modal";
   import AddPopup from "../../components/Category/addPopup.svelte";
   import { writable } from "svelte/store";
   import deepClone from "../../deepClone";
   import { db } from "../firebase";
   const modal = writable(null);
   const editCategory = writable({});
   const showAddModal = () => modal.set(AddPopup);

   const handleDelete = async (id) => {
      try {
         await deleteDoc(doc(db, "categories", id));
         alert("La categoria ha sido eliminada con exito");
      } catch (err) {
         alert("Ha ocurrido un error al intentar eliminar este categoria");
      }
   };

   const handleEdit = async (category) => {
      $editCategory = deepClone(category);
   };

   const updateEdit = async () => {
      let _counter = 0;

      $categories.forEach((category) => {
         if (category.name == $editCategory.name) {
            if (category.id != $editCategory.id) {
               _counter++;
            }
         }
      });

      if (_counter > 0) {
         alert("Esta categoria ya existe, escoge otro nombre!");
         $editCategory = {};
         return;
      }

      const docRef = doc(db, "categories", $editCategory.id);
      try {
         await updateDoc(docRef, $editCategory);
         alert("Actualizado con exito!");
         $editCategory = {};
      } catch (err) {
         alert("Ha ocurrido un error al actualizar esta categoria");
      }
   };
</script>

<Modal show={$modal}>
   <button on:click={showAddModal}>Agregar producto</button>
</Modal>
<br />
<br />
{#if Object.keys($editCategory).length != 0}
   <form
      style="width: 100%; display: flex; flex-direction: column;"
      on:submit|preventDefault={updateEdit}
   >
      <label for="">Nombre</label>
      <input
         type="text"
         placeholder="Nombre"
         bind:value={$editCategory.name}
         style="width: 100%; height: 30px; margin: 5px 0 5px 0;"
         required
      />
      <div style="display: flex;">
         <button
            style="width: 50%; height: 30px; margin: 5px 0 5px 0;"
            type="submit">Actualizar</button
         >
         <button
            type="reset"
            style="width: 50%; height: 30px; margin: 5px 0 5px 0;"
            on:click={() => {
               $editCategory = {};
            }}>Cancelar</button
         >
      </div>
   </form>
{/if}
{#if $categories.length != 0}
   <table>
      <thead>
         <tr>
            <th>Nombre</th>
            <th />
         </tr>
      </thead>
      <tbody>
         {#each $categories as category}
            <tr>
               <td>{category.name}</td>
               <td>
                  <div>
                     <button
                        style="background-color: red; color: white;"
                        on:click|preventDefault={handleDelete(category.id)}
                        >🗑️</button
                     >
                     <button
                        style="background-color: blue; color: white;"
                        on:click|preventDefault={handleEdit(category)}
                        >📝</button
                     >
                  </div>
               </td>
            </tr>
         {/each}
      </tbody>
   </table>
{:else}
   <h1>No hay items disponibles actualmente!</h1>
{/if}
