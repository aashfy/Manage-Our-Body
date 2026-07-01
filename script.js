// --- 1. LOGIKA INTERAKTIF UPLOAD FOTO PROFIL ---
const avatarContainer = document.getElementById("avatar-container");
const avatarInput = document.getElementById("avatar-input");
const avatarImg = document.getElementById("avatar-img");

const savedAvatar = localStorage.getItem("user-avatar-data");
if (savedAvatar) {
  if (avatarImg) avatarImg.src = savedAvatar;
}

if (avatarContainer) {
  avatarContainer.addEventListener("click", () => {
    if (avatarInput) avatarInput.click();
  });
}

if (avatarInput) {
  avatarInput.addEventListener("change", event => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        if (avatarImg) avatarImg.src = e.target.result;
        localStorage.setItem("user-avatar-data", e.target.result);
      };
      reader.readAsDataURL(file);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  // --- 1. AMBIL ELEMEN (ID SUDAH SAMA DENGAN HTML MAS UBAY) ---
  const btnPengaturan = document.getElementById("btn-buka-pengaturan");
  const halPengaturan = document.getElementById("halaman-pengaturan");
  const btnKembali = document.getElementById("btn-kembali-profil");

  const menuTombol = document.querySelectorAll(".bottom a");
  const semuaHalamanUtama = document.querySelectorAll(".page-content");

  // --- 2. LOGIKA NAVIGASI MENU BAWAH ---
  menuTombol.forEach((tombol, indeks) => {
    tombol.addEventListener("click", event => {
      event.preventDefault();

      // Sembunyikan semua halaman utama (.page-content)
      semuaHalamanUtama.forEach(halaman => {
        halaman.classList.remove("active");
        halaman.style.display = "none";
      });

      // Sembunyikan juga halaman pengaturan
      if (halPengaturan) {
        halPengaturan.classList.remove("active");
        halPengaturan.style.display = "none";
      }

      // Tampilkan halaman menu bawah yang sesuai indeksnya
      if (semuaHalamanUtama[indeks]) {
        semuaHalamanUtama[indeks].classList.add("active");
        semuaHalamanUtama[indeks].style.display = "block";
      }
    });
  });

  // --- 3. LOGIKA TOMBOL PENGATURAN ⚙️ ---
  if (btnPengaturan) {
    btnPengaturan.addEventListener("click", () => {
      // Sembunyikan semua halaman utama biar tidak tumpang tindih
      semuaHalamanUtama.forEach(halaman => {
        halaman.classList.remove("active");
        halaman.style.display = "none";
      });

      // Paksa munculkan halaman pengaturan
      if (halPengaturan) {
        halPengaturan.classList.add("active");
        halPengaturan.style.display = "block";
      }
    });
  }

  // --- 4. LOGIKA TOMBOL KEMBALI TO PROFIL ⬅️ ---
  if (btnKembali) {
    btnKembali.addEventListener("click", () => {
      // Sembunyikan halaman pengaturan
      if (halPengaturan) {
        halPengaturan.classList.remove("active");
        halPengaturan.style.display = "none";
      }
      // Munculkan kembali halaman profil utama (Index 4 = page-profile)
      if (semuaHalamanUtama[4]) {
        semuaHalamanUtama[4].classList.add("active");
        semuaHalamanUtama[4].style.display = "block";
      }
    });
  }

  // --- 5. LOGIKA INTERAKTIF DARK / LIGHT MODE ---
  const toggleMode = document.getElementById("toggle-darkmode");

  /* Cek penyimpanan browser, kalau sebelumnya user 
       pilih light mode, langsung pasang otomatis */
  if (localStorage.getItem("tema-aplikasi") === "light") {
    document.body.classList.add("light-mode");
    if (toggleMode) toggleMode.checked = true;
  }

  /* Jalankan fungsi ganti tema saat switch digeser */
  if (toggleMode) {
    toggleMode.addEventListener("change", () => {
      if (toggleMode.checked) {
        document.body.classList.add("light-mode");
        localStorage.setItem("tema-aplikasi", "light"); // Simpan status
      } else {
        document.body.classList.remove("light-mode");
        localStorage.setItem("tema-aplikasi", "dark"); // Simpan status
      }
    });
  }

  /* ==========================
   SISTEM MULTI BAHASA
========================== */

  const languageSelect = document.getElementById("language-select");

  const translations = {
    id: {
      /*profil atas*/
      profile: "Profil",
      personal_info: "Informasi Pribadi",
      store: "Toko",
      achievement: "Pencapaian",
      widgets: "Widget",
      
      
      /*profil bawah*/
      general: "Umum",
      help: "Bantuan",
      settings: "Pengaturan",
      about: "Tentang",
      appearance: "Tampilan & Bahasa",
      display: "Tampilan Sistem",
      language: "Bahasa",
      accessibility: "Aksesibilitas",
      notification: "Notifikasi",
      units: "Pengukuran",
    },

    en: {
      /*profil atas*/
      profile: "Profile",
      personal_info: "Personal Information",
      store: "Store",
      achievements: "Achievements",
      widgets: " Widgets",
      
      
      /*profil bawah*/
      general: "General",
      help: "Help",
      settings: "Settings",
      about: "About",
      appearance: "Display & Language",
      display: "Display",
      language: "Language",
      accessibility: "Accessibility",
      notification: "Notification",
      units: "Units",
    }
  };

  function changeLanguage(language) {
    const elements = document.querySelectorAll("[data-lang]");

    elements.forEach(element => {
      const key = element.getAttribute("data-lang");

      if (translations[language] && translations[language][key]) {
        element.innerText = translations[language][key];
      }
    });

    localStorage.setItem("app-language", language);
  }

  /* Ambil bahasa terakhir */
  const savedLanguage = localStorage.getItem("app-language") || "id";

  changeLanguage(savedLanguage);

  if (languageSelect) {
    languageSelect.value = savedLanguage;

    languageSelect.addEventListener("change", () => {
      changeLanguage(languageSelect.value);
    });
  }
}); // <-- Ini baris 65 (Penutup bawaan script.js Mas Ubay, biarkan tetap di bawah)
