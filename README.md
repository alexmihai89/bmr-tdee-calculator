# AM Calorie Calculator — BMR / TDEE / Macro

Calculator web pentru estimarea necesarului caloric zilnic: BMR, TDEE, target
caloric pe obiectiv, macro-uri și hidratare. Gândit pentru clienți de sală și
populația generală, cu accent pe estimări realiste, explicații clare și un ton
fără promisiuni rapide. Totul rulează client-side; nu se colectează date.

## Stack

- [Next.js](https://nextjs.org) 16 (App Router, Turbopack)
- React 19, TypeScript 5
- Tailwind CSS v4

Fără dependențe runtime suplimentare și fără backend.

## Dezvoltare

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # build de productie
npm run lint    # ESLint
```

## Structura

- `lib/` — motorul de calcul, pur și tipat, fără dependențe de React:
  - `bmrEngine` — BMR prin formula **Mifflin-St Jeor**.
  - `activityEngine` — calorii din pași, job și mișcare generală, cu factori de
    suprapunere pentru a evita dubla numărare.
  - `trainingEngine` — calorii din antrenamente, mediate pe săptămână.
  - `tdeeEngine` — TDEE ca sumă: BMR + activitate zilnică + antrenament.
  - `goalEngine` — target pe obiectiv, interval realist, ritm estimat, atenționări.
  - `macroEngine` — proteine / grăsimi / carbohidrați pe obiectiv.
  - `calorieCalculator` — orchestratorul care compune rezultatul final.
- `components/` — formularul, afișarea rezultatelor, gate-ul de disclaimer, iconuri.
- `app/` — pagina, layout-ul (metadata SEO/OG) și imaginea OpenGraph.

## Model de calcul

Spre deosebire de abordarea clasică `TDEE = BMR × factor de activitate`,
aplicația folosește un **model aditiv**: însumează separat BMR, activitatea
zilnică (pași + job + mișcare generală) și antrenamentele, cu factori de
suprapunere care reduc dubla numărare dintre acești termeni.

> Notă: constantele de activitate (kcal/kg pe nivel și pe tip de job, pragurile
> de suprapunere, kcal/pas) sunt euristice, calibrate conservator pentru a
> reduce riscul de supraestimare. Nu provin dintr-o singură sursă publicată și
> trebuie tratate ca estimări, nu ca valori validate clinic.

Rezultatele sunt estimări educaționale, nu diagnostic medical sau plan
alimentar personalizat.
