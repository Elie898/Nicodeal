# Nicodeal – Webshop för snus & nikotinpåsar

Nicodeal är en modern e-handelsplattform byggd med en headless-arkitektur där frontend och backend är separerade.

## Teknologi

- Frontend: Next.js (React + Tailwind CSS)
- Backend: Strapi (Headless CMS)
- Databas: SQLite

---

## Funktioner

- Produktsida
- Kategorier
- Filtrering (märke & kategori)
- Varukorg
- Checkout (inkl. simulerad kortbetalning)
- Adminpanel (Strapi)
- Orderhantering

---

## Krav

Se till att du har följande installerat:

### Node.js

https://nodejs.org

---

## Viktigt att veta

- Projektet innehåller en backup av databasen
- Databasen importeras via Strapi
- Du måste skapa ett eget admin-konto första gången

---

## Öppna projektet

1. Öppna Visual Studio Code
2. Klicka på File → Open Folder
3. Välj mappen Nicodeal

---

## Installation

### Frontend

```bash
cd frontend
npm install
```

### Backend

```bash
cd backend
npm install
```

---

## Importera databas

Kör i backend-mappen:

```bash
npx strapi import --file backup.tar.gz.enc
```

När du blir ombedd att ange lösenord:

```
elie
```

---

## Starta projektet

Projektet kräver två terminaler.

### Starta backend (Strapi)

```bash
cd backend
npm run develop
```

Öppna:
http://localhost:1337/admin

Skapa ett admin-konto.

---

### Starta frontend

```bash
cd frontend
npm run dev
```

Öppna:
http://localhost:3000

---

## Inloggning

### Strapi Admin

Skapa eget konto vid första start

### Admin i webbshoppen

URL:
http://localhost:3000/admin/login

Testkonto:

Användarnamn: admin  
Lösenord: 1234

---

## Struktur

```
frontend/   → Webbshop (Next.js)
backend/    → Strapi + databas
```

---

## Utvecklare

Elie Antar

---

## Sammanfattning

1. Installera Node.js
2. Installera frontend och backend
3. Importera databasen
4. Starta backend
5. Skapa admin-konto
6. Starta frontend
7. Öppna webbplatsen
