// src/utils/useAlert.js
import Swal from 'sweetalert2'

export function useAlert() {
  // ALERTA SIMPLES
  const alert = ({
    title = 'Aviso',
    text = '',
    icon = 'info', // 'success' | 'error' | 'warning' | 'info' | 'question'
    confirmButtonText = 'OK',
    ...rest
  } = {}) => {
    return Swal.fire({
      title,
      text,
      icon,
      confirmButtonText,
      ...rest
    })
  }

  // TOAST (notificação curta no topo)
  const toast = ({
    title = '',
    icon = 'success',
    timer = 3000,
    position = 'top-end',
    showConfirmButton = false,
    ...rest
  } = {}) => {
    return Swal.fire({
      toast: true,
      position,
      icon,
      title,
      showConfirmButton,
      timer,
      ...rest
    })
  }

  // CONFIRMAÇÃO COM CANCELAR
  const confirm = ({
    title = 'Tem certeza?',
    text = '',
    icon = 'warning',
    confirmButtonText = 'Sim',
    cancelButtonText = 'Cancelar',
    confirmButtonColor = '#d33',
    cancelButtonColor = '#3085d6',
    showCancelButton = true,
    ...rest
  } = {}) => {
    return Swal.fire({
      title,
      text,
      icon,
      showCancelButton,
      confirmButtonText,
      cancelButtonText,
      confirmButtonColor,
      cancelButtonColor,
      ...rest
    })
  }

  // LOADER
  const loading = ({
    title = 'Carregando...',
    allowOutsideClick = false,
    allowEscapeKey = false,
    showConfirmButton = false,
    didOpen = () => {
      Swal.showLoading()
    },
    ...rest
  } = {}) => {
    return Swal.fire({
      title,
      allowOutsideClick,
      allowEscapeKey,
      showConfirmButton,
      didOpen,
      ...rest
    })
  }

  // FECHAR MANUALMENTE
  const close = () => Swal.close()

  return {
    alert,
    toast,
    confirm,
    loading,
    close
  }
}
