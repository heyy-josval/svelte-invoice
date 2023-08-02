<script>
   import { isLoggedIn, user } from "../../stores";
   import { companyData } from "../../company";
</script>

<h1>Perfil</h1>

{#if $isLoggedIn}
   <img src={companyData.image} alt={companyData.name} style="height: 100px;" />
   <h3>{companyData.name}</h3>
   <p>{companyData.address}</p>
   <p>{$user.email}</p>
{/if}
