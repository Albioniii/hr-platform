# Udhëzues hap pas hapi – PeopleDesk (Angular)

Ky udhëzues të çon nga zero deri te projekti që punon në kompjuterin tënd, në GitHub dhe online.

---

## Pjesa 1 – Instalo mjetet (vetëm një herë)

1. **Node.js**
   - Shko te https://nodejs.org dhe shkarko versionin **LTS** (22 ose 24).
   - Instaloje me "Next, Next, Finish".
   - Hap **Command Prompt** (ose PowerShell) dhe shkruaj:
     ```
     node -v
     npm -v
     ```
     Nëse shfaqen numra versionesh (p.sh. `v22.12.0`), është në rregull.

2. **Visual Studio Code**
   - Shkarkoje nga https://code.visualstudio.com
   - Kur të hapësh projektin, VS Code do të sugjerojë shtesën **Angular Language Service**. Instaloje: të ndihmon me autocomplete në HTML.

3. **Git** (për GitHub)
   - Shkarkoje nga https://git-scm.com dhe instaloje.
   - Kontrollo: `git --version`

---

## Pjesa 2 – Hape dhe nise projektin

1. Shkarko **hr-platform.zip** dhe ekstraktoje, p.sh. te `Documents\hr-platform`.
2. Hap VS Code → **File → Open Folder** → zgjidh dosjen `hr-platform`.
3. Hap terminalin brenda VS Code: **Terminal → New Terminal**.
4. Instalo paketat (zgjat 1–3 minuta, vetëm herën e parë):
   ```
   npm install
   ```
5. Nise aplikacionin:
   ```
   npm start
   ```
6. Shfletuesi hapet vetë te **http://localhost:4200**. Nëse jo, hape manualisht.
7. Kyçu me një llogari demo:
   - Punonjës: `albion@peopledesk.demo` / `demo123`
   - Menaxher: `arta@peopledesk.demo` / `demo123`

Për ta ndalur serverin: kliko në terminal dhe shtyp **Ctrl + C**.

> Kur ndryshon një skedar dhe e ruan (Ctrl + S), faqja rifreskohet automatikisht.

### Nëse del ndonjë gabim

- `'ng' is not recognized` → përdor `npm start`, jo `ng serve`.
- Gabim për versionin e Node → instalo Node LTS më të ri (Pjesa 1).
- `running scripts is disabled on this system` (PowerShell) → përdor **Command Prompt** në vend të PowerShell, ose ekzekuto një herë:
  `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`
- Çdo gabim tjetër → kopjoje të plotë nga terminali dhe ma dërgo.

---

## Pjesa 3 – Kupto strukturën e projektit

```
hr-platform/
├── package.json          → lista e paketave dhe komandat (npm start, npm run build)
├── angular.json          → konfigurimi i Angular (si ndërtohet projekti)
└── src/
    ├── index.html        → faqja e vetme HTML; Angular vendos aplikacionin te <app-root>
    ├── main.ts           → pika ku nis aplikacioni
    ├── styles.scss       → stilet globale + tema e Angular Material
    └── app/
        ├── app.config.ts → konfigurimi global (router, animacionet, datat)
        ├── app.routes.ts → të gjitha faqet dhe URL-të e tyre
        ├── core/         → "truri": modelet, shërbimet, guards, të dhënat demo
        ├── shared/       → pjesë të ripërdorshme (avatar, pipe)
        ├── layout/       → menuja anësore dhe shiriti sipër
        └── pages/        → çdo faqe ka dosjen e vet (.ts + .html + .scss)
```

Çdo komponent ka zakonisht tre skedarë:
- **.ts** → logjika (të dhënat, funksionet)
- **.html** → pamja (template)
- **.scss** → stili

---

## Pjesa 4 – Konceptet e Angular që përdor projekti

Mësoji në këtë renditje. Për secilin, hap skedarin përkatës dhe lexo komentet në shqip.

