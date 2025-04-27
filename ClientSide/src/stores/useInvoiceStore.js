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
    timer = setInterval(() => {
      now.value = new Date()
    }, 1000)
  }

  function stopClock() {
    clearInterval(timer)
  }

 // Método para atualizar a data
 function updateDateFromInput(dateStr) {
  // Convertendo a string do input para Date
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
    const datepickers = document.querySelectorAll('.dp__menu') // classe do menu do vue3-datepicker
    datepickers.forEach(el => el.style.display = 'none') // fecha o menu se estiver aberto
    const element = document.getElementById('receipt')
    const clonedElement = element.cloneNode(true)

    // ⬇️ Criar espaço no final para não colidir com o rodapé
    clonedElement.style.paddingBottom = '60px'; // ou '5mm' / '20px' etc.

    const style = document.createElement('style')
    style.innerHTML = `
      .add, .cut, #downloadBtn { display: none !important; }
      .page-break { page-break-before: always; break-before: page; }
      .dp__menu { display: none !important; }
      #floating-items { display: none !important; }
    `
    clonedElement.appendChild(style)

    html2pdf()
      .set({ 
        filename: `${invoiceData.client.name}-${invoiceData.invoiceNumber}-${formattedDateTime.value}.pdf` 
      })
      .from(clonedElement)
      .toPdf()
      .get('pdf')
      .then((pdf) => {
        const totalPages = pdf.internal.getNumberOfPages()
        for (let i = 1; i <= totalPages; i++) {
          pdf.setPage(i)
          pdf.setFontSize(10)
          pdf.text(`${i} / ${totalPages}`, 10, pdf.internal.pageSize.getHeight() - 10)
          pdf.text(`Processado por computador ${formattedDateTime.value}` + " | @eFacturas", 55, pdf.internal.pageSize.getHeight() - 10)

          if (i > 1) {
            pdf.internal.pageSize.height += 10
          }
        }
      })
      .save()
  }


  
  function downloadImage() {
    const invoiceElement = document.getElementById('receipt')
    if (!invoiceElement) {
      console.warn('Elemento #receipt não encontrado.')
      return
    }
    const height = invoiceElement.scrollHeight
    console.log('Altura do elemento:', height)
  
    // ⬇️ Oculta temporariamente os elementos indesejados
    const elementsToHide = [
      ...document.querySelectorAll('.add, .cut, #downloadBtn, .dp__menu, .floating')
    ]
  
    if (height > 2000) {
      alert("O documento é muito longo para ser exportado como imagem. Por favor, use a opção PDF.")
      return
    }
    elementsToHide.forEach(el => el.style.display = 'none')
  
    // ⬇️ Cria um elemento temporário de rodapé
    const footer = document.createElement('div')
    footer.innerText = `Processado por computador ${formattedDateTime.value} | @eFacturas`
    footer.style.textAlign = 'center'
    footer.style.fontSize = '12px'
    footer.style.marginTop = '40px'
    footer.style.color = '#666'
    invoiceElement.appendChild(footer)
  
    // ⬇️ Gera a imagem
    html2canvas(invoiceElement, {
      scale: 2,
      useCORS: true
    }).then(canvas => {
      
      // console.log('Canvas height 1:', height)
      // console.log('Canvas height:', canvas.height)
      const link = document.createElement('a')
      link.download = `${invoiceData.client.name}-${invoiceData.invoiceNumber}-${formattedDateTime.value}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
  
      // ⬇️ Restaura tudo
      elementsToHide.forEach(el => el.style.display = '')
      invoiceElement.removeChild(footer)
    }).catch(err => {
      console.error('Erro ao gerar imagem:', err)
      elementsToHide.forEach(el => el.style.display = '')
      if (footer.parentNode) invoiceElement.removeChild(footer)
    })
  }
  
  



  function downloadExcel() {
    console.log('📥 Baixando Excel...')

    // ⬇️ Obtém o DOM da seção da fatura
    const invoiceElement = document.getElementById('receipt')
    if (!invoiceElement) {
      console.warn('Elemento #invoice não encontrado.')
      return
    }

    // ⬇️ Tenta localizar uma <table> dentro do invoice (recomendado)
    const table = invoiceElement.querySelector('table')
    if (!table) {
      console.warn('Nenhuma tabela encontrada dentro de #invoice.')
      return
    }

    // ⬇️ Converte a tabela DOM em planilha
    const workbook = XLSX.utils.table_to_book(table, { sheet: 'Fatura' })

    // ⬇️ Define nome do ficheiro
    const filename = `${invoiceData.client.name}-${invoiceData.invoiceNumber}-${formattedDateTime.value}.xlsx`

    // ⬇️ Gera e salva
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
