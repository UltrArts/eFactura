<template >
  <div>
    <!-- HELLO -->
    <DefaultTemplate />
  </div>
</template>

<script>
import html2pdf from "html2pdf.js";
import svgLogo from "@/assets/logo.svg";
import DefaultTemplate from "@/components/DefaultTemplate.vue";
export default {
  components:{
    DefaultTemplate,
  },
  data() {
    return {
      now: new Date(),
      timer: null,
      invoiceData: {
        company: { name: "UltrArts", address: "Maputo, Mz.", phone: "87 90 50 653", website: "website.com" },
        client: { name: "Nome do Cliente", phone: "123456789", address: "Rua 123" },
        invoiceNumber: "101138",
        date: this.formattedDate,
        items: [{ name: "Front End Consultation", description: "Experience Review", price: 0, quantity: 0, total: 0 }],
        paid: 0,
        notes: "Obrigado por comprar connosco. Volte sempre.",
        currency: "MZN",
        logo: svgLogo,
        }
    };
  },
  mounted() {
      this.timer = setInterval(() => {
        this.now = new Date();
      }, 1000);
    },
    beforeUnmount() {
      clearInterval(this.timer);
  },
  computed: {
    total() {
      return this.invoiceData.items.reduce((sum, item) => sum + item.total, 0);
    },
    balance() {
      if(this.invoiceData.paid === undefined || this.invoiceData.paid === null || this.invoiceData.paid === 0) {
        return this.total * -1;
      }
      return this.total - this.invoiceData.paid;
    },
    formattedDateTime() {
       return this.now.toLocaleString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
      });
    },
    formattedDate() {
       return this.now.toLocaleString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
      });
    }
  },
  methods: {
    addItem() {
      this.invoiceData.items.push({ name: "", description: "", price: 0, quantity: 1, total: 0 });
    },
    removeItem(index) {
      this.invoiceData.items.splice(index, 1);
    },
    updateItemTotal(index, event, field) {
      let value = parseFloat(event.target.innerText) || 0;
      this.invoiceData.items[index][field] = value;
      this.invoiceData.items[index].total = this.invoiceData.items[index].price * this.invoiceData.items[index].quantity;
    },
    uploadLogo(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.invoiceData.logo = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
    downloadPDF() {
      const element = document.getElementById("receipt");
      const clonedElement = element.cloneNode(true);
      const style = document.createElement("style");
      style.innerHTML = ".add, .cut { display: none !important; } #downloadBtn{ display: none !important; }";
      clonedElement.appendChild(style);
      html2pdf().set({
        filename: this.invoiceData.client.name + "-" + this.invoiceData.invoiceNumber + "-"+this.formattedDateTime+".pdf"
      }).from(clonedElement)
      .toPdf()
      .get('pdf')
      .then((pdf) => {
          const totalPages = pdf.internal.getNumberOfPages();
          for (let i = 1; i <= totalPages; i++) {
              pdf.setPage(i);
              pdf.setFontSize(10);
              pdf.text(`${i} / ${totalPages}`, 10, pdf.internal.pageSize.getHeight() - 10, { baseline: 'bottom' }); // Left side
              pdf.text("Processado por computador "+ this.formattedDateTime, 65, pdf.internal.pageSize.getHeight() - 15, { baseline: 'bottom' }); // Left side
          
              // Increase margin-top by 10px from the second page onwards
              if (i > 1) {
                  pdf.internal.pageSize.height += 10;
              }
          }
      })
      .save();
    }
  }
};
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
