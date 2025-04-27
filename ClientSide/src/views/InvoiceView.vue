<template >
  	<div >
      <DefaultTemplate />
    </div>
</template>

<script setup>
  import { useInvoiceStore } from '@/stores/useInvoiceStore'
  import { onMounted, onBeforeUnmount } from 'vue'

  const invoice = useInvoiceStore()
  import DefaultTemplate from "@/components/DefaultTemplate.vue";


  function handleKeydown(event) {
    if (
      (event.key === '+' || event.code === 'NumpadAdd') &&
      !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)
    ) {
      event.preventDefault()
      invoice.addItem()
    }
  }


  onMounted(() => {
    window.addEventListener('keydown', handleKeydown)
    if (invoice && typeof invoice.startClock === 'function') {
      invoice.startClock()
    }
  })

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKeydown)
    if (invoice && typeof invoice.stopClock === 'function') {
      invoice.stopClock()
    }
  })
  


</script>


<style>

  button {
    margin-top: 20px;
    padding: 10px 15px;
    background: #007bff;
    color: white;
    border: none;
    cursor: pointer;
    font-size: 16px;
    border-radius: 5px;
  }
  button:hover {
    background: #0056b3;
  }

  
</style>
