import Swal from "sweetalert2";

// ------------------------------------------------------------------------------------

export function fireSweetalert(icon, title, html) {
    Swal.fire({
        title: title,
        icon: icon,
        html: html,
        showCloseButton: true,
        showCancelButton: false,
        showConfirmButton: false,
        focusConfirm: false,
    });
}
