<script>
   import { writable } from "svelte/store";
   import { sellers } from "../../stores";
   import { collection, addDoc } from "firebase/firestore";
   import { db } from "../../routes/firebase";
   const seller = writable({
      names: "",
      lastnames: "",
      email: "",
      phone: "",
      address: "",
      salary: "",
   });

   const submitSeller = async () => {
      let _counter = 0;

      $sellers.forEach((_seller) => {
         if (_seller.dni == $seller.dni) {
            _counter++;
         }
      });

      if (_counter > 0) {
         alert("Ya se encuentra registrado este vendedor!");
         return;
      }

      const docRef = await addDoc(collection(db, "sellers"), $seller);

      alert(`El vendedor ${$seller.names} ha sido agregado con éxito`);
   };
</script>

<div
   style="display: flex; justify-content: center; align-items: center; flex-direction: column; width: 100%;"
>
   <form
      style="width: 100%; display: flex; flex-direction: column;"
      on:submit|preventDefault={submitSeller}
   >
      <label for="">Nombres</label>
      <input
         type="text"
         placeholder="Nombre"
         bind:value={$seller.names}
         style="width: 100%; height: 30px; margin: 5px 0 5px 0;"
         required
      />
      <label for="">Apellidos</label>
      <input
         type="text"
         placeholder="Apellidos"
         bind:value={$seller.lastnames}
         style="width: 100%; height: 30px; margin: 5px 0 5px 0;"
         required
      />
      <label for="">Correo</label>
      <input
         type="email"
         placeholder="Email"
         bind:value={$seller.email}
         style="width: 100%; height: 30px; margin: 5px 0 5px 0;"
         required
      />
      <label for="">Celular</label>
      <input
         type="tel"
         placeholder="Celular"
         bind:value={$seller.phone}
         style="width: 100%; height: 30px; margin: 5px 0 5px 0;"
         required
      />
      <label for="">DNI</label>
      <input
         type="tel"
         placeholder="Celular"
         bind:value={$seller.dni}
         style="width: 100%; height: 30px; margin: 5px 0 5px 0;"
         required
      />
      <label for="">Direccion</label>
      <input
         type="text"
         placeholder="Direccion"
         bind:value={$seller.address}
         style="width: 100%; height: 30px; margin: 5px 0 5px 0;"
         required
      />
      <label for="">Sueldo</label>
      <input
         type="number"
         placeholder="S/."
         bind:value={$seller.salary}
         style="width: 100%; height: 30px; margin: 5px 0 5px 0;"
         required
      />
      <button
         style="width: 90%; height: 30px; margin: 5px 0 5px 0;"
         type="submit">Agregar Vendedor</button
      >
   </form>
</div>
