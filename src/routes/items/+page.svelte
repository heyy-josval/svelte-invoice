<script>
   import { doc, deleteDoc, updateDoc } from "firebase/firestore";
   import { categories, items, user } from "../../stores";
   import Modal from "svelte-simple-modal";
   import AddPopup from "../../components/Items/addPopup.svelte";
   import { writable } from "svelte/store";
   import deepClone from "../../deepClone";
   import { db } from "../firebase";
   const modal = writable(null);
   const editItem = writable({});
   const showAddModal = () => modal.set(AddPopup);

   const handleDelete = async (id) => {
      try {
         await deleteDoc(doc(db, "items", id));
         alert("El item ha sido eliminado con exito");
      } catch (err) {
         alert("Ha ocurrido un error al intentar eliminar este item");
      }
   };

   const handleEdit = async (item) => {
      $editItem = deepClone(item);
      $categories.forEach((category) => {
         if (category.name == $editItem.category) {
            $editItem.category = category;
         }
      });
   };

   const updateEdit = async () => {
      let _counter = 0;

      $items.forEach((_item) => {
         if (_item.name == $editItem.name) {
            if (_item.id != $editItem.id) {
               _counter++;
            }
         }
      });

      if (_counter > 0) {
         alert("Ya existe un item con este nombre, escoge otro");
         $editItem = {};
         return;
      }

      const docRef = doc(db, "items", $editItem.id);
      try {
         await updateDoc(docRef, $editItem);
         alert("Actualizado con exito!");
         $editItem = {};
      } catch (err) {
         alert("Ha ocurrido un error al actualizar este item");
      }
   };
</script>

<Modal show={$modal}>
   <button on:click={showAddModal}>Agregar nuevo item</button>
</Modal>
<br />
<br />
{#if Object.keys($editItem).length != 0}
   <form
      style="width: 100%; display: flex; flex-direction: column;"
      on:submit|preventDefault={updateEdit}
   >
      <label for="">Nombre</label>
      <input
         type="text"
         placeholder="Nombre"
         bind:value={$editItem.name}
         style="width: 100%; height: 30px; margin: 5px 0 5px 0;"
         required
      />
      <label for="">Descripción</label>
      <input
         type="text"
         placeholder="Descripción"
         bind:value={$editItem.description}
         style="width: 100%; height: 30px; margin: 5px 0 5px 0;"
         required
      />
      <label for="">Categoría</label>
      <select
         bind:value={$editItem.category.name}
         style="width: 100%; height: 30px; margin: 5px 0 5px 0;"
         required
      >
         {#each $categories as category}
            <option value={category.name}>{category.name}</option>
         {/each}
      </select>
      <label for="">Costo</label>
      <input
         type="number"
         placeholder="Costo"
         bind:value={$editItem.cost}
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
               $editItem = {};
            }}>Cancelar</button
         >
      </div>
   </form>
{/if}
{#if $items.length != 0}
   <table>
      <thead>
         <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Categoría</th>
            <th>Costo</th>
            <th />
         </tr>
      </thead>
      <tbody>
         {#each $items as item}
            <tr>
               <td>{item.name}</td>
               <td>{item.description}</td>
               <td>{item.category.name}</td>
               <td>S/. {item.cost}</td>
               <td>
                  <div>
                     <button
                        style="background-color: red; color: white;"
                        on:click|preventDefault={handleDelete(item.id)}
                        >🗑️</button
                     >
                     <button
                        style="background-color: blue; color: white;"
                        on:click|preventDefault={handleEdit(item)}>📝</button
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
