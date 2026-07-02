/* ==========================================================================
   SISTEM DASHBOARD UTAMA - TODO APP MAS UBAY (FIXED & STABLE)
   ========================================================================== */

// 1. Inisialisasi Database Lokal Tugas (Mengambil data lama jika ada)
let databaseTugas = JSON.parse(localStorage.getItem("app_todo_ubay")) || [];

// 2. Ambil Elemen-Elemen Global
const wrapper = document.getElementById("calendar-wrapper");
const btnHariIni = document.getElementById("btn-hari-ini");
const languageSelect = document.getElementById("language-select");
const wadahListDashboard = document.getElementById("dashboard-todo-container");

const hariIni = new Date();
let tanggalTerpilih = new Date(hariIni);

// ==========================================
// LOGIKA INTERAKTIF KALENDER UTAMA
// ==========================================
function inisialisasiKalender() {
  if (!wrapper) return;
  wrapper.innerHTML = "";

  // Mengambil memori bahasa aktif agar tidak amnesia saat direfresh
  let bahasaAktif = localStorage.getItem("app-language") || (languageSelect ? languageSelect.value : "id");
  if (bahasaAktif !== "id" && bahasaAktif !== "en") bahasaAktif = "id";

  const namaHari =
    bahasaAktif === "en"
      ? ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
      : ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

  for (let i = -15; i <= 15; i++) {
    const tanggalTarget = new Date();
    tanggalTarget.setDate(hariIni.getDate() + i);

    const kartu = document.createElement("div");
    kartu.classList.add("date-card");

    const statusHariIni =
      tanggalTarget.toDateString() === hariIni.toDateString();
    if (statusHariIni) kartu.classList.add("today");

    const statusTerpilih =
      tanggalTarget.toDateString() === tanggalTerpilih.toDateString();
    if (statusTerpilih) kartu.classList.add("active");

    kartu.innerHTML = `
        <span class="day-name">${namaHari[tanggalTarget.getDay()]}</span>
        <span class="day-num">${String(tanggalTarget.getDate()).padStart(2, "0")}</span>
    `;

    kartu.dataset.dateStr = tanggalTarget.toDateString();

    // SINKRONISASI REALTIME: Saat klik tanggal, langsung panggil render tugas
    kartu.addEventListener("click", () => {
      tanggalTerpilih = new Date(kartu.dataset.dateStr);
      perbaruiSeleksiKalender();
      renderTugasKeDashboard();
    });

    wrapper.appendChild(kartu);

    if (statusHariIni) {
      setTimeout(() => {
        kartu.scrollIntoView({
          behavior: "auto",
          block: "nearest",
          inline: "center"
        });
      }, 150);
    }
  }
}

function perbaruiSeleksiKalender() {
  const semuaKartu = wrapper.querySelectorAll(".date-card");

  semuaKartu.forEach(kartu => {
    if (kartu.dataset.dateStr === tanggalTerpilih.toDateString()) {
      kartu.classList.add("active");
      kartu.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center"
      });
    } else {
      kartu.classList.remove("active");
    }
  });

  if (tanggalTerpilih.toDateString() === hariIni.toDateString()) {
    if (btnHariIni) btnHariIni.style.display = "none";
  } else {
    if (btnHariIni) btnHariIni.style.display = "flex";
  }
}

if (btnHariIni) {
  btnHariIni.addEventListener("click", () => {
    tanggalTerpilih = new Date(hariIni);
    perbaruiSeleksiKalender();
    renderTugasKeDashboard();
  });
}

/* ==========================================
   INTERAKSI POPUP MODAL TAMBAH TUGAS
   ========================================== */
const fabTugas = document.getElementById("fab-tambah-tugas");
const modalOverlayTugas = document.getElementById("modal-overlay-tugas");
const btnBatalTugas = document.getElementById("btn-batal-tugas");
const btnSimpanTugas = document.getElementById("btn-simpan-tugas");
const inputJudulTugas = document.getElementById("input-judul-tugas");
const setelanTanggal = document.getElementById("setelan-tanggal");
const setelanUlangi = document.getElementById("setelan-ulangi");
const panelUlangiKustom = document.getElementById("panel-ulangi-kustom");

