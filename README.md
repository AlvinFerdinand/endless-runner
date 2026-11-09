# Endless Runner

Game web berbasis HTML5 Canvas. Pemain berpindah di antara tiga jalur untuk menghindari rintangan yang datang semakin cepat dan semakin sering. Permainan berakhir saat pemain tertabrak, dan skor dihitung dari lamanya bertahan.

## Cara Bermain

- **Layar sentuh:** geser (swipe) ke kiri/kanan, atau ketuk sisi kiri/kanan layar.
- **Keyboard:** tombol panah kiri/kanan atau A/D.
- Skor bertambah 10 poin per detik. Rekor tertinggi disimpan di browser.

## Menjalankan Secara Lokal

Project memakai ES Modules sehingga harus dibuka melalui web server, bukan langsung lewat `file://`.

```bash
python -m http.server 8000
```

Lalu buka `http://localhost:8000`.

## Struktur Kode

```
index.html          Halaman utama dan overlay menu
style.css           Layout responsif dan pengaturan sentuhan
src/
  main.js           Menyusun semua modul, alur menu, dan rekor
  config.js         Seluruh konstanta gameplay
  game.js           State permainan: waktu, skor, rintangan, deteksi tabrakan
  difficulty.js     Kurva kesulitan berdasarkan waktu bertahan
  spawner.js        Pemunculan baris rintangan
  pool.js           Object pool untuk rintangan
  player.js         Posisi jalur dan animasi perpindahan pemain
  lanes.js          Fungsi bantu posisi jalur
  collision.js      Deteksi tabrakan AABB
  renderer.js       Seluruh proses menggambar ke canvas
  overlay.js        Panel DOM untuk layar mulai dan hasil
  best-score.js     Penyimpanan rekor di localStorage
  core/
    game-loop.js    Game loop dengan fixed timestep
    viewport.js     Penskalaan resolusi logis ke ukuran layar
    lane-input.js   Input swipe, tap, dan keyboard
  utils/
    math.js         Fungsi bantu matematika
```

## Keputusan Teknis

- **Pemisahan logika dan tampilan.** `Game` hanya menerima perintah `steer(-1 | 1)` dan time step, tanpa mengenal canvas maupun DOM.
- **Kesulitan sebagai fungsi murni.** `difficultyAt(elapsed)` menghasilkan kecepatan, interval spawn, dan peluang rintangan dua jalur. Kurvanya mudah diuji dan diatur dari `config.js`.
- **Jaminan keadilan pola.** Setiap baris selalu menyisakan minimal satu jalur kosong. Interval spawn juga diberi batas bawah yang dihitung dari kecepatan saat itu, cukup untuk bereaksi dan berpindah dari jalur paling kiri ke paling kanan. Tanpa batas ini, kecepatan tinggi bisa menghasilkan pola yang mustahil dihindari.
- **Satu kecepatan dunia.** Semua rintangan bergerak dengan kecepatan yang sama sehingga jarak antar baris tidak pernah menyempit setelah muncul.
- **Object pooling.** Rintangan yang keluar layar dikembalikan ke pool dan dipakai ulang sehingga tidak ada alokasi objek baru selama permainan.
- **Hitbox yang sedikit dipersempit.** Tabrakan terasa adil dan tidak terjadi karena selisih satu piksel.
- **Posisi logis dan visual dipisah.** Jalur berubah seketika saat input, posisi gambar bergerak halus menuju jalur tersebut. Tabrakan memakai posisi gambar.
- **Swipe terdeteksi saat bergerak.** Perpindahan terjadi begitu jari melewati ambang, tanpa menunggu jari diangkat. Sentuhan yang tidak menjadi swipe dianggap ketukan.
- **Fixed timestep (1/120 detik)** dan **resolusi logis tetap (450×800)**, sama seperti pada game Projectile Aiming.

## Library Eksternal

Tidak ada. Seluruh kode ditulis dengan JavaScript murni.
