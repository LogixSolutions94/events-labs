# Events Labs — site vitrine « Le Grand Soir »

Site one-page haut de gamme, **trilingue FR / Arabe (RTL) / Anglais**, pour
**Events Labs** — atelier de scénographie & décoration événementielle à
**Kouba, Alger**. 100 % statique (HTML / CSS / JS), aucun build, aucune
dépendance : il suffit d'ouvrir `index.html`.

## Le concept

Le site est construit comme **une soirée de théâtre** :

- **Rideau d'ouverture** en velours (une fois par session, cliquable pour passer) ;
- **Projecteur** : sur le hero, une poche de lumière suit le curseur ;
- les sections sont des **actes** (Acte I — L'atelier … Acte VII — Contact),
  suivis par un rail de progression fixe à gauche (desktop) ;
- les formules deviennent **« Le Programme »**, le contact un
  **carton R.S.V.P.** légèrement incliné qui se redresse au survol ;
- galerie en **pellicule horizontale** (glisser, flèches, filtres, lightbox),
  accordéon des savoir-faire, témoignages en carrousel, marquee géant au footer.

Tout respecte `prefers-reduced-motion` (rideau, projecteur, marquees et
animations désactivés).

## Lancer en local

```bash
# depuis ce dossier
python3 -m http.server 4200
# puis ouvrir http://localhost:4200
```

(ou n'importe quel serveur statique / double-clic sur `index.html`)

## ✏️ À renseigner par Events Labs (5 min)

### 1. Coordonnées — `assets/js/main.js`
Tout est centralisé dans l'objet `CONFIG` en haut du fichier :

```js
const CONFIG = {
  whatsapp: "213000000000",      // n° international SANS "+", espaces ni 0 initial
  phoneDisplay: "+213 0 00 00 00 00",
  phoneDial: "+213000000000",
  email: "contact@eventslabs.dz",
  instagram: "https://www.instagram.com/eventslabs.dz",
  facebook: "https://www.facebook.com/eventslabs.dz"
};
```

> Exemple : le numéro `0550 12 34 56` devient `whatsapp: "213550123456"`.
> Tous les boutons WhatsApp / appel / e-mail / réseaux se mettent à jour seuls.

### 2. Adresse de l'atelier
Dans `assets/js/i18n.js` (clé `cAddrVal`, dans les 3 langues) + le bloc
`application/ld+json` dans `index.html`.

### 3. Les vraies photos / vidéos (le plus important)
Les vignettes de la section **Réalisations** (la pellicule horizontale)
affichent pour l'instant de **courtes vidéos libres de droit** (Mixkit,
`assets/video/work1…5.mp4`, chargées en lazy et lues seulement quand visibles)
et quatre photos (`assets/img/realisations/`). À remplacer par les **vrais
événements** d'Events Labs dès que possible.

Pour mettre votre propre média, dans le `<figure class="shot">` concerné :

```html
<video class="shot__video" muted loop playsinline preload="none"
       data-src="assets/video/mon-mariage.mp4"></video>
```

…ou une photo :

```html
<img src="assets/img/realisations/mon-mariage.jpg" alt="Description de la déco" loading="lazy" />
```

👉 **Conseil studio :** garder le même *grade* (mêmes teintes chaudes) sur tous
les médias ; le grain global du site les unifie.

### 4. Chiffres & témoignages
Ajuster les `data-count` (section chiffres) dans `index.html` et les
témoignages dans `assets/js/i18n.js` (clés `q1…q3`, 3 langues).

## Structure (4 pages)

```
events-labs/
├── index.html              # landing : hero, atelier, savoir-faire, aperçus, R.S.V.P.
├── realisations.html       # galerie complète (filtres, grille, lightbox)
├── produits.html           # formules + catalogue de location
├── contact.html            # contact & devis (formulaire complet, FAQ)
├── assets/
│   ├── css/styles.css      # design system complet « Le Grand Soir »
│   ├── js/i18n.js          # traductions FR / AR / EN (data-i18n, -aria, -ph)
│   ├── js/main.js          # interactions + CONFIG coordonnées
│   ├── img/                # favicon, og-cover, hero-poster (+ vos photos)
│   └── video/hero.mp4      # vidéo de fond du hero
└── README.md
```

### Graphismes dynamiques

Lucioles dorées (canvas) sur les fonds de scène, et ornements en filet d'or
**dessinés au scroll** : branche florale (atelier), anneaux entrelacés
(approche), arche de mariage (réalisations), lustre (produits), service à thé
(contact), lanterne fanous (bandeaux R.S.V.P.). Aucune référence à l'alcool —
site pensé pour le marché algérien.

### Finitions « référence européenne »

Inspirées des meilleures agences de scénographie d'Europe (Bureau Betak,
Villa Eugénie…) :

