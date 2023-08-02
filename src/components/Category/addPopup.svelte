<script>
   import { writable } from "svelte/store";
   import { categories } from "../../stores";
   import { collection, addDoc } from "firebase/firestore";
   import { db } from "../../routes/firebase";
   const category = writable({
      name: "",
   });

   const submitCategory = async () => {
      let _counter = 0;

      $categories.forEach((_category) => {
         if (_category.name == $category.name) {
            _counter++;
         }
      });

      if (_counter > 0) {
         alert("Ya existe una categoria con este nombre, escoge otro");
         return;
      }

      const docRef = await addDoc(collection(db, "categories"), $category);

      alert(`La categoria ${$category.name} ha sido agregado con éxito`);
   };
</script>

<div
   style="display: flex; justify-content: center; align-items: center; flex-direction: column; width: 100%;"
>
   <form
      style="width: 100%; display: flex; flex-direction: column;"
      on:submit|preventDefault={submitCategory}
   >
      <label for="">Nombre</label>
      <input
         type="text"
         placeholder="Nombre"
         bind:value={$category.name}
         style="width: 90%; height: 30px; margin: 5px 0 5px 0;"
         required
      />
      <button
         style="width: 90%; height: 30px; margin: 5px 0 5px 0;"
         type="submit">Agregar Categoria</button
      >
   </form>
</div>
