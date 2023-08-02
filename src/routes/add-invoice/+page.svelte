<script>
   import easyinvoice from "easyinvoice";
   import { Timestamp, addDoc, collection } from "firebase/firestore";
   import {
      categories,
      items,
      user,
      clients,
      invoices,
      sellers,
   } from "../../stores";
   import { companyData } from "../../company";
   import { writable } from "svelte/store";
   import deepClone from "../../deepClone";
   import { db } from "../firebase";
   import Svelecte from "svelecte";

   const invoice = writable({
      company: companyData,
      client: null,
      seller: null,
      date_created: null,
      products: null,
      total: 0,
   });

   let options = $items.map((item) => item.name.toUpperCase());
   let selection = [];
   let valueProduct = [];
   let labelAsValue = false;

   const selectedProducts = writable([]);
   const dataPrint = writable({
      images: {
         logo: "https://i.ibb.co/YLN4C5G/invoice.png",
      },
      sender: null,
      client: null,
      information: null,
      products: null,
      "bottom-notice": "Completas el pago luego porfa, no me robes ps pipipi",
      settings: {
         locale: "es-PE",
         currency: "PEN",
      },
   });
   let dataTemplate = {
      images: {
         logo: "https://public.easyinvoice.cloud/img/logo_en_original.png",
         background: "https://public.easyinvoice.cloud/img/watermark-draft.jpg",
      },
      sender: {
         company: "Sample Corp",
         address: "Sample Street 123",
         zip: "1234 AB",
         city: "Sampletown",
         country: "Samplecountry",
      },
      client: {
         company: "Client Corp",
         address: "Clientstreet 456",
         zip: "4567 CD",
         city: "Clientcity",
         country: "Clientcountry",
      },
      products: [
         {
            quantity: 2,
            description: "Product 1",
            "tax-rate": 0,
            price: 33.87,
         },
         {
            quantity: 4.1,
            description: "Product 2",
            "tax-rate": 0,
            price: 12.34,
         },
         {
            quantity: 4.5678,
            description: "Product 3",
            "tax-rate": 0,
            price: 6324.453456,
         },
      ],
      "bottom-notice": "Kindly pay your invoice within 15 days.",
      settings: {
         currency: "USD",
      },
   };

   const productsHandler = () => {
      $selectedProducts = [];

      let _tempSelection = deepClone(selection);
      _tempSelection = _tempSelection.map((selected) => {
         return selected.label;
      });
      // console.log(_tempSelection);

      $items.forEach((item) => {
         if (_tempSelection.includes(item.name.toUpperCase())) {
            let cantidad = parseInt(
               prompt(
                  `Que cantidad del producto ${item.name.toUpperCase()}(s) desea?: `
               )
            );

            $selectedProducts.push({
               ...item,
               quantity: cantidad,
               subtotaL: cantidad * item.cost,
            });
         }
      });

      $invoice.products = deepClone($selectedProducts);
      // console.log($selectedProducts);
   };

   let searchDNIClient;
   let searchDNISeller;

   const searchedClient = writable({
      names: "",
      lastnames: "",
      email: "",
      phone: "",
      dni: "",
      address: "",
   });
   const searchedSeller = writable({
      names: "",
      lastnames: "",
      email: "",
      phone: "",
      dni: "",
      address: "",
      salary: "",
   });

   const handleDNIClient = () => {
      let notFound = true;
      $clients.forEach((client) => {
         if (client.dni == searchDNIClient) {
            notFound = false;
            $searchedClient = deepClone(client);
            $invoice.client = deepClone(client);
            return;
         }
      });
      notFound && alert("Cliente no encontrado!");
   };
   const handleDNISeller = () => {
      let notFound = true;
      $sellers.forEach((seller) => {
         notFound = false;
         if (seller.dni == searchDNISeller) {
            $searchedSeller = deepClone(seller);
            $invoice.seller = deepClone(seller);
            return;
         }
      });
      notFound && alert("Vendedor no encontrado!");
   };

   const uploadInvoice = async () => {
      if (
         $invoice.products == null ||
         $invoice.products == undefined ||
         $invoice.products.length == 0
      ) {
         alert("No hay productos agregados!");
         return;
      }
      if ($invoice.client == null) {
         alert("Añada un cliente!");
         return;
      }
      if ($invoice.seller == null) {
         alert("Añada un vendedor!");
         return;
      }

      let totalPrice = 0;
      $invoice.products.forEach((product) => {
         totalPrice += product.subtotaL;
      });
      $invoice.total = totalPrice;
      $invoice.date_created = Timestamp.fromDate(new Date());

      const docRef = await addDoc(collection(db, "invoices"), $invoice);
      alert("La factura se añadió con exito!");
      $dataPrint.sender = {
         company: "VENDEDOR",
         address: `${$invoice.seller.names} - ${$invoice.seller.dni}`,
         city: "Perú",
         country: "Madre de Dios",
      };
      $dataPrint.client = {
         company: "CLIENTE",
         address: `${$invoice.client.names} - ${$invoice.client.dni}`,
         city: "Perú",
         country: "Madre de Dios",
      };
      $dataPrint.products = $invoice.products.map((product) => {
         return {
            quantity: product.quantity,
            description: product.name,
            price: product.cost,
            "tax-rate": 0,
         };
      });
      $dataPrint.information = {
         number: docRef.id,
         date: timestampToDate($invoice.date_created.seconds),
      };
      easyinvoice.createInvoice($dataPrint, function (result) {
         // The response will contain a base64 encoded PDF file
         // console.log("PDF base64 string: ", result.pdf);
         printPDF(result.pdf);

         // Now this result can be used to save, download or render your invoice
         // Please review the documentation below on how to do this
      });
   };

   function printPDF(base64PDFData) {
      const pdfWindow = window.open("", "_blank");
      pdfWindow.document.write(
         '<embed width="100%" height="100%" type="application/pdf" src="data:application/pdf;base64,' +
            base64PDFData +
            '" />'
      );

      pdfWindow.document.addEventListener("DOMContentLoaded", function () {
         pdfWindow.print();
         pdfWindow.close();
      });
   }
   function timestampToDate(timestamp, customFormat = "DD-MM-YYYY") {
      const date = new Date(timestamp * 1000); // Firebase timestamps are in milliseconds, so we convert to seconds

      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();

      let formattedDate = customFormat
         .replace("DD", day)
         .replace("MM", month)
         .replace("YYYY", year);

      return formattedDate;
   }
