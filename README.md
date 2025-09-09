# Bisnis Indonesia

## Cara Menjalankan

### Persiapan
- Node.js, npm, dan Postgres sudah terinstall

### 1. Jalankan Database
- Pastikan Postgres berjalan dan database `bisnis_indonesia` sudah dibuat (user: postgres, password: postgres)

### 2. Jalankan Backend
```bash
cd bi-backend
npm install
npm run dev
```

### 3. Jalankan Frontend
```bash
cd bi-frontend
npm install
npm run dev
```

### 4. Migration & Seed
- Migration:
  ```bash
  npx ts-node ./node_modules/typeorm/cli.js migration:run -d src/data-source.ts
  ```
- Membuat migration baru:
  ```bash
  npx ts-node ./node_modules/typeorm/cli.js migration:generate src/migration/NamaMigration -d src/data-source.ts
  ```
- Seed (jika script sudah ada di package.json):
  ```bash
  npm run seed
  ```

### 5. Environment Variable
- Backend:
  ```
  DB_HOST=localhost
  DB_PORT=5432
  DB_USER=postgres
  DB_PASS=postgres
  DB_NAME=bisnis_indonesia
  ```

### 6. Docker
- Untuk menjalankan semua service sekaligus:
  ```bash
  docker compose up --build
  ```

### 7. Akses
- Frontend: http://localhost:3000
- Backend: http://localhost:4000

### Menjalankan Migration & Seed di Docker

Jalankan perintah berikut dari folder utama:

Migration
```bash
docker compose exec bi-backend npx ts-node ./node_modules/typeorm/cli.js migration:run -d src/data-source.ts
```

Seed
```bash
docker compose exec bi-backend npm run seed
```

Pastikan service backend sudah berjalan.

---

Jika ada error, cek koneksi database dan environment variable.
