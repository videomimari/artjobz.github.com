# mimsinanb.com — Yeni Site

Statik, tek sayfalık, sade kod (saf HTML/CSS/JS — hiçbir build aracı/framework gerekmiyor). GitHub Pages'e doğrudan yüklenip yayınlanabilir.

## Dosyalar

```
index.html   → sayfa iskeleti ve metinler
style.css    → tasarım (renkler, tipografi, animasyonlar)
script.js    → portfolyo kartları, saat/timecode, mobil menü
CNAME        → özel alan adı (www.mimsinanb.com) için
```

## 1) GitHub'a yükleme

1. GitHub'da yeni bir repo oluştur (örn. `mimsinanb-site`).
2. Bu klasördeki dosyaları repo'ya yükle (GitHub arayüzünden "Add file → Upload files" da yeterli).
3. Repo → **Settings → Pages** →
   - **Source**: `Deploy from a branch`
   - **Branch**: `main`, klasör `/ (root)`
4. Birkaç dakika içinde site `https://<kullanıcı-adın>.github.io/mimsinanb-site` adresinde yayında olur.

## 2) www.mimsinanb.com'u bağlama

`CNAME` dosyası zaten `www.mimsinanb.com` yazıyor, GitHub Pages bunu otomatik tanır. Alan adının DNS ayarlarını (şu an Wix'te) şuna göre güncellemen gerekiyor:

- `www` kaydını GitHub'ın verdiği adrese (`<kullanıcı-adın>.github.io`) **CNAME** kaydı olarak yönlendir.
- Kök alan adı (`mimsinanb.com`, `www` olmadan) için GitHub Pages'in A kayıtlarını kullan:
  ```
  185.199.108.153
  185.199.109.153
  185.199.110.153
  185.199.111.153
  ```
- DNS değişikliği yayılana kadar (birkaç saat sürebilir) Settings → Pages'te "DNS check" bekleyebilir; sonrasında "Enforce HTTPS" kutucuğunu işaretle.

## 3) İçerik güncelleme

- **Videolar**: `videos.json` dosyası. Yeni video eklemek için oraya `{ "title": ..., "category": ..., "youtubeId": ..., "date": ... }` şeklinde bir obje eklemen yeterli. `category` alanı şu 7 değerden biri olmalı: Youtube, Mekan Tanıtım, Klip, Etkinlik, Reels, Marka İşbirliği, Sağlık Sektörü. `youtubeId`, YouTube linkindeki `watch?v=` sonrasındaki koddur. Video gizli (unlisted) olsa da bu kod üzerinden oynatılabilir.
- **Portfolyo kategori kartları (fotoğraflı)**: `script.js` içindeki `CATEGORY_META` nesnesi. Şu an her kategori için geçici, ücretsiz-lisanslı (Unsplash) bir stok fotoğraf kullanılıyor — kendi çekimlerinden bir kapak fotoğrafın olduğunda oradaki linki kendi görselinle değiştir. Karta tıklayınca sayfa otomatik olarak o kategoriye göre filtrelenmiş video galerisine kayar.
- **Zaman çizelgesi (Hakkımda)**: `index.html` içinde `<!-- Zaman çizelgesi -->` yorumunun altındaki `.timeline__item` bloklarında yıl/başlık/açıklama düz metin olarak duruyor, doğrudan düzenlenebilir.
- **İletişim formu**: `#iletisim` bölümündeki form statik bir site olduğu için bir sunucuya veri göndermiyor; "Mesaj Gönder" butonuna basıldığında doldurulan bilgilerle bir e-posta taslağı hazırlanıp senin e-posta uygulaman (mailto:) açılıyor. İleride gerçek bir form gönderimi istersen (Formspree, Web3Forms gibi ücretsiz servisler) `script.js` içindeki `contactForm` submit olayını o servisin `fetch` çağrısıyla değiştirmemiz yeterli — istersen bunu birlikte kurarız.
- **Telefon / e-posta / sosyal medya**: `index.html` içinde `#iletisim` bölümünde.
- **Metinler** (başlık, bio, istatistikler): `index.html` içinde ilgili bölümlerde düz Türkçe metin olarak duruyor, doğrudan düzenlenebilir.
- **Renkler / yazı tipleri**: `style.css` en üstteki `:root` bloğunda (`--amber`, `--teal`, `--bg` vb. değişkenler).

## 4) Fotoğraflar hakkında

Hero ve portfolyo kategori kartlarındaki fotoğraflar şu an ücretsiz-lisanslı (Unsplash License) stok görseller — yer tutucu olarak konuldu, telifle ilgili bir sorun yok ama senin gerçek çekimlerin değiller. Kendi fotoğraflarınla değiştirmek için:

1. Görselini bir yere yükle (repo içine `assets/` klasörü açabilir ya da doğrudan bir görsel barındırma servisi kullanabilirsin).
2. `index.html` içindeki `hero__photo > img` etiketinin `src`'sini kendi hero görselinin linkiyle değiştir.
3. `script.js` içindeki `CATEGORY_META` nesnesindeki ilgili kategori linkini kendi kapak fotoğrafınla değiştir.

## Notlar

- Yazı tipleri (Big Shoulders Display, IBM Plex Mono, Inter) Google Fonts CDN'den yükleniyor — siteye internetten erişildiğinde otomatik çalışır.
- Mobil menü, saat/timecode animasyonu ve scroll-reveal efektleri saf JavaScript ile yazıldı, ek kütüphane gerekmiyor.
- `prefers-reduced-motion` ayarı açık olan kullanıcılar için animasyonlar otomatik kısıtlanıyor.
