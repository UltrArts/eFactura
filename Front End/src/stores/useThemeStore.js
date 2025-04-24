import { defineStore } from 'pinia'
import axios from 'axios'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    themes: [],
    currentTheme: null,

    // mapeamento de temas padrão, chave = nome do template
    initialThemes: {
      DefaultTemplate: {
        uiPrimary:   '#000',
        uiSecondary: '#FFF',
        uiBackground: '#FFF',
        uiSurface:   '#EEE',
        uiText:      '#333333'
      },
      SecondTemplate: {
        uiPrimary:   '#FF5722',
        uiSecondary: '#E64A19',
        uiBackground:'#FFF3E0',
        uiSurface:   '#FFFFFF',
        uiText:      '#212121'
      },
      ThirdTemplate: {
        uiPrimary:   '#3F51B5',
        uiSecondary: '#303F9F',
        uiBackground:'#E8EAF6',
        uiSurface:   '#FFFFFF',
        uiText:      '#1A237E'
      }
      // adicione quantos templates precisar...
    }
  }),

  actions: {
    async fetchThemes() {
      const res = await axios.get('http://localhost:3001/themes')
      this.themes = res.data
    },

    applyTheme(theme) {

      this.currentTheme = theme
      localStorage.setItem('selected-theme-id', theme.id)
      document.documentElement.style.setProperty('--ui-primary',    theme.uiPrimary)
      document.documentElement.style.setProperty('--ui-secondary',  theme.uiSecondary)
      document.documentElement.style.setProperty('--ui-background', theme.uiBackground)
      document.documentElement.style.setProperty('--ui-surface',    theme.uiSurface)
      document.documentElement.style.setProperty('--ui-text',       theme.uiText)
      console.log(`Tema aplicado: ${theme.name}`)

    },

    // aplica o tema padrão configurado em initialThemes[templateName]
    applyInitialTheme(templateName) {
      const theme = this.initialThemes[templateName]
      if (!theme) {
        console.warn(`Nenhum tema inicial definido para "${templateName}"`)
        return
      }
      this.applyTheme(theme)
    },

    toggleTheme() {
      if (!this.themes.length) return this.fetchThemes().then(() => this.toggleTheme())

      const idx = this.themes.findIndex(t => t.id === this.currentTheme?.id)
      const next = this.themes[(idx + 1) % this.themes.length]
      this.applyTheme(next)
    }
  }
})