if (fabTugas && modalOverlayTugas) {
  fabTugas.addEventListener("click", () => {
    modalOverlayTugas.classList.add("aktif");

    if (setelanTanggal && typeof tanggalTerpilih !== "undefined") {
      const yyyy = tanggalTerpilih.getFullYear();
      const mm = String(tanggalTerpilih.getMonth() + 1).padStart(2, "0");
      const dd = String(tanggalTerpilih.getDate()).padStart(2, "0");
      setelanTanggal.value = `${yyyy}-${mm}-${dd}`;
    }

    setTimeout(() => {
      if (inputJudulTugas) inputJudulTugas.focus();
    }, 200);
  });
}

function tutupModalTugas() {
  if (modalOverlayTugas) {
    modalOverlayTugas.classList.remove("aktif");
    if (inputJudulTugas) inputJudulTugas.value = "";
    if (setelanUlangi) setelanUlangi.value = "none";
    if (panelUlangiKustom) panelUlangiKustom.style.display = "none";
    resetOpsiHariKustom();
  }
}

if (btnBatalTugas) {
  btnBatalTugas.addEventListener("click", tutupModalTugas);
}

if (modalOverlayTugas) {
  modalOverlayTugas.addEventListener("click", e => {
    if (e.target === modalOverlayTugas) tutupModalTugas();
  });
}

if (setelanUlangi && panelUlangiKustom) {
  setelanUlangi.addEventListener("change", () => {
    if (setelanUlangi.value === "custom") {
      panelUlangiKustom.style.display = "flex";
    } else {
      panelUlangiKustom.style.display = "none";
      resetOpsiHariKustom();
    }
  });
}

function resetOpsiHariKustom() {
  const checkboxesHari = document.querySelectorAll(".chip-hari input");
  checkboxesHari.forEach(cb => (cb.checked = false));
}

/* ==========================================================================
   EVENT LISTENER TOMBOL SIMPAN TUGAS
   ========================================================================== */
if (btnSimpanTugas) {
  btnSimpanTugas.addEventListener("click", () => {
    const judul = inputJudulTugas ? inputJudulTugas.value.trim() : "";

    if (judul === "") {
      alert("Isi tugasnya dulu, Mas Ubay!");
      return;
    }

    const kategori = document.getElementById("setelan-kategori").value;
    const tanggal = document.getElementById("setelan-tanggal").value;
    const jam = document.getElementById("setelan-jam").value;
    const pengingat = document.getElementById("setelan-pengingat").value;
    const ulangi = setelanUlangi ? setelanUlangi.value : "none";

    let hariKustomSelected = [];
    if (ulangi === "custom") {
      const checkedBoxes = document.querySelectorAll(".chip-hari input:checked");
      checkedBoxes.forEach(cb => hariKustomSelected.push(parseInt(cb.value)));
    }

    const tugasBaru = {
      id: Date.now(),
      judul: judul,
      kategori: kategori,
      tanggal: tanggal,
      jam: jam,
      pengingat: pengingat,
      ulangi: ulangi,
      hariKustom: hariKustomSelected,
      isDone: false
    };

    databaseTugas.push(tugasBaru);
    localStorage.setItem("app_todo_ubay", JSON.stringify(databaseTugas));

    tutupModalTugas();
    renderTugasKeDashboard();
  });
}

/* ==========================================================================
   FUNGSI HITUNG AKUMULASI MINGGUAN (FIXED)
   ========================================================================== */
