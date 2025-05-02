import { defineStore } from 'pinia'
import axios from 'axios'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    themes: [],
    currentTheme: null,

    // mapeamento de temas padrão, chave = nome do template
    initialThemes: {
      DefaultTemplate: {
        colors: {
          uiPrimary:   '#000000',
          uiPrimaryText: '#ffff',
          uiSecondary: '#DEF',
          uiBackground: '#FFFFFF',
          uiSurface:   '#EEEEEE',
          uiText:      '#333333'
        }
      },
      SecondTemplate: {
        colors: {
          uiPrimary:   '#FF5722',
          uiSecondary: '#E64A19',
          uiBackground:'#FFF3E0',
          uiSurface:   '#FFFFFF',
          uiText:      '#212121'
        }
      },
      ThirdTemplate: {
        colors: {
          uiPrimary:   '#3F51B5',
          uiSecondary: '#303F9F',
          uiBackground:'#E8EAF6',
          uiSurface:   '#FFFFFF',
          uiText:      '#1A237E'
        }
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
      localStorage.setItem('selected-theme-id', theme.id || 'initial')

      const colors = theme.colors
      if (!colors) {
        console.warn('O tema não contém cores válidas:', theme)
        return
      }

      document.documentElement.style.setProperty('--ui-primary',    colors.uiPrimary)
      document.documentElement.style.setProperty('--ui-primary-text',    colors.uiPrimaryText)
      document.documentElement.style.setProperty('--ui-secondary',  colors.uiSecondary)
      document.documentElement.style.setProperty('--ui-secondary-text',  colors.uiSecondaryText)
      document.documentElement.style.setProperty('--ui-background', colors.uiBackground)
      document.documentElement.style.setProperty('--ui-surface',    colors.uiSurface)
      document.documentElement.style.setProperty('--ui-text',       colors.uiText)

    },

    // aplica o tema inicial configurado no store
    applyInitialTheme(templateName) {
      const theme = this.initialThemes[templateName]
      if (!theme) {
        console.warn(`Nenhum tema inicial definido para "${templateName}"`)
        return
      }
      this.applyTheme(theme)
    },

    toggleTheme(index = null) {
      if (!this.themes.length) {
        console.warn('Nenhum tema carregado ainda. Buscando...')
        return this.fetchThemes().then(() => this.toggleTheme(index))
      }
    
      if (index !== null && this.themes[index]) {
        // Se passar índice válido, aplica diretamente
        this.applyTheme(this.themes[index])
      } else {
        // Senão, alterna para o próximo
        const currentIdx = this.themes.findIndex(t => t.id === this.currentTheme?.id)
        const next = this.themes[(currentIdx + 1) % this.themes.length]
        this.applyTheme(next)
      }
    }
    
  }
})
