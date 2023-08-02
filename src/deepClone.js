export default function deepClone(obj, visited = new WeakMap()) {
   // Si el objeto es null o no es un objeto, no se necesita clonar, se devuelve el objeto original
   if (obj === null || typeof obj !== "object") {
      return obj;
   }

   // Si el objeto ya ha sido visitado previamente, se devuelve la copia almacenada para evitar referencias circulares
   if (visited.has(obj)) {
      return visited.get(obj);
   }

   // Creamos una nueva copia vacía, ya sea un objeto o un array
   let clone = Array.isArray(obj) ? [] : {};

   // Registramos el objeto original y su clon en el WeakMap para evitar referencias circulares
   visited.set(obj, clone);

   // Recorremos todas las propiedades del objeto original
   for (let key in obj) {
      // Verificamos si la propiedad es una propiedad propia y no heredada
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
         // Realizamos una llamada recursiva para clonar el valor de la propiedad
         clone[key] = deepClone(obj[key], visited);
      }
   }

   // Devolvemos la copia del objeto que ahora es una copia profunda del objeto original
   return clone;
}