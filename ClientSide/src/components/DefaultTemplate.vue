<template>
  <div class="body a4-page mobile">
  <sideBtn/>
    <header class="mob-header">
      <h1 class="header-1"> 
        {{ invoiceData.isInvoice ? 'FACTURA' : 'COTAÇÃO' }}
      </h1>
      
      <address class="header-2">
        <p contenteditable>{{ invoiceData.company.name }}</p>
        <p contenteditable>{{ invoiceData.company.address }}</p>
        <p contenteditable>{{ invoiceData.company.phone }}</p>
        <p contenteditable>{{ invoiceData.company.website }}</p>
      </address>
      <span class="header-3">
        <img :src="invoiceData.logo" style="max-width: 100px; margin-right: 50px;" />
        <input type="file" accept="image/*" @change="uploadLogo" />
      </span>
    </header>
    <article >
      <div class="mob-cli">
        <address class="mob-cli-data">
          <span id="client">
            DADOS DO CLIENTE
          </span>
          <p contenteditable>{{ invoiceData.client.name }}</p>
          <p contenteditable>{{ invoiceData.client.phone }}</p>
          <p contenteditable>{{ invoiceData.client.address }}</p>
        </address>
        <table class="meta mob-cli-details">
          <tr>
            <th>Número #</th>
            <td contenteditable>{{ invoiceData.invoiceNumber }}</td>
          </tr>
          <tr>
            <th>Data</th>
            <td class="date_picker" style="cursor: pointer; position: relative;">
              <Datepicker id="date_picker"
              style="cursor: pointer;"
                :model-value="now"
                @update:model-value="handleDateChange"
                :format="(date) => formattedDate"
                position="left"
                :locale="pt"
              />
            </td>

          </tr>
          <tr v-show="invoiceData.isInvoice">
            <th>Saldo</th>
            <td><span>${{ invoiceData.currency }} </span> <span>{{ balance}}</span></td>
          </tr>
        </table>
      </div>
      <table class="inventory" >
        <thead>
          <tr>
            <th>Item</th>
            <th>Descrição</th>
            <th>Preço</th>
            <th>Quantidade</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in invoiceData.items" :key="index">
            <td>  
              <a @click="removeItem(index)" class="cut">-</a> 
              <span contenteditable>{{ item.name }}</span>
            </td>
            <td> 
              <span contenteditable>{{ item.description }} </span>
            </td>
            <td>
              <span>${{ invoiceData.currency }} </span>  
              <span contenteditable @input="updateItemTotal(index, $event, 'price')"></span>
            </td>
            <td>
              <span></span>  
              <span contenteditable @input="updateItemTotal(index, $event, 'quantity')"></span>
            </td>
            <td>
              <span>${{ invoiceData.currency }} </span>   
              <span> {{ item.total }}</span>
            </td>
          </tr>
        </tbody>
      </table>
      <a @click="addItem" class="add">+</a>
      <table class="balance mob-total">
        <tr>
          <th>Total</th>
          <td> <b><span>${{ invoiceData.currency }} </span> {{ total }}</b></td>
        </tr>
        <tr  v-show="invoiceData.isInvoice">
          <th>Valor Pago</th>
          <td>
            <span>${{ invoiceData.currency }} </span>  
            <span contenteditable  @input="updatePaidAmount($event)"></span>
          </td>
        </tr>
        <tr  v-show="invoiceData.isInvoice">
          <th>Remanescente</th>
          <td><span>${{ invoiceData.currency }} </span> {{ change }}</td>
        </tr>
      </table>
    </article>
    <aside>
      <h1>Notas Adicionais</h1>
      <div>
        <p contenteditable>{{ invoiceData.notes }}</p>
      </div>
    </aside>
    <!-- <div id="floating-items">
      <button class="floating" @click="downloadPDF" id="downloadBtn">Baixar PDF</button>
      <button class="floating" @click="downloadExcel">Baixar Excel</button>
      <button class="floating" @click="downloadImage">Baixar Imagem</button>
      <button class="floating" @click="toggleTheme" id="themesBtn">Mudar Tema</button>
    </div> -->

    <footer  class="print-footer hidden">
      <small>Processado por computador. {{formattedDateTime}} | @eFacturas</small>
    </footer>
    <!-- <expand-btn/> -->
  </div>
</template>


