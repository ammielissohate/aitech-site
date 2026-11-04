/**
 * Visuel du hero : les trois dimensions de AiTech dans un même système.
 *  - BRAND : le noyau, une identité dense et lumineuse.
 *  - VISIBILITY : des ondes qui se propagent depuis le noyau vers l'audience.
 *  - GROWTH : une trajectoire ascendante qui sort du système.
 *
 * SVG + CSS uniquement (aucune librairie). Les animations sont définies dans globals.css
 * et neutralisées si le visiteur a activé la réduction des animations.
 */
const chips = [
  { number: "01", label: "Brand", detail: "Image", position: "left-0 top-[18%]" },
  { number: "02", label: "Visibility", detail: "Audience", position: "right-0 top-[48%] sm:-right-2" },
  { number: "03", label: "Growth", detail: "Prospects", position: "left-[8%] bottom-[6%]" },
];

export function HeroVisual() {
  return (
    <div
      role="img"
      aria-label="Un noyau représentant la marque, entouré d'ondes de visibilité et traversé par une courbe de croissance."
      className="relative mx-auto aspect-square w-full max-w-[520px]"
    >
      <svg viewBox="0 0 520 520" className="absolute inset-0 size-full" aria-hidden="true">
        <defs>
          <radialGradient id="hero-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.45" />
            <stop offset="60%" stopColor="#7C3AED" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="hero-core" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#A78BFA" />
            <stop offset="55%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#3B1A7A" />
          </linearGradient>
          <linearGradient id="hero-growth" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#A78BFA" stopOpacity="0" />
            <stop offset="35%" stopColor="#A78BFA" />
            <stop offset="100%" stopColor="#FFFFFF" />
          </linearGradient>
        </defs>

        {/* Halo d'ambiance */}
        <circle cx="260" cy="260" r="260" fill="url(#hero-glow)" />

        {/* Orbites : la présence digitale, structurée */}
        <circle cx="260" cy="260" r="232" fill="none" stroke="rgb(255 255 255 / 0.07)" strokeDasharray="2 7" />
        <circle cx="260" cy="260" r="168" fill="none" stroke="rgb(255 255 255 / 0.1)" />
        <g className="hero-orbit">
          <circle cx="260" cy="28" r="4" fill="#A78BFA" />
        </g>
        <g className="hero-orbit hero-orbit--reverse">
          <circle cx="428" cy="260" r="3" fill="#FFFFFF" fillOpacity="0.8" />
        </g>

        {/* VISIBILITY : ondes qui se propagent */}
        <g fill="none" stroke="#A78BFA" strokeWidth="1.2">
          <circle className="hero-wave" cx="260" cy="260" r="200" />
          <circle className="hero-wave" cx="260" cy="260" r="200" />
          <circle className="hero-wave" cx="260" cy="260" r="200" />
        </g>

        {/* BRAND : le noyau */}
        <circle cx="260" cy="260" r="84" fill="rgb(124 58 237 / 0.12)" stroke="rgb(167 139 250 / 0.35)" />
        <circle cx="260" cy="260" r="58" fill="url(#hero-core)" />
        <circle cx="244" cy="242" r="16" fill="#FFFFFF" fillOpacity="0.16" />

        {/* GROWTH : trajectoire ascendante */}
        <path
          className="hero-growth"
          pathLength={1}
          d="M70 410 C 170 400, 215 330, 262 286 S 380 170, 468 82"
          fill="none"
          stroke="url(#hero-growth)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path d="M446 80 L470 80 L470 104" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="168" cy="382" r="5" fill="#09090F" stroke="#A78BFA" strokeWidth="2" />
        <circle cx="352" cy="200" r="5" fill="#09090F" stroke="#FFFFFF" strokeWidth="2" />
      </svg>

      {/* Étiquettes des trois piliers */}
      <div aria-hidden="true">
        {chips.map((chip) => (
          <div
            key={chip.label}
            className={`hero-chip glass absolute ${chip.position} flex items-center gap-3 rounded-2xl border border-line px-3.5 py-2.5 shadow-[0_10px_40px_-10px_rgb(0_0_0/0.6)]`}
          >
            <span className="font-display text-xs font-semibold text-brand-3">{chip.number}</span>
            <span className="leading-tight">
              <span className="block font-display text-sm font-semibold text-white">{chip.label}</span>
              <span className="block text-[11px] text-muted">{chip.detail}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
