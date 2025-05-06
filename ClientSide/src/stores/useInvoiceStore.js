import { defineStore } from 'pinia'
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'
import svgLogo from '@/assets/logo.svg'
import html2pdf from 'html2pdf.js'
import Datepicker from 'vue3-datepicker'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import html2canvas from 'html2canvas'

export const useInvoiceStore = defineStore('invoice', () => {
  const now = ref(new Date())
  let timer = null

  const invoiceData = reactive({
    company: {
      name: 'UltrArts',
      address: 'Maputo, Mz.',
      phone: '87 90 50 653',
      website: 'website.com'
    },
    client: {
      name: 'Nome do Cliente',
      phone: '123456789',
      address: 'Rua 123'
    },
    invoiceNumber: '101138',
    date: '',
    items: [
      {
        name: 'Front End Consultation',
        description: 'Experience Review',
        price: 0,
        quantity: 0,
        total: 0
      }
    ],
    paid: 0,
    notes: 'Obrigado por comprar connosco. Volte sempre.',
    currency: 'MZN',
    logo: svgLogo
  })

  const total = computed(() =>
    invoiceData.items.reduce((sum, item) => sum + item.total, 0)
  )

  const balance = computed(() => {
    if (!invoiceData.paid || invoiceData.paid === null) return total.value * -1
    return invoiceData.paid - total.value
  })

  const change = computed(() => {
    if (!invoiceData.paid || invoiceData.paid === null) return 0
    return (invoiceData.paid - total.value) < 0 ? 0 : invoiceData.paid - total.value
  })

  const formattedDateTime = computed(() => {
    return now.value.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  })

  const formattedDate = computed(() => {
    return now.value.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  })

  function startClock() {
    if (timer) return
    timer = setInterval(() => {
      now.value = new Date()
    }, 1000)
  }

  function stopClock() {
    clearInterval(timer)
  }

  function updateDateFromInput(dateStr) {
    now.value = new Date(dateStr)
  }

  function addItem() {
    invoiceData.items.push({ name: '', description: '', price: 0, quantity: 1, total: 0 })
  }

  function removeItem(index) {
    invoiceData.items.splice(index, 1)
  }

  function updateItemTotal(index, event, field) {
    const value = parseFloat(event.target.innerText) || 0
    invoiceData.items[index][field] = value
    invoiceData.items[index].total = invoiceData.items[index].price * invoiceData.items[index].quantity
  }

  function updatePaidAmount(event) {
    const value = parseFloat(event.target.innerText) || 0
    invoiceData.paid = value
  }

  function uploadLogo(event) {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        invoiceData.logo = e.target.result
      }
      reader.readAsDataURL(file)
    }
  }

  

  function downloadPDF() {
    const element = document.getElementById('receipt')
    if (!element) {
      console.warn('Elemento #receipt não encontrado.')
      return
    }
  
    // Clona o conteúdo para evitar manipular o DOM original
    const clonedElement = element.cloneNode(true)
  
    // Remove elementos indesejados do clone (como botões e inputs)
    const selectorsToRemove = [
      '.add',
      '.cut',
      '#downloadBtn',
      '#floating-items',
      'input[type="file"]',
      '.dp__menu'
    ]
    selectorsToRemove.forEach(selector => {
      clonedElement.querySelectorAll(selector).forEach(el => el.remove())
    })

    clonedElement.querySelectorAll('.print-footer.hidden').forEach(el => {
      el.classList.remove('hidden')
    })
    

    clonedElement.querySelector('.print-footer').display = 'block'
    // Cria um container invisível para renderizar o clone fora da tela
    const container = document.createElement('div')
    container.style.position = 'fixed'
    container.style.top = '-10000px'
    container.style.left = '-10000px'
    container.style.width = '210mm'
    container.style.padding = '20px'
    container.appendChild(clonedElement)
    document.body.appendChild(container)
  
    // Geração do PDF com html2pdf
    html2pdf()
      .set({
        margin: 0,
        filename: `${invoiceData.client.name}-${invoiceData.invoiceNumber}-${formattedDateTime.value}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      })
      .from(clonedElement)
      .save()
      .finally(() => {
        document.body.removeChild(container)
      })
  }
  
  function downloadImage() {
    const invoiceElement = document.getElementById('receipt')
    if (!invoiceElement) {
      console.warn('Elemento #receipt não encontrado.')
      return
    }
    const height = invoiceElement.scrollHeight

    const elementsToHide = [
      ...document.querySelectorAll('.add, .cut, #downloadBtn, .dp__menu, .floating')
    ]

    if (height > 1200) {
      alert("O documento é muito longo para ser exportado como imagem. Por favor, use a opção PDF.: "+height)
      return
    }
    elementsToHide.forEach(el => el.style.display = 'none')

    const footers = invoiceElement.querySelectorAll('.print-footer')
    footers.forEach(el => {
      el.classList.remove('hidden')
      el.style.display = 'block'
    })

    html2canvas(invoiceElement, {
      scale: 2,
      useCORS: true
    }).then(canvas => {
      const link = document.createElement('a')
      link.download = `${invoiceData.client.name}-${invoiceData.invoiceNumber}-${formattedDateTime.value}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()

      elementsToHide.forEach(el => el.style.display = '')
      footers.forEach(el => {
        el.style.display = 'none'
        el.classList.add('hidden')
      })
    }).catch(err => {
      console.error('Erro ao gerar imagem:', err)
      elementsToHide.forEach(el => el.style.display = '')
      footers.forEach(el => {
        el.style.display = 'none'
        el.classList.add('hidden')
      })

    })
  }

  function downloadExcel() {
    const invoiceElement = document.getElementById('receipt')
    if (!invoiceElement) {
      console.warn('Elemento #invoice não encontrado.')
      return
    }
    const table = invoiceElement.querySelector('table')
    if (!table) {
      console.warn('Nenhuma tabela encontrada dentro de #invoice.')
      return
    }
    const workbook = XLSX.utils.table_to_book(table, { sheet: 'Fatura' })
    const filename = `${invoiceData.client.name}-${invoiceData.invoiceNumber}-${formattedDateTime.value}.xlsx`
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' })
    saveAs(blob, filename)
  }

  return {
    now,
    invoiceData,
    total,
    balance,
    change,
    formattedDateTime,
    formattedDate,
    updateDateFromInput,
    updatePaidAmount,
    startClock,
    stopClock,
    addItem,
    removeItem,
    updateItemTotal,
    uploadLogo,
    downloadPDF,
    downloadExcel,
    downloadImage
  }
})