- **Transitions de page « changement de scène »** — un voile de velours balaie
  l'écran entre chaque page (prolonge le rideau d'ouverture).
- **Répertoire à aperçu curseur** (page Réalisations) — un index éditorial où
  survoler un titre fait apparaître le décor en vignette qui suit la souris.
- **Titre rempli par la vidéo** (landing) — le mot « Fête » découpé, la vidéo
  d'événement joue à l'intérieur des lettres (masque SVG).
- **Boutons magnétiques**, **marquees réactifs au scroll**, **lettrine**
  éditoriale sur le manifeste de l'atelier.

Tout est en CSS/JS vanilla, sans WebGL ni dépendance (léger pour le mobile),
et se désactive proprement avec `prefers-reduced-motion`.

## Vidéo du hero

Le fond du hero est une vidéo : `assets/video/hero.mp4`. Source : **Mixkit** —
[licence libre](https://mixkit.co/license/), usage commercial autorisé,
**sans attribution**. Pour la remplacer, déposez votre propre `.mp4`
(idéalement < 5 Mo, muet, ~10-20 s en boucle) à cet emplacement.
L'image `assets/img/hero-poster.svg` s'affiche avant chargement / si
l'utilisateur a activé « réduire les animations ».

## Direction artistique — « Velours & Laiton »

- **Palette** : noir de scène `#0f0b08` · grenat velours `#2c0f18` ·
  **laiton** `#c49a58` · flamme `#ecc57e` (reflets) · ivoire papier `#f2e9d7`
  · encre `#211507`. Les actes alternent scène sombre et papier clair.
- **Typographie** : *Bodoni Moda* (display, didone de caractère),
  *Hanken Grotesk* (corps), *Fragment Mono* (labels), *Amiri* + *Tajawal*
  (arabe). Chargées via Google Fonts.
- **Signatures** : rideau d'ouverture, projecteur au curseur, curseur custom
  double (point + anneau « Voir »), grain argentique, tickers bilingues,
  numéros d'actes, étoile ✦ en fil rouge, carton R.S.V.P.
- **Accessibilité** : skip-link, focus visibles, `prefers-reduced-motion`,
  HTML sémantique, RTL complet, contrastes soignés.

## Mise en ligne

Hébergement statique (GitHub Pages, Netlify, Vercel, Cloudflare Pages, ou un
simple FTP). Avant la prod :

- [ ] Remplir `CONFIG` (WhatsApp/tel/e-mail/réseaux)
- [ ] Mettre l'adresse réelle (i18n `cAddrVal` + JSON-LD)
- [ ] Glisser les vraies photos dans `assets/img/realisations/`
- [ ] Remplacer le domaine `eventslabs.dz` dans les balises `canonical`,
      `hreflang` et Open Graph
- [ ] Exporter une version **PNG** de `og-cover.svg` (certains réseaux ne lisent
      pas le SVG en aperçu) et la référencer dans les balises `og:image`
- [ ] Créer une **fiche Google Business** « Kouba » + se référencer sur
      **3ersi.com** et **Ouedkniss** (où les clients cherchent) en renvoyant ici
- [ ] Auto-héberger les polices si l'on veut couper la dépendance Google Fonts

---
Conçu & fabriqué avec soin à Alger.
