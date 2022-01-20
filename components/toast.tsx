import Swal from "sweetalert2"

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    allowOutsideClick: true,
    showCloseButton: true,
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
})

export default Toast 