<script setup>
  import { ref, onMounted, onBeforeUnmount, getCurrentInstance  } from 'vue'
  import Datepicker from 'vue3-datepicker'
  import { useInvoiceStore } from '@/stores/useInvoiceStore'
  import { useThemeStore } from '@/stores/useThemeStore'
  import pt from 'date-fns/locale/pt'
  import pt_br from 'date-fns/locale/pt-BR'
  import { storeToRefs } from 'pinia'
  import sideBtn from './include/sideBtn.vue'



  const invoice = useInvoiceStore()
  const { 
    invoiceData, 
    total, 
    balance, 
    change,  
    formattedDate,
    formattedDateTime,
    now
  } = storeToRefs(invoice)
  // Métodos (funções — não precisam ser reativas)
  const hiddenDate = ref(null)

  const {
    addItem,
    removeItem,
    updateItemTotal,
    uploadLogo,
    downloadPDF,
    downloadXls,
    downloadImage,
    updatePaidAmount,
    updateDateFromInput,
    formattedTime,
    updateTotal,
    startClock,
    stopClock,
    clearInvoiceData,
    setIsInvoice
  } = invoice

    
  function handleDateChange(date) {
    updateDateFromInput(date)
  }

  
  function onDateSelected(event) {
    updateDateFromInput(event.target.value)
  }

  
  const theme = useThemeStore()
 
  function toggleTheme() {
    theme.toggleTheme()
  }

  onMounted(() => {
    const instance = getCurrentInstance();
    const templateName = instance?.type?.name || 'DefaultTemplate';
    theme.applyInitialTheme(templateName);
    invoice.startClock()
  })

  onBeforeUnmount(() => {
    invoice.stopClock()
  })



</script>

