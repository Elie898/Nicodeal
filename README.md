# Nicodeal – Webbshop för snus & nikotinpåsar

Nicodeal är en modern e-handelswebbplats byggd med:

- **Frontend:** Next.js (React + Tailwind CSS)
- **Backend:** Strapi (Headless CMS)
- **Databas:** SQLite

Projektet innehåller funktioner som:

- Produktsida
- Kategorier
- Filtrering (märke & kategori)
- Varukorg
- Checkout (inkl. fake kortbetalning)
- Adminpanel (Strapi)
- Orderhantering

---

# Vad behövs för att starta projektet?

Måste du installera följande:

## Program

### 1. Node.js

Används för att köra projektet.

Ladda ner:
https://nodejs.org

---

### 2. SQLite

Projektet använder SQLite via Strapi.

Du behöver inte installera SQLite manuellt – den skapas automatiskt när backend startas.

---

# Öppna projektet

1. Öppna Visual Studio Code
2. Klicka **File → Open Folder**
3. Välj projektmappen

---

# Installera projektet (viktigt!)

## Steg 1 – Frontend

Öppna terminal:

**Terminal → New Terminal**

Skriv:

```bash
cd frontend
npm install
```

---

## Steg 2 – Backend

Öppna en **ny terminal**:

```bash
cd backend
npm install
```

---

# Starta projektet

Projektet kräver **två terminaler**.

---

## Starta backend (Strapi)

I terminalen:

```bash
cd backend
npm run develop
```

Öppna:
http://localhost:1337/admin

---

## Starta frontend

Öppna en **ny terminal**:

```bash
cd frontend
 npm run dev
```

Öppna:
http://localhost:3000

---

# Inloggning

## 1. Strapi Admin

Används för att hantera:

- produkter
- kategorier
- ordrar

Öppna:
http://localhost:1337/admin

Test konto:

- Email: `elie_008@hotmail.com`
- Lösenord: `Nicodeal123`

---

## 2. Admin i webbshoppen

Öppna:
http://localhost:3000/admin/login

Test konto:

- Användarnamn: `admin`
- Lösenord: `1234`

---

# Tekniker

- Next.js
- React
- Tailwind CSS
- Strapi
- SQLite

---

# Struktur

```
frontend/   → webbshop
backend/    → Strapi + databas
```

---

# Utvecklare

Elie Antar

---

# Sammanfattning

För att köra projektet:

1. Installera Node.js
2. Ladda ner projektet från GitHub
3. Installera frontend + backend
4. Starta backend
5. Starta frontend
6. Öppna webben

---
