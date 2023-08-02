<script>
   import { writable } from "svelte/store";
   import { clients } from "../../stores";
   import { collection, addDoc } from "firebase/firestore";
   import { db } from "../../routes/firebase";
   const client = writable({
      names: "",
      lastnames: "",
      email: "",
      phone: "",
      address: "",
   });

   const submitClient = async () => {
      let _counter = 0;

      $clients.forEach((_client) => {
         if (_client.dni == $client.dni) {
            _counter++;
         }
      });

      if (_counter > 0) {
         alert("Ya se encuentra registrado este cliente!");
         return;
      }

      const docRef = await addDoc(collection(db, "clients"), $client);

      alert(`El cliente ${$client.names} ha sido agregado con éxito`);
   };
</script>

<div
   style="display: flex; justify-content: center; align-items: center; flex-direction: column; width: 100%;"
>
   <form
      style="width: 100%; display: flex; flex-direction: column;"
      on:submit|preventDefault={submitClient}
   >
      <label for="">Nombres</label>
      <input
         type="text"
         placeholder="Nombre"
         bind:value={$client.names}
         style="width: 100%; height: 30px; margin: 5px 0 5px 0;"
         required
      />
      <label for="">Apellidos</label>
      <input
         type="text"
         placeholder="Apellidos"
         bind:value={$client.lastnames}
         style="width: 100%; height: 30px; margin: 5px 0 5px 0;"
         required
      />
      <label for="">Correo</label>
      <input
         type="email"
         placeholder="Email"
         bind:value={$client.email}
         style="width: 100%; height: 30px; margin: 5px 0 5px 0;"
         required
      />
      <label for="">Celular</label>
      <input
         type="tel"
         placeholder="Celular"
         bind:value={$client.phone}
         style="width: 100%; height: 30px; margin: 5px 0 5px 0;"
         required
      />
      <label for="">DNI</label>
      <input
         type="tel"
         placeholder="Celular"
         bind:value={$client.dni}
         style="width: 100%; height: 30px; margin: 5px 0 5px 0;"
         required
      />
      <label for="">Direccion</label>
      <input
         type="text"
         placeholder="Direccion"
         bind:value={$client.address}
         style="width: 100%; height: 30px; margin: 5px 0 5px 0;"
         required
      />
      <button
         style="width: 90%; height: 30px; margin: 5px 0 5px 0;"
         type="submit">Agregar Cliente</button
      >
   </form>
</div>