<style >
    @import '@/assets/css/variables.css';

    /* content editable */

    *[contenteditable] { border-radius: 0.25em; min-width: 1em; outline: 0; }

    *[contenteditable] { cursor: pointer; }

    *[contenteditable]:hover, *[contenteditable]:focus, td:hover *[contenteditable], td:focus *[contenteditable], img.hover { 
        /* background: #DEF; */
        /* box-shadow: 0 0 1em 0.5em #DEF;  */
        background: var(--ui-secondary);
        color: var(--ui-secondary-text) ;
        box-shadow: 0 0 1em 0.5em  var(--ui-secondary); 
    }
    *{
      color: var(--ui-text);
    }

    #date_picker{
      background: var(--ui-background);
      border:  var(--ui-background);
      width: 95%;
    }

    .body { background: var(--ui-background); border-radius: 1px; box-shadow: 0 0 1in -0.25in rgba(0, 0, 0, 0.5); }
    .body { box-sizing: border-box; height: auto; margin: 0 auto; overflow: visible; padding: 0.3in 0.5in; width: 8.5in; min-height: 100vh; border-radius: 5px;}


    span[contenteditable] { display: inline-block; }

    /* heading */

    h1 { 
        font: bold 100% sans-serif; 
        letter-spacing: 0.5em; 
        text-align: center; 
        text-transform: uppercase; 
    }

    /* table */

    table { font-size: 75%; table-layout: fixed; width: 100%; }
    table { border-collapse: separate; border-spacing: 2px; }
    th, td { border-width: 1px; padding: 0.5em; position: relative; text-align: left; }
    th, td { border-radius: 0.25em; border-style: solid; }
    th { background: var(--ui-surface); border-color: #BBB; }
    td { border-color: #DDD; }

   
    /* header */

    header { margin: 0 0 3em; }
    header:after { clear: both; content: ""; display: table; }

    header h1 {
        background: var(--ui-primary); border-radius: 0.25em; color: var(--ui-primary-text); margin: 0 0 1em; padding: 0.5em 0; }
    header address { float: left; font-size: 90%; font-style: normal; line-height: 1.25; margin: 0 1em 1em 0; }
    header address p { margin: 0 0 0.25em; }
    header span, header img { display: block; float: right; }
    header span { margin: 0 0 1em 1em; max-height: 25%; max-width: 60%; position: relative; }
    header img { max-height: 100%; max-width: 100%; }
    header input { cursor: pointer; -ms-filter:"progid:DXImageTransform.Microsoft.Alpha(Opacity=0)"; filter: alpha(opacity=0); height: 100%; left: 0; opacity: 0; position: absolute; top: 0; width: 100%; }

    /* article */

    article, article address, table.meta, table.inventory { margin: 0 0 3em; }
    article:after { clear: both; content: ""; display: table; }
    article h1 { clip: rect(0 0 0 0); position: absolute; }

    article address { float: left; }
    article address p{ padding: .2em 0;font-size: 90%; }
    article address #client{ font-size: 95%; font-weight: normal; font-weight: 600;}

    /* table meta & balance */

    table.meta, table.balance { float: right; width: 36%; }
    table.meta:after, table.balance:after { clear: both; content: ""; display: table; }

    /* table meta */

    table.meta th { width: 40%; }
    table.meta td { width: 60%; }

    /* table items */

    table.inventory { clear: both; width: 100%; }
    table.inventory th { font-weight: bold; text-align: center; }

    table.inventory td:nth-child(1) { width: 26%; }
    table.inventory td:nth-child(2) { width: 38%; }
    table.inventory td:nth-child(3) { text-align: right; width: 12%; }
    table.inventory td:nth-child(4) { text-align: right; width: 12%; }
    table.inventory td:nth-child(5) { text-align: right; width: 12%; }

    /* table balance */

    table.balance th, table.balance td { width: 50%; }
    table.balance td { text-align: right; }

    /* aside */

    aside h1 { border: none; border-width: 0 0 1px; margin: 0 0 1em; }
    aside h1 { border-color: #999; border-bottom-style: solid; }

    /* javascript */

    .add, .cut
    {
        border-width: 1px;
        display: block;
        font-size: .8rem;
        padding: 0.25em 0.5em;	
        float: left;
        text-align: center;
        width: 0.6em;
    }
    .toogle-title{
         border-width: 5px;
        display: block;
        font-size: .8rem;
        padding: 0.25em 0.5em;	
        float: left;
        text-align: center;
        width: 0.6em;
         background: #9AF;
        box-shadow: 0 1px 2px rgba(0,0,0,0.2);
        background-image: -moz-linear-gradient(#00ADEE 5%, #0078A5 100%);
        background-image: -webkit-linear-gradient(#00ADEE 5%, #0078A5 100%);
        border-radius: 0.5em;
        border-color: #0076A3;
        color: #FFF;
        cursor: pointer;
        font-weight: bold;
        text-shadow: 0 -1px 2px rgba(0,0,0,0.333);
        /* position: absolute; top: 0; left: -1.5em; */
    }

    .add, .cut
    {
        background: #9AF;
        box-shadow: 0 1px 2px rgba(0,0,0,0.2);
        background-image: -moz-linear-gradient(#00ADEE 5%, #0078A5 100%);
        background-image: -webkit-linear-gradient(#00ADEE 5%, #0078A5 100%);
        border-radius: 0.5em;
        border-color: #0076A3;
        color: #FFF;
        cursor: pointer;
        font-weight: bold;
        text-shadow: 0 -1px 2px rgba(0,0,0,0.333);
    }

       .add { margin: -2.5em 0 0; }

    .add:hover { background: #00ADEE; }

    .cut { opacity: 0; position: absolute; top: 0; left: -1.5em; }
    .cut { -webkit-transition: opacity 100ms ease-in; transition: opacity 100ms ease-in; }

    tr:hover .cut { opacity: 1; }

    .floating-items {
        position: fixed;
        bottom: 1rem;
        right: 35.8%;
    }


    .print-footer {
      width: 100%;
      text-align: center;
      font-size: 0.75rem;
      font-family: "Roboto Mono", monospace;
      color: inherit;
      border-top: 1px dashed currentColor;
      padding-top: 4px;
      margin-top: 3em;
      margin-bottom: 0;
      position: relative;
    }
    .print-footer.hidden {
      display: none;
    }

    @media screen and (max-width: 700px) {
      .mobile{
        width: auto;
         padding: 0.1in 0.1in; 
         border-radius: 5px;
      }

      .mob-header{
        display: flex;
        flex-flow: row wrap;
        justify-content: center;
        align-items: center;
        
      }

      .mob-header .header-1{
        flex: 100%;
      }
      .mob-header .header-2{
        flex: 50%;
      }
      .mob-header .header-3{
        flex: 30%;
        /* align-itself: center */
      }

      .mob-cli{
        display: flex;
        flex-flow: row wrap;
      }

      .mob-cli-data, .mob-cli-details{
        flex: 50%;
        min-width: 180px;
      }

      .mob-total{
        min-width: 190px;
      }
    }

    @media screen and(max-width: 600px){
       /* .mobile{
        width: auto;
         padding: 0.1in 0.1in; 
         border-radius: 5px;
      } */
    }




    @media print {
        * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        html { background: none; padding: 0; }
        body { box-shadow: none; margin: 0; }
        span:empty { display: none !important; }
        .add, .cut { display: none !important; }
        #downloadBtn { display: none; }
    }

    /* @page { 
      margin: 0; 
      page-break-after: always;
      position: relative;
      min-height: 297mm;  
    } */
</style>