</script>

<form
   style="width: 100%; margin-top: 50px;"
   on:submit|preventDefault={uploadInvoice}
   id="containerInvoice"
>
   <div style="width: 100%; display: flex; gap: 20px;">
      <div
         style="width: 50%; display: flex; justify-content: center; align-items: center;"
      >
         <img src={$invoice.company.image} alt="" style="height: 150px;" />
      </div>
      <div style="width: 50%; display: flex; flex-direction: column; gap: 5px;">
         <h4>Datos de la compañía</h4>
         <label for="">Nombre</label>
         <input
            type="text"
            bind:value={$invoice.company.name}
            disabled
            required
         />
         <label for="">Direccion</label>
         <input
            type="text"
            bind:value={$invoice.company.address}
            disabled
            required
         />
         <label for="">Celular</label>
         <input
            type="tel"
            bind:value={$invoice.company.phone}
            disabled
            required
         />
      </div>
   </div>
   <div style="width: 100%; display: flex; gap: 20px;">
      <div style="width: 50%; display: flex; flex-direction: column; gap: 5px;">
         <h4>Datos del cliente</h4>
         <label for="">Búsqueda por DNI</label>
         <div style="">
            <input
               type="text"
               style="width: 70%;"
               bind:value={searchDNIClient}
               required
            />
            <button
               style="width: 27%;"
               on:click|preventDefault={handleDNIClient}>Buscar</button
            >
         </div>
         <label for="">Nombres</label>
         <input
            type="text"
            bind:value={$searchedClient.names}
            disabled
            required
         />
         <label for="">Apellidos</label>
         <input
            type="text"
            bind:value={$searchedClient.lastnames}
            disabled
            required
         />
         <label for="">Correo</label>
         <input
            type="email"
            bind:value={$searchedClient.email}
            disabled
            required
         />
         <label for="">Celular</label>
         <input
            type="tel"
            bind:value={$searchedClient.phone}
            disabled
            required
         />
         <label for="">DNI</label>
         <input
            type="text"
            bind:value={$searchedClient.dni}
            disabled
            required
         />
         <label for="">Direccion</label>
         <input
            type="text"
            bind:value={$searchedClient.address}
            disabled
            required
         />
      </div>
      <div style="width: 50%; display: flex; flex-direction: column; gap: 5px;">
         <h4>Datos del vendedor</h4>
         <label for="">Búsqueda por DNI</label>
         <div style="">
            <input
               type="text"
               style="width: 70%;"
               bind:value={searchDNISeller}
               required
            />
            <button
               style="width: 27%;"
               on:click|preventDefault={handleDNISeller}>Buscar</button
            >
         </div>
         <label for="">Nombres</label>
         <input
            type="text"
            bind:value={$searchedSeller.names}
            disabled
            required
         />
         <label for="">Apellidos</label>
         <input
            type="text"
            bind:value={$searchedSeller.lastnames}
            disabled
            required
         />
         <label for="">Correo</label>
         <input
            type="email"
            bind:value={$searchedSeller.email}
            disabled
            required
         />
         <label for="">Celular</label>
         <input
            type="tel"
            bind:value={$searchedSeller.phone}
            disabled
            required
         />
         <label for="">DNI</label>
         <input
            type="text"
            bind:value={$searchedSeller.dni}
            disabled
            required
         />
         <label for="">Direccion</label>
         <input
            type="text"
            bind:value={$searchedSeller.address}
            disabled
            required
         />
         <label for="">Sueldo</label>
         <input
            class="wbd"
            type="number"
            bind:value={$searchedSeller.salary}
            disabled
            required
         />
      </div>
   </div>
   <h4 style="text-align: center;">Datos de los productos</h4>
   <div style="display: flex; gap: 20px; width: 100%; margin-top: 20px;">
      <div style="width: 50%;">
         <div
            style="width: 100%; display: flex; align-items: center; gap: 10px; flex-direction: column;"
         >
            <div style="width: 100%;">
               <Svelecte
                  {options}
                  {labelAsValue}
                  bind:readSelection={selection}
                  bind:valueProduct
                  highlightFirstItem={false}
                  multiple
                  clearable
                  placeholder="Selecciona productos"
               />
            </div>
            <button
               style="width: 100%;"
               type="button"
               on:click|preventDefault={productsHandler}
               >Agregar productos</button
            >
            <button
               style="width: 100%; background-color: #f05412;"
               type="button"
               on:click|preventDefault={() => {
                  $selectedProducts = [];
               }}>Eliminar productos</button
            >
         </div>
      </div>
      <div
         style="width: 50%; display: grid; grid-gap: 1rem; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));"
      >
         {#each $selectedProducts as product}
            <div
               style="text-align: center; border: 2px solid #19bf00; border-radius: 10px; overflow-y: scroll; min-height: 2rem; display: grid; place-items: center;"
            >
               <span
                  ><span style="font-weight: bold;"
                     >{product.name.toUpperCase()}</span
                  >
                  X {product.quantity}</span
               >
            </div>
         {/each}
      </div>
   </div>
   <div />
   <div />
   <div />
   <button type="submit" style="width: 100%; margin-top: 20px; height: 40px;"
      >Crear factura</button
   >
</form>
