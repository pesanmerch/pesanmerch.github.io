document.addEventListener('DOMContentLoaded', function () {
  // Mengambil elemen form
  const form = document.getElementById('form-pemesanan'); // Pastikan ID sesuai dengan form
  const sendButton = document.getElementById('sendButton');

  // Mengecek apakah form ditemukan
  if (form) {
      console.log('Form ditemukan:', form);

      // Fungsi untuk memvalidasi form dan mengaktifkan tombol kirim
      function validateForm() {
          const isValid = form.checkValidity();
          sendButton.disabled = !isValid;
      }

      // Memanggil validateForm saat halaman dimuat
      validateForm();

      // Menambahkan event listener pada setiap input untuk memvalidasi form setiap perubahan
      document.querySelectorAll('input').forEach(input => {
          input.addEventListener('input', validateForm);
      });

      // Event listener untuk saat form disubmit
      form.addEventListener('submit', function (event) {
          event.preventDefault(); // Mencegah form dikirim secara default

          // Mengambil data form
          const formData = new FormData(event.target);
          const reader = new FileReader();

          reader.onload = function () {
              const base64Image = reader.result.split(',')[1]; // Mengambil base64 dari hasil pembacaan file

              // Mengirim data ke Google Apps Script (ganti URL dengan URL yang benar)
              fetch('https://script.google.com/macros/s/AKfycbw93GBzPz8BLrgZ8T1_evrlSg0dxT55yGWHXK08VmY-_kAoXdwWRqK5c6JBCUrdJKlKp/exec', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/x-www-form-urlencoded',
                  },
                  body: new URLSearchParams({
                      nama: formData.get('nama'),
                      nomor_hp: formData.get('nomor_hp'),
                      paket: formData.get('paket'),
                      ukuran: formData.get('ukuran'),
                      buktiTransfer: base64Image, // Mengirim gambar sebagai base64
                  }),
              })
              .then(response => response.text())
              .then(data => {
                  alert('Data berhasil dikirim: ' + data);
                  form.reset(); // Reset form setelah submit
                  sendButton.disabled = true; // Disable kembali tombol kirim
              })
              .catch(error => {
                  console.error('Error:', error);
                  alert('Terjadi kesalahan saat mengirim data. Silakan coba lagi.');
              });
          };

          // Membaca file bukti transfer
          const fileInput = formData.get('bukti_transfer');
          if (fileInput) {
              reader.readAsDataURL(fileInput); // Membaca file sebagai base64
          }
      });
  } else {
      console.error('Form tidak ditemukan di DOM');
  }
});