function perbaruiAkumulasiMingguan() {
  const angkaTerlaksana = document.getElementById("acc-terlaksana");
  const angkaTertunda = document.getElementById("acc-tertunda");

  // Jika elemen tidak ditemukan di DOM, keluar secara aman agar tidak memicu crash navigasi
  if (!angkaTerlaksana || !angkaTertunda) return;

  const targetDate = new Date(tanggalTerpilih);
  const currentDay = targetDate.getDay();

  const senin = new Date(targetDate);
  senin.setDate(targetDate.getDate() - (currentDay === 0 ? 6 : currentDay - 1));
  senin.setHours(0, 0, 0, 0);

  const minggu = new Date(senin);
  minggu.setDate(senin.getDate() + 6);
  minggu.setHours(23, 59, 59, 999);

  let terlaksanaCount = 0;
  let tertundaCount = 0;

  databaseTugas.forEach(tugas => {
    const tglTugas = new Date(tugas.tanggal);
    if (tglTugas >= senin && tglTugas <= minggu) {
      if (tugas.isDone) {
        terlaksanaCount++;
      } else {
        tertundaCount++;
      }
    }
  });

  angkaTerlaksana.innerText = terlaksanaCount;
  angkaTertunda.innerText = tertundaCount;
}

/* ==========================================================================
   FUNGSI UTAMA RENDER TUGAS (BILINGUAL FIXED)
   ========================================================================== */
function renderTugasKeDashboard() {
  if (!wadahListDashboard) return;

  wadahListDashboard.innerHTML = "";

  let bahasaAktif = localStorage.getItem("app-language") || "id";
  if (bahasaAktif !== "id" && bahasaAktif !== "en") bahasaAktif = "id";

  const kamusDashboard = {
    id: {
      important: "IMPORTANT (PENTING)",
      normal: "NORMAL",
      optional: "OPTIONAL (OPSIONAL)",
      kosong: "Gak ada tugas di kategori ini 😎"
    },
    en: {
      important: "IMPORTANT",
      normal: "NORMAL",
      optional: "OPTIONAL",
      kosong: "No tasks in this category 😎"
    }
  };

  let tanggalAktifString = "";
  if (typeof tanggalTerpilih !== "undefined" && tanggalTerpilih !== null) {
    const yyyy = tanggalTerpilih.getFullYear();
    const mm = String(tanggalTerpilih.getMonth() + 1).padStart(2, "0");
    const dd = String(tanggalTerpilih.getDate()).padStart(2, "0");
    tanggalAktifString = `${yyyy}-${mm}-${dd}`;
  } else {
    const yyyy = hariIni.getFullYear();
    const mm = String(hariIni.getMonth() + 1).padStart(2, "0");
    const dd = String(hariIni.getDate()).padStart(2, "0");
    tanggalAktifString = `${yyyy}-${mm}-${dd}`;
  }

  const listHariIni = databaseTugas.filter(tugas => tugas.tanggal === tanggalAktifString);

  const kelompok = {
    important: listHariIni.filter(t => {
      const kat = (t.kategori || "").toLowerCase();
      return kat === "important" || kat === "penting";
    }),
    normal: listHariIni.filter(t => {
      const kat = (t.kategori || "").toLowerCase();
      return kat === "normal";
    }),
    optional: listHariIni.filter(t => {
      const kat = (t.kategori || "").toLowerCase();
      return kat === "optional" || kat === "opsional";
    })
  };

  const urutanKlasifikasi = [
    { kunci: "important", label: kamusDashboard[bahasaAktif].important },
    { kunci: "normal",    label: kamusDashboard[bahasaAktif].normal },
    { kunci: "optional",  label: kamusDashboard[bahasaAktif].optional }
  ];

  urutanKlasifikasi.forEach(grup => {
    const boxKategori = document.createElement("div");
    boxKategori.className = `box-kategori-permanen wadah-${grup.kunci}`;

    const headerKategori = document.createElement("div");
    headerKategori.className = `judul-kategori ${grup.kunci}`;
    headerKategori.innerText = grup.label;
    boxKategori.appendChild(headerKategori);

    const listTugasWrapper = document.createElement("div");
    listTugasWrapper.className = "list-tugas-wrapper";

    const itemTugas = kelompok[grup.kunci];

    if (itemTugas && itemTugas.length > 0) {
      itemTugas.forEach(tugas => {
        const statusSelesai = tugas.isDone ? "selesai" : "";
        const teksWaktu = tugas.jam ? `⏰ ${tugas.jam}` : "📅 Sepanjang hari";

        const cardElement = document.createElement("div");
        cardElement.className = `card-tugas-item ${grup.kunci} ${statusSelesai}`;
        cardElement.innerHTML = `
          <div class="info-tugas">
            <span class="text-judul-tugas">${tugas.judul}</span>
            <span class="text-waktu-tugas">${teksWaktu}</span>
          </div>
          <div class="aksi-tugas-wrapper">
            <button class="btn-hapus-tugas" onclick="hapusTugas(${tugas.id})">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
            </button>
            <button class="btn-cek-tugas" onclick="toggleStatusTugas(${tugas.id})"></button>
          </div>
        `;
        listTugasWrapper.appendChild(cardElement);
      });
    } else {
      listTugasWrapper.innerHTML = `<div class="tugas-kosong-placeholder">${kamusDashboard[bahasaAktif].kosong}</div>`;
    }

    boxKategori.appendChild(listTugasWrapper);
    wadahListDashboard.appendChild(boxKategori);
  });

  perbaruiAkumulasiMingguan();
}

