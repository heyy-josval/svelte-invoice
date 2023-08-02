<script>
   import { writable } from "svelte/store";
   import { categories, items } from "../../stores";
   import { collection, addDoc } from "firebase/firestore";
   import { db } from "../../routes/firebase";
   const item = writable({
      name: "",
      description: "",
      category: "",
      cost: "",
   });

   const submitItem = async () => {
      // console.log($item);
      let _counter = 0;

      $items.forEach((_item) => {
         if (_item.name == $item.name) {
            _counter++;
         }
      });

      if (_counter > 0) {
         alert("Ya existe un item con este nombre, escoge otro");
         return;
      }

      const docRef = await addDoc(collection(db, "items"), $item);

      alert(`El item ${$item.name} ha sido agregado con éxito`);
   };
</script>

<div
   style="display: flex; justify-content: center; align-items: center; flex-direction: column; width: 100%;"
>
   <form
      style="width: 100%; display: flex; flex-direction: column;"
      on:submit|preventDefault={submitItem}
   >
      <label for="">Nombre</label>
      <input
         type="text"
         placeholder="Nombre"
         bind:value={$item.name}
         style="width: 90%; height: 30px; margin: 5px 0 5px 0;"
         required
      />
      <label for="">Descripción</label>
      <input
         type="text"
         placeholder="Descripción"
         bind:value={$item.description}
         style="width: 90%; height: 30px; margin: 5px 0 5px 0;"
         required
      />
      <label for="">Categoría</label>
      <select bind:value={$item.category} required>
         {#each $categories as category}
            <option value={category}>{category.name}</option>
         {/each}
      </select>
      <label for="">Costo</label>
      <input
         type="number"
         placeholder="Costo"
         bind:value={$item.cost}
         style="width: 90%; height: 30px; margin: 5px 0 5px 0;"
         required
      />
      <button
         style="width: 90%; height: 30px; margin: 5px 0 5px 0;"
         type="submit">Agregar Item</button
      >
   </form>
</div>
