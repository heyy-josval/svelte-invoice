<script>
   import { auth } from "../firebase";
   import { signInWithEmailAndPassword } from "firebase/auth";
   import { isLoggedIn, user } from "../../stores";
   import { goto } from "$app/navigation";
   import { writable } from "svelte/store";

   const userLogin = writable({
      email: "",
      password: "",
   });

   const login = async () => {
      await signInWithEmailAndPassword(
         auth,
         $userLogin.email,
         $userLogin.password
      )
         .then((userCredential) => {
            // Signed in
            $user = userCredential.user;
            $isLoggedIn = true;
            goto("/profile");
         })
         .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(`Error ${errorCode}: ${errorMessage}`);
         });
   };
</script>

<h1>Login</h1>

<form
   style="display: flex; flex-direction: column;"
   on:submit|preventDefault={login}
>
   <label for="email">Email</label>
   <input
      type="email"
      name="email"
      style="height: 30px;"
      required
      bind:value={$userLogin.email}
   />
   <label for="password">Contraseña</label>
   <input
      type="password"
      name="password"
      style="height: 30px;"
      required
      bind:value={$userLogin.password}
   />
   <button type="submit" style="margin-top: 20px; height: 40px;"
      >Ingresar</button
   >
</form>