| # | Koncepti | Ku ta shohësh | Çfarë bën |
|---|---|---|---|
| 1 | **Component** | `shared/avatar.component.ts` | Një pjesë e UI-së me logjikën dhe pamjen e vet |
| 2 | **input()** | `shared/avatar.component.ts` | Të dhëna që i jep prindi komponentit |
| 3 | **Signals** (`signal`, `computed`) | `core/leave.service.ts` | Vlera reaktive: kur ndryshojnë, UI rifreskohet vetë |
| 4 | **Service** + `inject()` | `core/employee.service.ts` | Logjikë dhe të dhëna të përbashkëta për shumë faqe |
| 5 | **Control flow** (`@if`, `@for`) | `pages/dashboard/dashboard.component.html` | Kushte dhe cikle në HTML |
| 6 | **Pipe** | `shared/leave-type.pipe.ts` | Transformon vlera në template (`{{ x \| leaveType }}`) |
| 7 | **Routing** + lazy loading | `app.routes.ts` | Faqet dhe URL-të |
| 8 | **Guards** | `core/guards.ts` | Mbron faqet (login, vetëm menaxher) |
| 9 | **Reactive Forms** + validim | `pages/new-request/` | Forma me rregulla validimi |
| 10 | **Dialog** + RxJS | `pages/approvals/` | Dritare popup që kthen një rezultat |
| 11 | **Angular Material** | gjithkund | Komponentë të gatshëm UI (butona, tabela, kalendar) |

**Ushtrim i parë (5 minuta):** hap `src/app/core/mock-data.ts`, ndrysho emrin e një punonjësi, ruaje dhe shiko si ndryshon menjëherë në faqe.

> Shënim: të dhënat ruhen në shfletues (localStorage). Nëse ndryshon `mock-data.ts` dhe kërkesat nuk ndryshojnë, kliko emrin lart djathtas → **Reset demo data**.

---

## Pjesa 5 – Vendose në GitHub

1. Krijo llogari te https://github.com (nëse s'ke).
2. Kliko **New repository** → emri: `hr-platform` → **Public** → **Create repository** (mos shto README, e kemi).
3. Në terminalin e VS Code (brenda dosjes së projektit):
   ```
   git init
   git add .
   git commit -m "PeopleDesk: HR leave management platform in Angular"
   git branch -M main
   git remote add origin https://github.com/EMRI-YT/hr-platform.git
   git push -u origin main
   ```
   Zëvendëso `EMRI-YT` me emrin tënd në GitHub.
4. Në GitHub, te faqja e profilit, kliko **Customize your pins** dhe vendose `hr-platform` si projekt të parë.

---

## Pjesa 6 – Publikoje online falas (link për CV)

### Opsioni A: Vercel (më i lehti)
1. Shko te https://vercel.com → **Sign up with GitHub**.
2. **Add New → Project** → zgjidh `hr-platform` → **Deploy**.
   Konfigurimi është gati në skedarin `vercel.json`.
3. Pas 1–2 minutash merr një link si `hr-platform-xxx.vercel.app`.

### Opsioni B: Netlify
1. Shko te https://netlify.com → **Sign up with GitHub**.
2. **Add new site → Import an existing project** → zgjidh repo-n.
3. Build command: `npm run build` · Publish directory: `dist/hr-platform/browser`
4. **Deploy**.

Pastaj vendose linkun në `README.md` (rreshti "Live demo") dhe në CV.

---

## Pjesa 7 – Si ta përshkruash në CV

**PeopleDesk – HR Leave Management Platform** · *2026 · Angular 20, TypeScript, Angular Material*
- Built an HR platform where employees request leave and managers approve or reject requests, with role-based access using route guards.
- Implemented typed reactive forms with custom validators (overlapping dates, leave balance, working-day calculation).
- Managed application state with Angular Signals and computed values; lazy-loaded all feature routes.
- Developed a custom team calendar and responsive layout with Angular Material 3.
- Links: GitHub · Live demo

---

## Pjesa 8 – Hapat e ardhshëm (për të mësuar më shumë)

1. Shto **festat zyrtare të Kosovës** te llogaritja e ditëve të punës (`core/date-utils.ts`).
2. Krijo një **backend** me Node.js + Express (e njeh tashmë) dhe zëvendëso `localStorage` me `HttpClient`.
3. Shkruaj **teste** për `LeaveService` (p.sh. `balanceFor`, `hasOverlap`).
4. Shto **dark mode** (Angular Material e mbështet me pak CSS).

Në intervistë, të pyesin shpesh: *"Çfarë janë Signals?"*, *"Si funksionon një guard?"*, *"Pse reactive forms?"*. Projekti yt i ka të gjitha, prandaj kuptoji mirë këto tre pjesë.