window.toggleStatusTugas = function (idTugas) {
  databaseTugas = databaseTugas.map(tugas => {
    if (tugas.id === idTugas) {
      tugas.isDone = !tugas.isDone;
    }
    return tugas;
  });
  localStorage.setItem("app_todo_ubay", JSON.stringify(databaseTugas));
  renderTugasKeDashboard();
};

window.hapusTugas = function (idTugas) {
  if (confirm("Tugas ini mau dihapus, Mas Ubay?")) {
    databaseTugas = databaseTugas.filter(tugas => tugas.id !== idTugas);
    localStorage.setItem("app_todo_ubay", JSON.stringify(databaseTugas));
    renderTugasKeDashboard();
  }
};

/* ==========================================================================
   SISTEM PROFIL & MULTI BAHASA (DOM CONTENT LOADED)
   ========================================================================== */
const avatarContainer = document.getElementById("avatar-container");
const avatarInput = document.getElementById("avatar-input");
const avatarImg = document.getElementById("avatar-img");

const savedAvatar = localStorage.getItem("user-avatar-data");
if (savedAvatar && avatarImg) {
  avatarImg.src = savedAvatar;
}

if (avatarContainer && avatarInput) {
  avatarContainer.addEventListener("click", () => avatarInput.click());
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
  inisialisasiKalender();
  renderTugasKeDashboard();

  const btnPengaturan = document.getElementById("btn-buka-pengaturan");
  const halPengaturan = document.getElementById("halaman-pengaturan");
  const btnKembali = document.getElementById("btn-kembali-profil");

  const menuTombol = document.querySelectorAll(".bottom a");
  const semuaHalamanUtama = document.querySelectorAll(".page-content");

  menuTombol.forEach((tombol, indeks) => {
    tombol.addEventListener("click", event => {
      event.preventDefault();
      semuaHalamanUtama.forEach(halaman => {
        halaman.classList.remove("active");
        halaman.style.display = "none";
      });
      if (halPengaturan) {
        halPengaturan.classList.remove("active");
        halPengaturan.style.display = "none";
      }
      if (semuaHalamanUtama[indeks]) {
        semuaHalamanUtama[indeks].classList.add("active");
        semuaHalamanUtama[indeks].style.display = "block";
      }
    });
  });

  if (btnPengaturan) {
    btnPengaturan.addEventListener("click", () => {
      semuaHalamanUtama.forEach(halaman => {
        halaman.classList.remove("active");
        halaman.style.display = "none";
      });
      if (halPengaturan) {
        halPengaturan.classList.add("active");
        halPengaturan.style.display = "block";
      }
    });
  }

  if (btnKembali) {
    btnKembali.addEventListener("click", () => {
      if (halPengaturan) {
        halPengaturan.classList.remove("active");
        halPengaturan.style.display = "none";
      }
      if (semuaHalamanUtama[4]) {
        semuaHalamanUtama[4].classList.add("active");
        semuaHalamanUtama[4].style.display = "block";
      }
    });
  }

  const toggleMode = document.getElementById("toggle-darkmode");
  if (localStorage.getItem("tema-aplikasi") === "light") {
    document.body.classList.add("light-mode");
    if (toggleMode) toggleMode.checked = true;
  }

  if (toggleMode) {
    toggleMode.addEventListener("change", () => {
      if (toggleMode.checked) {
        document.body.classList.add("light-mode");
        localStorage.setItem("tema-aplikasi", "light");
      } else {
        document.body.classList.remove("light-mode");
        localStorage.setItem("tema-aplikasi", "dark");
      }
    });
  }

  const translations = {
    id: {
      planning: "TUGAS", today: "Hari Ini", profile: "Profil", personal_info: "Informasi Pribadi",
      store: "Toko", achievement: "Pencapaian", widgets: "Widget", general: "Umum", help: "Bantuan",
      settings: "Pengaturan", about: "Tentang", appearance: "Tampilan & Bahasa", display: "Tampilan Sistem",
      language: "Bahasa", accessibility: "Aksesibilitas", notification: "Notifikasi", units: "Pengukuran",
      weight_unit: "Satuan Berat", height_unit: "Satuan Tinggi", currency: "Mata Uang", go_premium: "LANGGANAN PREMIUM",
      weekly_progress: "Akumulasi Mingguan", complete: "Selesai", pending: "Tertunda"
    },
    en: {
      planning: "PLANNING", today: "Today", profile: "Profile", personal_info: "Personal Information",
      store: "Store", achievements: "Achievements", widgets: "Widgets", general: "General", help: "Help",
      settings: "Settings", about: "About", appearance: "Display & Language", display: "Display",
      language: "Language", accessibility: "Accessibility", notification: "Notification", units: "Units",
      weight_unit: "Weight Unit", height_unit: "Height Unit", currency: "Currency", go_premium: "GO PREMIUM",
      weekly_progress: "Weekly Progress", complete: "Complete", pending: "Pending"
    }
  };

  // 📍 AMAN & NON-DESTRUKTIF: Mengganti teks tanpa menghapus komponen span angka bawaan HTML
  function changeLanguage(language) {
    const elements = document.querySelectorAll("[data-lang]");
    elements.forEach(element => {
      const key = element.getAttribute("data-lang");
      if (translations[language] && translations[language][key]) {
        // Jika box kosong tanpa anak tag HTML, aman pakai innerText
        if (element.children.length === 0) {
          element.innerText = translations[language][key];
        } else {
          // Jika memiliki tag anak (seperti span angka akumulasi), cari dan ganti Text Node-nya saja
          for (let node of element.childNodes) {
            if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== "") {
              node.textContent = translations[language][key];
              break;
            }
          }
        }
      }
    });
    localStorage.setItem("app-language", language);
  }

  const savedLanguage = localStorage.getItem("app-language") || "id";
  changeLanguage(savedLanguage);

  if (languageSelect) {
    languageSelect.value = savedLanguage;
    languageSelect.addEventListener("change", () => {
      changeLanguage(languageSelect.value);
      inisialisasiKalender();
      renderTugasKeDashboard(); 
    });
  }

  const btnBukaUnits = document.getElementById("btn-units");
  const halamanUnits = document.getElementById("halaman-units");
  const btnKembaliKePengaturan = document.getElementById("btn-kembali-pengaturan");

  if (btnBukaUnits && halPengaturan && halamanUnits) {
    btnBukaUnits.addEventListener("click", function () {
      halPengaturan.style.display = "none";
      halamanUnits.style.display = "block";
    });
  }

  if (btnKembaliKePengaturan && halPengaturan && halamanUnits) {
    btnKembaliKePengaturan.addEventListener("click", function () {
      halamanUnits.style.display = "none";
      halPengaturan.style.display = "block";
    });
  }
});