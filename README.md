# Events Labs — site vitrine

Site one-page haut de gamme, **trilingue FR / Arabe (RTL) / Anglais**, pour
**Events Labs** — atelier de scénographie & décoration événementielle à
**Kouba, Alger**. 100 % statique (HTML / CSS / JS), aucun build, aucune
dépendance : il suffit d'ouvrir `index.html`.

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
Dans `index.html` (section contact) : remplacer
`Kouba, Alger — adresse à préciser` par l'adresse réelle, et la même chose dans
le bloc `application/ld+json` (en-tête) + ajouter une carte Google Maps si voulu.

### 3. Les vraies photos (le plus important)
Les vignettes de la section **Réalisations** sont des **compositions de
présentation** (dégradés + grain, aucune photo factice trompeuse). Pour mettre
une vraie photo, dans chaque `<figure class="shot …">` remplacer :

```html
<div class="shot__media"></div>
```

par :

```html
<div class="shot__media">
  <img src="assets/img/realisations/mon-mariage.jpg" alt="Description de la déco" />
</div>
```

et ajouter dans le CSS, si besoin, `.shot__media img { width:100%; height:100%; object-fit:cover; }`.
👉 **Conseil studio :** garder le même *grade* (même teinte chaude) sur toutes
les photos pour l'effet « shooting unique » ; le grain global du site les unifie.

### 4. Chiffres & témoignages
Ajuster les `data-count` (section stats) et les témoignages dans
`index.html` + `assets/js/i18n.js` (3 langues).

## Structure

```
events-labs/
├── index.html              # structure + SEO + JSON-LD
├── assets/
│   ├── css/styles.css      # design system complet
│   ├── js/i18n.js          # traductions FR / AR / EN
│   ├── js/main.js          # interactions + CONFIG coordonnées
│   ├── img/                # favicon, og-cover, hero-poster (+ vos photos)
│   └── video/hero.mp4      # vidéo de fond du hero
└── README.md
```

## Vidéo du hero

Le fond du hero est une vidéo : `assets/video/hero.mp4` (table d'événement
dressée). Source : **Mixkit** — [licence libre](https://mixkit.co/license/),
usage commercial autorisé, **sans attribution**. Pour la remplacer, déposez
votre propre `.mp4` (idéalement < 5 Mo, muet, ~10-20 s en boucle) à cet
emplacement, ou changez le `src` dans `index.html` (`<video class="hero__video">`).
L'image `assets/img/hero-poster.svg` s'affiche avant chargement / si
l'utilisateur a activé « réduire les animations ».

## Direction artistique

- **Palette « Nuit & Champagne »** : bleu nuit `#0e1726` · ivoire `#f3efe7` ·
  **or** `#b08a3a` (accent, lisible sur clair) · champagne `#c9a86a` (filets &
  détails sur fond sombre).
- **Typographie** : *Fraunces* (display), *Inter Tight* (corps), *Space Mono*
  (labels), *Aref Ruqaa* + *Tajawal* (arabe). Chargées via Google Fonts.
- **Signatures** : grain argentique global, curseur custom « Voir », reveals
  lents au scroll, ticker bilingue, grille éditoriale volontairement asymétrique.
- **Accessibilité** : skip-link, focus visibles, `prefers-reduced-motion`,
  HTML sémantique, contrastes soignés.

## Mise en ligne

Hébergement statique (Netlify, Vercel, Cloudflare Pages, GitHub Pages, ou un
simple FTP). Avant la prod :

- [ ] Remplir `CONFIG` (WhatsApp/tel/e-mail/réseaux)
- [ ] Mettre l'adresse réelle (+ JSON-LD)
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
