# Inception Chat — extracted design system

Source: [Inception Chat](https://chat.inceptionlabs.ai/). Extracted 19 October 2026.

This specification describes the public chat landing page, including its desktop and mobile layouts, closed and open suggested-prompt accordion, and the theme tokens declared by the deployed stylesheet. The captured interface identifies the model as **Mercury 3**. Other playground pages and generated conversation states are outside this inspection.

## 1. Evidence and scope

| Evidence | Scope | Confidence |
| --- | --- | --- |
| Five fresh rendered page captures | Two initial desktop/mobile captures plus three additional loads; `maxAge: 0`; all returned HTTP 200 | Directly retrieved |
| Normal viewport inspection | Desktop **1440 × 1000 CSS px**, mobile **390 × 844 CSS px**, both at device pixel ratio 1 | Visually inspected and measured |
| Additional desktop inspection | 1920 × 993 CSS px | Computed-style verification |
| Accordion interaction | Closed and open at desktop/mobile dimensions | Interaction verified |
| Deployed CSS | Complete light/dark semantic palettes, typography, spacing, radii, media queries, declared transitions | Source exact |
| Light appearance | Exact CSS token definitions | Source declared; the detailed geometry measurements are from dark mode |

Source references used below:

- **S1 — Page:** [https://chat.inceptionlabs.ai/](https://chat.inceptionlabs.ai/)
- **S2 — Deployed stylesheet:** [0cgm-x4dz_snt.css](https://chat.inceptionlabs.ai/_next/static/immutable/chunks/0cgm-x4dz_snt.css)
- **E1 — Measured geometry:** `responsive-measurements.json`, supplied with this extraction.
- **E2 — Prompt evidence:** `PROMPTS.json` and `refresh-log.json`, supplied with this extraction.

The initial full-page screenshot service produced elongated documents and misleading vertical positions. Those positions were discarded. The measurements below come from normal viewport inspection and the live DOM, where the content is correctly centered. Browser access initially returned a 403, but the independent public scraper and its live inspection session returned the page successfully.

All dimensions below use **CSS pixels**, which are appropriate to interface layout. The actual on-screen physical size depends on the display and browser scaling.

## 2. Visual character and hierarchy

The visual system is restrained and mostly monochrome: a charcoal application shell, subtly lighter input surfaces, thin neutral borders, bright inverse controls, and small teal line icons. Large empty areas frame a narrow central interaction column. Most hierarchy comes from spacing, surface contrast, and text color rather than large headings or decorative effects. The measured composer, suggestion controls, playground links, and API action have no box shadow; the cookie notice’s Close button separately declares a shadow. [S1, S2, E1]

The central hierarchy is:

1. Brand mark and wordmark.
2. Muted animated subline.
3. Voice, Search, and Decide playground links.
4. Right-aligned Diffusion Effect switch.
5. Message composer and toolbar.
6. Suggested-prompt accordion.
7. Small centered terms/privacy copy.

The header spans the viewport and contains a history-menu button, brand link, playground navigation, theme toggle, and API call to action. A history drawer exists in the DOM and is initially translated off-screen. [S1]

**Brand typography distinction:** the large serif-looking wordmark is a PNG image. The interface text uses Mona Sans. Do not infer a serif heading font from the logo artwork. [S1, S2]

## 3. Semantic colors

The source has **44 semantic custom properties per theme**, with identical property names in light and dark mode. The table below contains the core roles; the complete sets are preserved in `design-tokens.css` and `design-tokens.json`. Values below are normalized to six-digit hex for readability, while the exports retain source literals. [S2]

| Role / source token | Dark | Light | Observed or declared use |
| --- | --- | --- | --- |
| `--surface` | `#111111` | `#FFFFFF` | Visible application shell and header |
| `--background` | `#0A0A0A` | `#FFFFFF` | Body background beneath the shell |
| `--surface-alt` | `#1A1A1A` | `#F5F5F5` | Composer, suggestions, diffusion control |
| `--surface-hover` | `#222222` | `#EBEBEB` | Hover fill and small circular controls |
| `--surface-elevated` | `#161616` | `#FAFAFA` | Declared elevated surface |
| `--surface-code` | `#0D0D0D` | `#F8F8F8` | Declared code surface |
| `--surface-citation` | `#1E1E1E` | `#F0F0F0` | Declared citation surface |
| `--edge` | `#333333` | `#D4D4D4` | Composer, accordion, control borders |
| `--edge-soft` | `#2A2A2A` | `#E5E5E5` | Declared soft divider |
| `--edge-dim` | `#222222` | `#EEEEEE` | Header divider and playground outlines |
| `--edge-hover` | `#444444` | `#BBBBBB` | Stronger hovered border |
| `--fg` | `#EDEDED` | `#111111` | Primary labels and typed text |
| `--fg-secondary` | `#DDDDDD` | `#333333` | Header links and model label |
| `--fg-tertiary` | `#CCCCCC` | `#555555` | Declared tertiary text |
| `--fg-muted` | `#999999` | `#666666` | Hero subline, descriptions, muted controls |
| `--fg-dimmed` | `#888888` | `#777777` | Declared dimmed text |
| `--fg-faint` | `#777777` | `#888888` | Prompt secondary line and legal links |
| `--fg-ghost` | `#666666` | `#999999` | Composer placeholder and inactive icons |
| `--fg-invisible` | `#555555` | `#AAAAAA` | Landing-page legal copy |
| `--cta-bg` / `--cta-fg` | `#FFFFFF` / `#000000` | `#111111` / `#FFFFFF` | API action |
| `--btn-bg` / `--btn-fg` | `#555555` / `#FFFFFF` | `#111111` / `#FFFFFF` | Send control |
| `--btn-hover` | `#666666` | `#333333` | Declared send hover fill |
| `--toggle-on-bg` / `--toggle-on-knob` | `#FFFFFF` / `#111111` | `#111111` / `#FFFFFF` | Enabled diffusion switch |
| `--accent-voice`, `--accent-search`, `--accent-decide` | `#17C3C3` | `#17C3C3` | Teal playground icons |
| `--link` | `#60A5FA` | `#2563EB` | Declared content-link color |
| `--code-accent` | `#EB5757` | `#D63384` | Declared code accent |

Apply `--surface` to the app shell. Applying only the body’s `--background` would make the dark landing page too dark. Automated branding output mixed code-syntax colors into its primary palette; those classifications were rejected in favor of the source variables and computed component colors. [S2, E1]

The neutral hierarchy continues through tooltips, modals, scrollbars, resize controls, and blockquotes in the exported palette. These roles exist in the stylesheet; their complete interactive components were not opened during this landing-page inspection.

## 4. Typography

### Font family

The font-face rule declares **Mona Sans**, normal style, variable weight **200–900**, `font-display: swap`, loaded from `/fonts/MonaSans.woff2`. The body fallback stack is: [S2]

```css
font-family: "Mona Sans", Archivo, Vazirmatn,
  -apple-system, BlinkMacSystemFont, ui-sans-serif, system-ui,
  "Segoe UI", Roboto, Ubuntu, Cantarell, "Noto Sans",
  sans-serif, "Helvetica Neue", Arial;
```

The body uses `font-size: 1rem`, a computed 24 px line height, and `letter-spacing: .01em`. In the inspected environment, the root font size is 16 px. The logo’s letterforms are supplied as artwork. The font binary is referenced, not included in the package. [S1, S2, E1]

### Used text styles

| Element | Desktop ≥640 px | Mobile <640 px | Weight / other detail |
| --- | --- | --- | --- |
| Body foundation | 16 / 24 px | 16 / 24 px | 400; `.01em` body tracking |
| Hero subline | 18 / 28 px | 14 / 20 px | 400; `.025em` tracking |
| Composer text | 16 / 22 px | 16 / 22 px | 400; `leading-snug` |
| Header link text | 14 / 20 px | Hidden | Regular; icons remain |
| API action | 14 / 20 px | 12 / 16 px | 500 |
| Playground title | 12 / 16 px | 12 / 16 px | 500 |
| Playground description | 12 / 16 px | Hidden | 400; muted |
| Diffusion control | 14 / 20 px | 12 / 16 px | 400 |
| Suggested-prompt label | 14 / 20 px | 14 / 20 px | 500 |
| Prompt title | 14 / 20 px | 14 / 20 px | 500; can wrap |
| Prompt description | 12 / 16 px | 12 / 16 px | Faint; visually clamped to one line |
| Model label | 14 / 20 px | Hidden | 500 |
| Legal copy | 12 / 16 px | 12 / 16 px | Faint; centered |
| History explanatory copy | 11 px, line height 1.625 | Same declared style | Drawer content; source observed |

Source: rendered component classes in S1, typography utilities in S2, and E1 measurements. A button’s parent can compute to 16 px while its nested visible label is 14 px; the table reports the visible label’s style.

The shared stylesheet also declares 20, 24, and 60 px text sizes. They are exported as foundation values, without treating them as landing-page heading styles.

## 5. Spacing, borders, and radii

The spacing base is **0.25rem = 4 px**. Common values are 4, 8, 12, 16, 20, 24, 32, and 40 px, with half-step values such as 6, 10, and 18 px where the controls need them. [S2]

| Token / application | Value |
| --- | --- |
| `--radius-sm` | 4 px |
| `--radius-md` | 6 px |
| `--radius-lg` | 8 px; header icon buttons and API CTA |
| `--radius-xl` | 12 px; playground links, accordion trigger, prompt rows |
| `--radius-2xl` | 16 px; composer |
| Pill / round controls | Fully rounded |
| Standard border | 1 px solid |
| Prompt row separation | 6 px |
| Trigger-to-expanded-list separation | 8 px |
| Composer-to-suggestions separation | 12 px |
| Suggestions-to-legal-copy separation | 16 px |
| Hero bottom margin | 40 px desktop; 24 px mobile |

The source compiles fully rounded corners to an extremely large radius. A convenient `9999px` pill value, where provided in the export, is explicitly labeled as a normalization rather than an exact source token. Core landing-page surfaces measured `box-shadow: none`. [S2, E1]

## 6. Responsive layout

### Breakpoints

| Source breakpoint | Width at 16 px root | Landing-page consequence |
| --- | --- | --- |
| `xs` | **475 px** | Header wordmark becomes visible at 70 px wide |
| `sm` / `40rem` | **640 px** | Larger header/brand, navigation labels, playground descriptions, model label, and thinking-mode label appear; larger spacing applies |
| `md` / `48rem` | **768 px** | Cookie notice changes from stacked to horizontal layout |
| `lg` / `64rem` | 1024 px | Declared in shared stylesheet; no distinct landing-shell change established here |
| `xl` / `80rem` | 1280 px | Declared in shared stylesheet; no distinct landing-shell change established here |
| `2xl` / `96rem` | 1536 px | Declared in shared stylesheet; no distinct landing-shell change established here |

These are read from S2, including the custom 475 px breakpoint. They are not inferred from framework defaults.

### Desktop and mobile comparison

| Property | Desktop at 1440 × 1000 | Mobile at 390 × 844 |
| --- | --- | --- |
| Shell | `height: 100dvh`, column flex | Same |
| Header inner row | 56 px high | 48 px high |
| Header including divider | 57 px | 49 px |
| Header horizontal padding | 20 px | 12 px |
| Main horizontal padding | 16 px minimum | 12 px |
| Central content width | **680 px maximum**, centered | **366 px** = viewport minus 24 px |
| Main vertical alignment | Centered in remaining height | Same |
| Header brand mark | 24 × 24 px | 20 × 20 px |
| Header wordmark | 90 px wide | Hidden at 390 px; 70 px wide from 475–639 px |
| Hero brand mark | 44 × 44 px | 32 × 32 px |
| Hero wordmark | 220 px wide, intrinsic height | 150 px wide, intrinsic height |
| Gap between hero mark and wordmark | 16 px | 10 px |
| Playground links | Icon, title, description; wrapped to two rows at this content width | Icon and title only; three fit on one row |
| Composer empty height | **94 px** measured | **88 px** measured |
| Textarea horizontal padding | 20 px | 12 px |
| Toolbar horizontal / bottom padding | 12 / 10 px | 8 / 8 px |
| Web-search button | 36 × 36 px | 32 × 32 px |
| Thinking control | Icon, Medium label, chevron | Icon only |
| Model label | Visible | Hidden |
| Voice, recording, send controls | Visible | Visible |
| Diffusion pill height | 38 px | 34 px |
| API CTA height | 32 px | 24 px |
| Suggestions trigger height | 50 px | 50 px |
| Open suggestion scroll area | 256 px maximum | 256 px maximum |

Source: S1, S2, E1. Component heights are observed empty-state results, not all rigid height declarations; textarea content and text wrapping can change layout.

The page uses a single component tree with responsive visibility and spacing. It does not need a separate mobile template. In the inspected dark view, opening the accordion adds **264 px** to the central stack—8 px separation plus a 256 px scroll viewport. The centered stack shifts **132 px upward** at both inspected widths. This behavior follows from centering the whole content block, rather than fixing the composer to a screen coordinate. [E1]

### Measured geometry

| State | Content width | Content top | Content height | Composer top | Composer height |
| --- | ---: | ---: | ---: | ---: | ---: |
| Desktop, closed | 680 px | 298.58 px | 459.84 px | 570.42 px | 94 px |
| Desktop, open | 680 px | 166.58 px | 723.84 px | 438.42 px | 94 px |
| Mobile, closed | 366 px | 256.50 px | 379.98 px | 438.48 px | 88 px |
| Mobile, open | 366 px | 124.50 px | 643.98 px | 306.48 px | 88 px |

These coordinates are reference measurements for the stated viewport heights. They should not be hardcoded as layout tokens. [E1]

## 7. Component specifications

### Header and navigation

The header has a one-pixel `--edge-dim` bottom border and `--surface` fill. Its inner row uses `justify-between`; neither the header nor its brand links are constrained to the 680 px chat width. Header icon buttons are 32 px squares with 8 px corners. Default muted icon color moves toward the primary foreground on hover, with a `--surface-hover` fill. Playground navigation links use 8 px corners and 8 × 6 px padding. Their words are hidden below 640 px. [S1, S2]

The API link is a compact inverse rectangle with 8 px corners: horizontal/vertical padding of 16/6 px on desktop and 12/4 px on mobile. Its declared hover changes opacity to 0.8 over 150 ms. [S1, S2, E1]

### Playground links

Each link is an inline flex item with an 8 px gap, 12 × 8 px padding, 12 px corners, a one-pixel dim border, and a 16 px teal stroke icon. The group is centered, wraps, and has an 8 px gap. Descriptions disappear below 640 px. A source-declared hover strengthens the border and adds the hover surface. [S1, S2, E1]

### Diffusion switch

The enclosing pill is aligned to the composer’s right edge, with a 12 px bottom gap. It has a 36 × 20 px switch track, a 16 px knob, 2 px top inset, and fully rounded corners. The enabled state uses the inverse palette: white track/dark knob in dark mode. The control exposes `aria-pressed="true"` in the inspected state. The outer pill uses 16/8 px desktop padding, 12/6 px mobile padding, and a one-pixel border. [S1, S2, E1]

### Composer and toolbar

The composer is one bordered panel, with 16 px corners and `--surface-alt` fill. The textarea has no separate border or background, cannot be manually resized, and uses a 16 px font with a 22 px line height. Its vertical padding is 12 px top and 6 px bottom. The empty textarea measured 40 px high during normal viewport inspection. Some separate rendered page captures contained a 19 px inline height; the reason for that capture difference was not established, so the live viewport measurement is used here. [S1, E1]

The lower toolbar distributes search/thinking controls on the left and model/voice/record/send controls on the right. Search and thinking controls use bright inverse fills in their captured enabled states. The send button is 32 px square with a 16 px arrow icon and is disabled when empty, using opacity 0.3 and a not-allowed cursor. The voice and recording buttons remain present on mobile. [S1, S2, E1]

The thinking control exposes an expandable listbox relationship and labels the captured setting as Medium. The menu’s option states and keyboard behavior were not tested. Voice/recording controls were inspected without requesting microphone access or starting a recording.

### Suggested-prompt accordion

The trigger spans the content width, measures 50 px high, and uses 16 × 10 px padding, 12 px corners, a one-pixel `--edge` border, and `--surface-alt` fill. Its 14 px medium label is paired with a 16 px suggestion icon. The arrow sits inside a 28 px circular hover-colored surface and rotates on expansion. The arrow points upward when collapsed and downward when open in the captured implementation. [S1, S2, E1]

The expandable wrapper uses a grid track and opacity animation: `0fr`/0 when closed, `1fr`/1 when open. Its clipped inner wrapper contains an 8 px top gap and a scroll area capped at 256 px. All eleven suggestion buttons exist in the captured DOM even while the wrapper is closed. A DOM extraction therefore returns the full displayed collection without requiring all rows to be simultaneously visible. [S1, E1, E2]

Rows are full-width, left aligned, with a 1 px transparent default border, 12 px corners, 16 × 10 px padding, `--surface-alt` fill, and a 6 px gap. A single-line title with no description produces a 42 px row; wrapping to two lines produces 62 px in the mobile capture. Secondary descriptions are 12 px, faint, and clamped to one visible line. The complete description strings remain in the extracted prompt data. Hover changes the transparent border to `--edge`. [S1, S2, E1]

### History drawer and cookie notice

The history drawer is source-declared as a fixed left panel: 288 px wide, full height, `z-index: 50`, a right border, and a 200 ms translation transition. It is initially off-screen and marked `aria-hidden`. Its open state was not part of the measured responsive states. [S1]

The cookie notice is source-declared as a fixed full-width bottom panel at `z-index: 100`, with 16 px padding, an alternate surface, and a top border. Its inner content is capped at 1280 px. Below 768 px it stacks its explanatory text and Close button; at 768 px and above it uses a row. It was dismissed in the anonymous inspection session so the landing layout could be measured unobstructed. The initial notice measurement is retained in E1. [S1, S2, E1]

## 8. Motion and interaction evidence

| Treatment | Source value / observation | Evidence status |
| --- | --- | --- |
| General color/opacity transition | 150 ms; `cubic-bezier(.4, 0, .2, 1)` | Source and computed |
| Accordion height/opacity | 300 ms; `cubic-bezier(0, 0, .2, 1)` | Source, computed, opening/closing verified |
| Accordion arrow rotation | 200 ms | Source declared; state change visually verified |
| History drawer translation | 200 ms | Source declared |
| Hero text reveal | Scrambled transitional characters resolve to readable text; a captured span declared 100 ms linear opacity transition | Observed in differing render states; full timing algorithm unverified |
| Prompt order | All 11 entries retained; five distinct orders across five fresh captures | Capture verified; randomization algorithm unverified |

The stylesheet contains additional animation classes for Voice/Decide and a reduced-motion rule scoped to specific Decide animations. Their presence does not establish that the chat landing page’s text reveal or accordion respects reduced motion. Reusing the design in a new implementation should add an explicit reduced-motion treatment for those interactions; that would be an implementation improvement, not an extracted behavior. [S2]

## 9. Asset references

| Asset referenced by the page | Use | Observed rendered size |
| --- | --- | --- |
| `/logo-dark.png` | Light brand mark on dark backgrounds, reused in header/hero/model label | Header 20→24 px; hero 32→44 px; model 16 px |
| `/logotype-dark.png` | Wordmark artwork | Header 70→90 px where visible; hero 150→220 px |
| `/suggested_prompts.png` | Suggestion glyph, with a dark-mode invert class | 16 × 16 px |
| `/fonts/MonaSans.woff2` | Variable interface font | Weight range 200–900 |
| `/favicon.ico?favicon.3jfymrx974buy.ico` | Browser favicon reference | Metadata asset |
| `/favicon.svg` | Alternate favicon | Metadata asset |
| `/apple-touch-icon.png` | Touch icon | Metadata asset |

Image asset paths are from S1 and the font path is from S2. The page uses Next’s image endpoint with responsive widths for the visible PNGs. These are references to source assets, not claims that the original asset binaries are included. Icons such as search, microphone, theme, and send are inline SVG, generally 16–20 px with 1.5 px strokes; the send arrow uses a heavier 2.5 px stroke. [S1]

No photography, large illustration, texture, or decorative background image is used in the inspected landing page. The main identity comes from the logo, type, surfaces, and spacing.

## 10. Implementation guidance

The token exports retain source property names, so the appearance can be reconstructed using ordinary CSS, CSS variables, or a utility framework. The following semantic class names are suggested implementation names, not names copied from the site’s source. The values map to inspected layout rules. [S1, S2, E1]

```css
.chat-shell {
  display: flex;
  flex-direction: column;
  height: 100dvh;
  background: var(--surface);
  color: var(--fg);
}

.chat-main {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-inline: 12px;
}

.chat-content { width: 100%; max-width: 680px; }

.chat-composer {
  background: var(--surface-alt);
  border: 1px solid var(--edge);
  border-radius: 16px;
}

.prompt-expander {
  display: grid;
  grid-template-rows: 0fr;
  opacity: 0;
  transition: grid-template-rows 300ms cubic-bezier(0, 0, .2, 1),
              opacity 300ms cubic-bezier(0, 0, .2, 1);
}
.prompt-expander[data-open="true"] {
  grid-template-rows: 1fr;
  opacity: 1;
}
.prompt-expander__clip { overflow: hidden; }
.prompt-list { margin-top: 8px; max-height: 256px; overflow-y: auto; }

.header-wordmark { display: none; width: 70px; }
.desktop-label { display: none; }
@media (min-width: 475px) {
  .header-wordmark { display: block; }
}
@media (min-width: 40rem) {
  .chat-main { padding-inline: 16px; }
  .header-wordmark { width: 90px; }
  .desktop-label { display: inline; }
}
```

Keep the expanded suggestion list inside the centered content stack if matching the observed repositioning. Maintain auto height for prompt rows so longer titles wrap on mobile. Use title and description fields separately from `PROMPTS.json`; the description can be visually clamped while preserving its full text for reuse.

The source includes compact mobile controls, low-contrast secondary copy, `outline-none` on the textarea, and a viewport declaration that restricts zoom alongside a second ordinary viewport declaration. These are source observations, not recommendations for a new product. Larger touch targets, visible focus treatment, unrestricted zoom, and a reduced-motion variant can be added as deliberate improvements. Their behavior was not audited here.

## 11. Collection result and practical limits

The separate prompt deliverables contain **11 unique displayed suggestions**, each seen in all five collection captures: **55 observations**, **five different orders**, and **zero added or removed entries**. The three additional fresh loads did not reveal more suggestions. The category grouping in those files is editorial. [E2]

Exact title and description strings are preserved. Three prompts have a secondary description; their combined text is explicitly reconstructed by joining the display title and description with one space. Clicking a prompt to inspect its insertion/submission payload was not required for the visible collection and was not performed. This extraction therefore does not establish a larger private catalog or the exact click payload.

The measured component states are dark-mode landing states with an empty composer and no conversations. Conversation output formatting, generated artifacts, completed voice flows, menu contents, hover timing on physical touch devices, authentication, and other playground routes were not exercised. Tokens for some of those surfaces are still present in the source export and clearly labeled as declared values.

## Included files

| File | Purpose |
| --- | --- |
| `DESIGN.md` | This specification |
| `design-tokens.css` | Reusable source color/foundation tokens and clearly marked aliases |
| `design-tokens.json` | Machine-readable token values, provenance, and observations |
| `responsive-measurements.json` | Desktop/mobile measured component geometry and state styles |
| `PROMPTS.md` | Readable exact prompt collection |
| `PROMPTS.json` | Structured prompt fields, IDs, categories, and observed positions |
| `refresh-log.json` | Five capture orders, membership comparison, timestamps, and hashes |

