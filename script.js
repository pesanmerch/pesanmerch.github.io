document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('form-pemesanan');
  const sendButton = document.getElementById('sendButton');

  if (form) {
    console.log('Form ditemukan:', form);

    function validateForm() {
      const isValid = form.checkValidity();
      sendButton.disabled = !isValid;
    }

    validateForm();

    document.querySelectorAll('input').forEach((input) => {
      input.addEventListener('input', validateForm);
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      const formData = new FormData(event.target);
      const reader = new FileReader();

      reader.onload = function () {
        const base64Image = reader.result.split(',')[1];

        fetch(
          'https://script.google.com/macros/s/AKfycby_pyRI3iKmlWVjhkTaq3pe-uU5mbQ7Q1aQmW12seES30LHZl1UqwS7LYNuB3d23Qrf/exec',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              nama: formData.get('nama'),
              nomor_hp: formData.get('nomor_hp'),
              paket: formData.get('paket'),
              ukuran: formData.get('ukuran'),
              buktiTransfer: base64Image,
            }),
          }
        )
          .then((response) => response.text())
          .then((data) => {
            alert('Data berhasil dikirim: ' + data);
            form.reset();
            sendButton.disabled = true;
          })
          .catch((error) => {
            console.error('Error:', error);
            alert('Terjadi kesalahan saat mengirim data. Silakan coba lagi.');
          });
      };

      const fileInput = formData.get('bukti_transfer');
      if (fileInput) {
        reader.readAsDataURL(fileInput);
      }
    });
  } else {
    console.error('Form tidak ditemukan di DOM');
  }
});
