
<template>
    <div class="sideBtn">
        <div class="mainopShadow"></div>
        <div class="fab" style="color: white !important;">
            <div class="mainop">
                <font-awesome-icon icon="cog" size="3x"  id="addIcon" class="material-icons minifabIcon" />
            </div>
            <div id="forms" class="minifab op5" >
                <font-awesome-icon icon="paint-brush" size="2x"  class="minifabIcon"  @click="toggleTheme" />
            </div>
            <div id="drawings" class="minifab op4">
                <font-awesome-icon icon="trash" size="2x"  class="minifabIcon" style="color: white" />
            </div>
            <div id="slides" class="minifab op3">
                <font-awesome-icon icon="plus" size="2x"  class="minifabIcon" style="color: white" />
            </div>
            <div id="sheets" class="minifab op2">
                <font-awesome-icon icon="image" size="2x"  class="minifabIcon"  @click="downloadImage"/>
            </div>
            <div id="docs" class="minifab op1">
                <font-awesome-icon icon="file-pdf" size="2x"  class="minifabIcon"  @click="downloadPDF"/>
            </div>
        </div>
    </div>
</template>


<script setup>
    import { useInvoiceStore } from '@/stores/useInvoiceStore'
    const invoice = useInvoiceStore()
     const {
        downloadPDF,
        downloadImage,
    } = invoice

    
  function toggleTheme() {
    theme.toggleTheme()
  }

</script>


<style scoped>
    .body .fab {
        background-color: transparent;
        height: 64px;
        width: 64px;
        border-radius: 32px;
        transition: height 300ms;
        transition-timing-function: ease;
        position: fixed;
        right: 4%;
        bottom: 20px;
        text-align: center;
        overflow: hidden;
        z-index: 9999; /* Valor alto para sobrepor tudo */
    }

    .fab:hover {
    height: 344px;
    }

    .fab:hover .mainop {
        transform: rotate(180deg);
    }

    .mainop {
        display: flex;
        align-items: center;
        justify-content: center;
        /* cursor: pointer; */


        margin: auto;
        width: 64px;
        height: 64px;
        position: absolute;
        bottom: 0;
        right: 0;
        transition: transform 300ms;
        background-color: #f44336;
        border-radius: 32px;
        z-index: 6;
    }

    .mainopShadow {
        width: 64px;
        height: 64px;
        border-radius: 32px;
        position: fixed;
        right: 4%;
        bottom: 20px;
        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
        z-index: 9998; /* Valor alto para sobrepor tudo */
    }

    .mainop i {
        margin-top: 16px;
        font-size: 32px;
        color: #fff;
    }

    .minifab {
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        width: 48px;
        height: 48px;
        border-radius: 24px;
        z-index: 5;
        float: left;
        margin-bottom: 8px;
        margin-left: 8px;
        margin-right: 8px;
        background-color: blue;
        transition: box-shadow 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
        /* cursor: pointer; */

    }

    .minifab:hover {
        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
    }

    .minifabIcon {
        color: white !important;
        padding: 5em;
    }

    .op1 {
        background-color: #2f82fc;
    }

    .op2 {
        background-color: #0f9d58;
    }

    .op3 {
        background-color: #fb0;
    }

    .op4 {
        background-color: #dd5145;
        color: white !important;
    }

    .op5 {
        background-color: #673ab7;
    }

    @media screen and (min-width: 850px){
        .body .fab {
            right: 9.2%;
        }
        .mainopShadow {
            right: 9.2%;
        }
    }

    @media screen and (min-width: 1000px){
        .body .fab {
            right: 13%;
        }
        .mainopShadow {
            right: 13%;
        }
    }

    @media screen and (min-width: 1080px){
        .body .fab {
            right: 17.5%;
        }
        .mainopShadow {
            right: 17.5%;
        }
    }

    @media screen and (min-width: 1250px){
        .body .fab {
            right: 21%;
        }
        .mainopShadow {
            right: 21%;
        }
    }
    @media screen and (min-width: 1300px){
        .body .fab {
            right: 22%;
        }
        .mainopShadow {
            right: 22%;
        }
    }
    @media screen and (min-width: 1450px){
        .body .fab {
            right: 26%;
        }
        .mainopShadow {
            right: 26%;
        }
    }

</style>