<script>
   import { doc, deleteDoc, updateDoc } from "firebase/firestore";
   import { sellers } from "../../stores";
   import Modal from "svelte-simple-modal";
   import AddPopup from "../../components/Sellers/addPopup.svelte";
   import { writable } from "svelte/store";
   import deepClone from "../../deepClone";
   import { db } from "../firebase";
   const modal = writable(null);
   const editSeller = writable({});
   const showAddModal = () => modal.set(AddPopup);

   const handleDelete = async (id) => {
      try {
         await deleteDoc(doc(db, "sellers", id));
         alert("El vendedor ha sido eliminada con exito");
      } catch (err) {
         alert("Ha ocurrido un error al intentar eliminar este vendedor");
      }
   };

   const handleEdit = async (seller) => {
      $editSeller = deepClone(seller);
   };

   const updateEdit = async () => {
      let _counter = 0;

      $sellers.forEach((seller) => {
         if (seller.dni == $editSeller.dni) {
            if (seller.id != $editSeller.id) {
               _counter++;
            }
         }
      });

      if (_counter > 0) {
         alert("Este vendedor ya se encuentra registrado!");
         return;
      }

      const docRef = doc(db, "sellers", $editSeller.id);
      try {
         await updateDoc(docRef, $editSeller);
         alert("Actualizado con exito!");
         $editSeller = {};
      } catch (err) {
         alert("Ha ocurrido un error al actualizar este vendedor");
      }
   };
</script>

<Modal show={$modal}>
   <button on:click={showAddModal}>Agregar nuevo vendedor</button>
</Modal>
<br />
<br />
{#if Object.keys($editSeller).length != 0}
   <form
      style="width: 100%; display: flex; flex-direction: column;"
      on:submit|preventDefault={updateEdit}
   >
      <label for="">Nombres</label>
      <input
         type="text"
         placeholder="Nombre"
         bind:value={$editSeller.names}
         style="width: 100%; height: 30px; margin: 5px 0 5px 0;"
         required
      />
      <label for="">Apellidos</label>
      <input
         type="text"
         placeholder="Apellidos"
         bind:value={$editSeller.lastnames}
         style="width: 100%; height: 30px; margin: 5px 0 5px 0;"
         required
      />
      <label for="">Correo</label>
      <input
         type="email"
         placeholder="Email"
         bind:value={$editSeller.email}
         style="width: 100%; height: 30px; margin: 5px 0 5px 0;"
         required
      />
      <label for="">Celular</label>
      <input
         type="tel"
         placeholder="Celular"
         bind:value={$editSeller.phone}
         style="width: 100%; height: 30px; margin: 5px 0 5px 0;"
         required
      />
      <label for="">DNI</label>
      <input
         type="tel"
         placeholder="Celular"
         bind:value={$editSeller.dni}
         style="width: 100%; height: 30px; margin: 5px 0 5px 0;"
         required
      />
      <label for="">Direccion</label>
      <input
         type="text"
         placeholder="Direccion"
         bind:value={$editSeller.address}
         style="width: 100%; height: 30px; margin: 5px 0 5px 0;"
         required
      />
      <label for="">Sueldo</label>
      <input
         type="number"
         placeholder="S/."
         bind:value={$editSeller.salary}
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
               $editSeller = {};
            }}>Cancelar</button
         >
      </div>
   </form>
{/if}
{#if $sellers.length != 0}
   <table>
      <thead>
         <tr>
            <th>Nombres</th>
            <th>Apellidos</th>
            <th>Email</th>
            <th>Celular</th>
            <th>DNI</th>
            <th>Direccion</th>
            <th>Salario</th>
            <th />
         </tr>
      </thead>
      <tbody>
         {#each $sellers as seller}
            <tr>
               <td>{seller.names}</td>
               <td>{seller.lastnames}</td>
               <td>{seller.email}</td>
               <td>{seller.phone}</td>
               <td>{seller.dni}</td>
               <td>{seller.address}</td>
               <td>S/. {seller.salary}</td>
               <td>
                  <div>
                     <button
                        style="background-color: red; color: white;"
                        on:click|preventDefault={handleDelete(seller.id)}
                        >🗑️</button
                     >
                     <button
                        style="background-color: blue; color: white;"
                        on:click|preventDefault={handleEdit(seller)}>📝</button
                     >
                  </div>
               </td>
            </tr>
         {/each}
      </tbody>
   </table>
{:else}
   <h1>No hay vendedores disponibles actualmente!</h1>
{/if}
