document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("form-pemesanan");
  const sendButton = document.getElementById("sendButton");
  const loadingIndicator = document.getElementById("loading-indicator");
  const successPopup = document.getElementById("success-popup");
  const errorPopup = document.getElementById("error-popup");
  const lightboxLinks = document.querySelectorAll('.lightbox-link');
  const closeButtons = document.querySelectorAll('.close');

  function calculateTotalPrice() {
    let totalPrice = 0;
    const selectedPaket = document.querySelector('input[name="paket"]:checked');
    const selectedUkuran = document.querySelector('input[name="ukuran"]:checked');
    const selectedLengan = document.querySelector('input[name="lengan"]:checked');

    if (selectedPaket) {
      switch (selectedPaket.value) {
        case 'paket1': totalPrice += 110000; break;
        case 'paket2': totalPrice += 130000; break;
        case 'paket3': totalPrice += 150000; break;
        case 'paket4': totalPrice += 170000; break;
      }
    }

    if (selectedUkuran) {
      switch (selectedUkuran.value) {
        case 'XXL': totalPrice += 5000; break;
        case 'XXXL': totalPrice += 10000; break;
      }
    }

    if (selectedLengan && selectedLengan.value === 'panjang') {
      totalPrice += 10000;
    }

    return totalPrice;
  }

  function updateTotalPrice() {
    const totalPrice = calculateTotalPrice();
    const totalPriceElement = document.getElementById('total-price');
    if (totalPriceElement) {
      totalPriceElement.textContent = `Total Harga: RP${totalPrice.toLocaleString('id-ID')}`;
    }
  }

  const radioButtons = document.querySelectorAll('input[type="radio"]');
  radioButtons.forEach(radio => {
    radio.addEventListener('change', updateTotalPrice);
  });

  if (form) {
    function validateForm() {
      const isValid = form.checkValidity();
      sendButton.disabled = !isValid;
    }

    validateForm();

    document.querySelectorAll("input").forEach((input) => {
      input.addEventListener("input", validateForm);
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      loadingIndicator.style.display = "block"; // Tampilkan loading

      const formData = new FormData(event.target);
      const reader = new FileReader();

      reader.onload = function () {
        const base64Image = reader.result.split(",")[1];

        const lenganValue = formData.get("lengan");
        console.log("Lengan:", lenganValue);

        fetch(
          "https://script.google.com/macros/s/AKfycbzOz-alLf-YR_yqyF9SvYt-fL5Uqw1u6zcJFmTmEYKWG6FmS2Rys2WboZEpcnb8ac8P/exec",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              nama: formData.get("nama"),
              nomor_hp: formData.get("nomor_hp"),
              paket: formData.get("paket"),
              ukuran: formData.get("ukuran"),
              lengan: formData.get("lengan"),
              buktiTransfer: base64Image, // Data yang dikirim
            }),
          }
        )
          .then((response) => {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
              return response.json();
            } else {
              return response.text();
            }
          }) // Pastikan respons diubah ke JSON
          .then((data) => {
            console.log("Server response:", data);
            loadingIndicator.style.display = "none";
            if (typeof data === "object" && data.status === "success") {
              successPopup.style.display = "block";
            } else if (data === "Success") {
              successPopup.style.display = "block";
            } else {
              errorPopup.style.display = "block";
            }
            form.reset();
            sendButton.disabled = true;
          })
          .catch((error) => {
            loadingIndicator.style.display = "none";
            errorPopup.style.display = "block"; // Tampilkan popup error
            console.error("Error:", error);
          });
      };

      const fileInput = formData.get("bukti_transfer");
      if (fileInput) {
        reader.readAsDataURL(fileInput);
      }
    });
  } else {
    console.error("Form tidak ditemukan di DOM");
  }

  lightboxLinks.forEach(link => {
    link.addEventListener('click', function(event) {
      event.preventDefault();
  
      const lightboxId = this.getAttribute('href');
      const lightbox = document.querySelector(lightboxId);
  
      lightbox.classList.add('show');
    });
  });

  closeButtons.forEach(button => {
    button.addEventListener('click', function() {
      this.parentElement.classList.remove('show');
    });
  });

  document.querySelectorAll('.lightbox').forEach(lightbox => {
    lightbox.addEventListener('click', function(event) {
      if (event.target === this) {
        this.classList.remove('show');
      }
    });
  });

  updateTotalPrice();
});

function closePopup(popupId) {
  const popup = document.getElementById(popupId);
  if (popup) {
    popup.style.display = "none";
  }
}

