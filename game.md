## 🎮 Konsep Gamifikasi (Interactive Games)

Project ini menggunakan pendekatan gamifikasi untuk membuat proses belajar budaya Batak menjadi lebih *engaging*. Terdapat dua *core game* dalam aplikasi ini:

### 1. Mini-Game: Simulasi Menenun (Weaving Clicker)
Sebelum pengguna dapat menggunakan Ulos, mereka harus "menenun" kain tersebut.
* **Konsep:** Permainan ketangkasan waktu (Rhythm/Clicker game) sederhana.
* **Mekanik:** 
  - Layar menampilkan animasi alat tenun (ATBM).
  - Terdapat indikator bergerak (seperti benang/shuttle). Pengguna harus mengklik tombol layar tepat saat indikator berada di zona target.
  - Setiap klik yang akurat akan menambah progres menenun (0% hingga 100%).
* **Hasil:** Setelah mencapai 100%, kain Ulos berhasil dibuat dan masuk ke dalam *inventory* untuk tahap selanjutnya.

### 2. Main Game: "Sang Parulos" (Mangulosi / Matching Game)
Inti dari edukasi ini adalah memahami **kapan dan kepada siapa** sebuah Ulos diberikan sesuai dengan tradisi *Mangulosi*.
* **Konsep:** *Scenario-based Drag and Drop matching game* dengan efek *Spin & Swap*.
* **Mekanik:**
  - **Skenario:** Sistem menampilkan sebuah narasi. *(Contoh: "Keluarga Bapak Budi sedang bersukacita karena pernikahan putrinya. Ulos apa yang paling tepat diberikan?")*
  - **Droppable Zone:** Di tengah layar terdapat Karakter Model (Pria/Wanita) yang mengenakan pakaian polos.
  - **Draggable Items:** Di bagian bawah layar terdapat pilihan ikon kain Ulos.
  - **Interaksi:** Pengguna menarik (*drag*) Ulos yang benar dan melepaskannya (*drop*) ke area karakter.
* **Visual Feedback (Spin & Swap Animation):**
  - ✅ **Jika Benar:** Memicu animasi *3D Flip* menggunakan Framer Motion. Karakter akan berputar 180/360 derajat di sumbu Y. Tepat saat karakter berputar (tidak terlihat), sistem melakukan *swap* gambar dari "Karakter Polos" menjadi "Karakter Memakai Ulos". Animasi diakhiri dengan partikel *confetti* dan penjelasan budaya.
  - ❌ **Jika Salah:** Ikon Ulos memantul (*bounce*) kembali ke tempat asal, dan layar menampilkan petunjuk edukatif.

---

## 📂 Struktur & Kebutuhan Aset Visual

Untuk mendukung mekanik *Spin & Swap* di atas, project ini menggunakan pendekatan aset pra-render (bukan *overlay* transparan) agar kompatibel di semua ukuran layar (Responsif).

1. **Aset Karakter Dasar (`/public/images/characters/`)**
   - `model-pria-polos.png`: Karakter pria berpakaian netral tanpa Ulos.
   - `model-wanita-polos.png`: Karakter wanita berpakaian netral tanpa Ulos.
2. **Aset Karakter Ber-Ulos (`/public/images/characters/`)**
   - `model-pria-ragihotang.png`: Karakter pria yang sudah digambar menyatu mengenakan Ulos Ragi Hotang.
   - `model-wanita-sadum.png`: Karakter wanita yang sudah digambar menyatu mengenakan Ulos Sadum.
   - dll
3. **Aset Ikon Ulos (`/public/images/icons/`)**
   - Gambar kain Ulos yang dilipat (kotak/bundar) untuk area *draggable* / *inventory*.

## 🛠️ Implementasi Teknis Game
* **`@dnd-kit/core`:** Mengelola state *drag-and-drop*, mendeteksi benturan (*collision*) antara Ulos dan Karakter.
* **`framer-motion`:** Mengelola animasi manipulasi DOM seperti `rotateY` untuk efek ganti baju (Spin & Swap), efek *bounce*, dan transisi halaman.
* **`zustand`:** Menyimpan *state* global seperti inventori Ulos yang sudah ditenun dan skor pemain.



========================UPDATE BARU ===========================

untuk penjelasan dari setiap pakaian adat nya kita buat dalam bahasa inggris , dan penjelasan dengan suara juga dalam bahasa inggris 
jadi ketika di klik muncul pop up penjelasan nya , dan juga ada suara penjelasan nya 

untuk ui nya di sesuaikan , pokonya ada animasi nya jangan sampai tidak ada animasi nya sama sekali

dan kita akan buat seperti asisten di pojok kanan bawah yang akan memberikan petunjuk kepada pemain, dia nanti akan meminta pemain untuk membuat 1 set pakaian adat lengkap, yang terdiri dari baju , celana, dan ulos

jadi nanti akan seperti ini 
- asisten akan meminta pemain untuk membuat 1 set pakaian adat lengkap


==================== TAMBAHAN UPDATE==================
- hapus kolom text asisten nya
- tugas asistennya hanya untuk memberikan petunjuk ,ketika pemain akan memakaikan baju , dia akan memberi petunjuk apa nama baju yg harus di pasangkan, dan contoh gambarnya juga akan muncul di sampingnya 
- ketika pasangannya sudah benar maka akan ada animasi pakaian adat tersebut di pakai dan muncul suara penjelasan nya dalam bahasa inggris 
- ketika belum benar maka asisten akan memberi petunjuk dengan pesan kmu masih salah coba lagi
- ketika benar maka asisten akan memberi suara selamat dan lanjut ke pemilihan celana  
- untuk animasi memakai baju nya bisa lebih kreatif lagi
- dan asistennya ga bisa di klik lagi . asistennya hanya berbicara sesuai template saja ( ketika memilih baju , asisten memberi tau baju apa yg harus di pasangkan, ketika memilih celana , asisten memberi tau celana apa yg harus di pasangkan, ketika memilih ulos , asisten memberi tau ulos apa yg harus di pasangkan ) 

untuk tampilan 
- buat agar ketika di buka di perangkat mobile asistennya tidak menutupi layar utama, tampilannya di buat sedikit lebih kecil 
-


dari game 1 hingga final quiz buat sistem dimana user harus selesai dulu dengan kuis sebelumnya sebelum lanjut ke game selanjutnya 
contoh 
- user harus menyelesaikan game 1 dulu baru bisa lanjut ke game 2 , jika belum selesai maka tidak bisa lanjut ke game 2 dan seterusnya 