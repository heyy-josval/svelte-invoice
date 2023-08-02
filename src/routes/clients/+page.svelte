<script>
   import { doc, deleteDoc, updateDoc } from "firebase/firestore";
   import { clients } from "../../stores";
   import Modal from "svelte-simple-modal";
   import AddPopup from "../../components/Clients/addPopup.svelte";
   import { writable } from "svelte/store";
   import deepClone from "../../deepClone";
   import { db } from "../firebase";
   const modal = writable(null);
   const editClient = writable({});
   const showAddModal = () => modal.set(AddPopup);

   const handleDelete = async (id) => {
      try {
         await deleteDoc(doc(db, "clients", id));
         alert("El cliente ha sido eliminada con exito");
      } catch (err) {
         alert("Ha ocurrido un error al intentar eliminar este cliente");
      }
   };

   const handleEdit = async (client) => {
      $editClient = deepClone(client);
   };

   const updateEdit = async () => {
      let _counter = 0;

      $clients.forEach((client) => {
         if (client.dni == $editClient.dni) {
            if (client.id != $editClient.id) {
               _counter++;
            }
         }
      });

      if (_counter > 0) {
         alert("Este cliente ya se encuentra registrado!");
         return;
      }

      const docRef = doc(db, "clients", $editClient.id);
      try {
         await updateDoc(docRef, $editClient);
         alert("Actualizado con exito!");
         $editClient = {};
      } catch (err) {
         alert("Ha ocurrido un error al actualizar este cliente");
      }
   };
</script>

<Modal show={$modal}>
   <button on:click={showAddModal}>Agregar nuevo cliente</button>
</Modal>
<br />
<br />
{#if Object.keys($editClient).length != 0}
   <form
      style="width: 100%; display: flex; flex-direction: column;"
      on:submit|preventDefault={updateEdit}
   >
      <label for="">Nombres</label>
      <input
         type="text"
         placeholder="Nombre"
         bind:value={$editClient.names}
         style="width: 100%; height: 30px; margin: 5px 0 5px 0;"
         required
      />
      <label for="">Apellidos</label>
      <input
         type="text"
         placeholder="Apellidos"
         bind:value={$editClient.lastnames}
         style="width: 100%; height: 30px; margin: 5px 0 5px 0;"
         required
      />
      <label for="">Correo</label>
      <input
         type="email"
         placeholder="Email"
         bind:value={$editClient.email}
         style="width: 100%; height: 30px; margin: 5px 0 5px 0;"
         required
      />
      <label for="">Celular</label>
      <input
         type="tel"
         placeholder="Celular"
         bind:value={$editClient.phone}
         style="width: 100%; height: 30px; margin: 5px 0 5px 0;"
         required
      />
      <label for="">DNI</label>
      <input
         type="tel"
         placeholder="Celular"
         bind:value={$editClient.dni}
         style="width: 100%; height: 30px; margin: 5px 0 5px 0;"
         required
      />
      <label for="">Direccion</label>
      <input
         type="text"
         placeholder="Direccion"
         bind:value={$editClient.address}
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
               $editClient = {};
            }}>Cancelar</button
         >
      </div>
   </form>
{/if}
{#if $clients.length != 0}
   <table>
      <thead>
         <tr>
            <th>Nombres</th>
            <th>Apellidos</th>
            <th>Email</th>
            <th>Celular</th>
            <th>DNI</th>
            <th>Direccion</th>
            <th />
         </tr>
      </thead>
      <tbody>
         {#each $clients as client}
            <tr>
               <td>{client.names}</td>
               <td>{client.lastnames}</td>
               <td>{client.email}</td>
               <td>{client.phone}</td>
               <td>{client.dni}</td>
               <td>{client.address}</td>
               <td>
                  <div>
                     <button
                        style="background-color: red; color: white;"
                        on:click|preventDefault={handleDelete(client.id)}
                        >🗑️</button
                     >
                     <button
                        style="background-color: blue; color: white;"
                        on:click|preventDefault={handleEdit(client)}>📝</button
                     >
                  </div>
               </td>
            </tr>
         {/each}
      </tbody>
   </table>
{:else}
   <h1>No hay clientes disponibles actualmente!</h1>
{/if}
