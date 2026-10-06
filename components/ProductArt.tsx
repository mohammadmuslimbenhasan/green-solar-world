import type { Product, CategorySlug } from '@/data/catalog';

// Inline SVG product illustrations — one distinct graphic per category family.
// No external images; everything is generated at build time.

type ArtProps = {
  category: CategorySlug | string;
  collection?: string;
  className?: string;
  id?: string;
};

function bg(collection?: string): { from: string; to: string; glow: string } {
  switch (collection) {
    case 'industrial-lighting':
      return { from: '#1a2138', to: '#0d1220', glow: '#f5b301' };
    case 'commercial-lighting':
      return { from: '#152036', to: '#0b0f19', glow: '#ffd34d' };
    case 'electrical-materials':
      return { from: '#1d2430', to: '#0e1118', glow: '#f5b301' };
    default:
      return { from: '#1b2540', to: '#0c101d', glow: '#ffc21a' };
  }
}

function Artwork({ category }: { category: string }) {
  switch (category) {
    // Square/round panels
    case 'led-slim-panel':
    case 'led-flat-panel':
      return (
        <g>
          <rect x="50" y="22" width="100" height="76" rx="6" fill="none" stroke="#f5b301" strokeWidth="3" />
          <rect x="60" y="32" width="80" height="56" rx="3" fill="rgba(245,179,1,0.14)" />
          <line x1="60" y1="44" x2="140" y2="44" stroke="rgba(245,179,1,0.45)" strokeWidth="2" />
          <line x1="60" y1="56" x2="140" y2="56" stroke="rgba(245,179,1,0.3)" strokeWidth="2" />
          <line x1="60" y1="68" x2="140" y2="68" stroke="rgba(245,179,1,0.45)" strokeWidth="2" />
          <line x1="60" y1="80" x2="140" y2="80" stroke="rgba(245,179,1,0.3)" strokeWidth="2" />
          <path d="M70 106 l-8 10 M100 106 v12 M130 106 l8 10" stroke="#ffd34d" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      );
    case 'led-gimbals':
    case 'led-recessed-down-light':
      return (
        <g>
          <ellipse cx="100" cy="60" rx="46" ry="34" fill="none" stroke="#f5b301" strokeWidth="3" transform="rotate(-18 100 60)" />
          <ellipse cx="100" cy="60" rx="28" ry="19" fill="rgba(245,179,1,0.16)" transform="rotate(-18 100 60)" />
          <ellipse cx="100" cy="60" rx="12" ry="8" fill="#ffd34d" transform="rotate(-18 100 60)" />
          <path d="M62 96 q38 22 76 0" stroke="rgba(255,211,77,0.6)" strokeWidth="2" fill="none" strokeDasharray="4 5" />
        </g>
      );
    case 'led-ceiling-fixture':
      return (
        <g>
          <path d="M40 70 a60 60 0 0 1 120 0 z" fill="rgba(245,179,1,0.14)" stroke="#f5b301" strokeWidth="3" />
          <ellipse cx="100" cy="70" rx="60" ry="8" fill="none" stroke="#f5b301" strokeWidth="3" />
          <circle cx="100" cy="52" r="9" fill="#ffd34d" />
          <path d="M60 92 l-6 12 M100 96 v12 M140 92 l6 12" stroke="#ffd34d" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      );
    case 'led-motion-sensor-light':
    case 'led-flood-light':
      return (
        <g>
          <rect x="56" y="46" width="52" height="34" rx="8" fill="rgba(245,179,1,0.15)" stroke="#f5b301" strokeWidth="3" />
          <rect x="108" y="52" width="18" height="22" rx="4" fill="#ffd34d" />
          <path d="M132 40 l26 -14 M132 63 h30 M132 86 l26 14" stroke="rgba(255,211,77,0.75)" strokeWidth="3" strokeLinecap="round" />
          <circle cx="74" cy="98" r="5" fill="none" stroke="#f5b301" strokeWidth="2.5" />
          <path d="M82 96 q10 -6 18 0 M86 104 q6 -4 12 0" stroke="rgba(245,179,1,0.6)" strokeWidth="2" fill="none" />
        </g>
      );
    case 'led-under-cabinet-light':
    case 'led-strip-light':
      return (
        <g>
          <rect x="30" y="52" width="140" height="16" rx="8" fill="rgba(245,179,1,0.15)" stroke="#f5b301" strokeWidth="3" />
          <circle cx="55" cy="60" r="4" fill="#ffd34d" />
          <circle cx="80" cy="60" r="4" fill="#ffd34d" />
          <circle cx="105" cy="60" r="4" fill="#ffd34d" />
          <circle cx="130" cy="60" r="4" fill="#ffd34d" />
          <circle cx="150" cy="60" r="4" fill="#ffd34d" />
          <path d="M50 78 l-4 10 M80 78 v11 M110 78 v11 M140 78 l4 10" stroke="rgba(255,211,77,0.55)" strokeWidth="2" strokeLinecap="round" />
        </g>
      );
    case 'led-outdoor-garden-light':
      return (
        <g>
          <line x1="100" y1="66" x2="100" y2="112" stroke="#f5b301" strokeWidth="4" strokeLinecap="round" />
          <path d="M82 66 h36 l-6 -22 h-24 z" fill="rgba(245,179,1,0.16)" stroke="#f5b301" strokeWidth="3" strokeLinejoin="round" />
          <circle cx="100" cy="55" r="6" fill="#ffd34d" />
          <path d="M70 116 h60" stroke="rgba(245,179,1,0.5)" strokeWidth="3" strokeLinecap="round" />
          <path d="M60 44 q10 -10 20 0 M120 44 q10 -10 20 0" stroke="rgba(255,211,77,0.5)" strokeWidth="2" fill="none" />
        </g>
      );
    case 'led-wall-pack':
      return (
        <g>
          <rect x="36" y="34" width="34" height="72" rx="4" fill="none" stroke="rgba(245,179,1,0.55)" strokeWidth="3" />
          <rect x="70" y="44" width="46" height="52" rx="8" fill="rgba(245,179,1,0.16)" stroke="#f5b301" strokeWidth="3" />
          <rect x="116" y="54" width="12" height="32" rx="3" fill="#ffd34d" />
          <path d="M134 48 l24 -10 M134 70 h26 M134 92 l24 10" stroke="rgba(255,211,77,0.7)" strokeWidth="3" strokeLinecap="round" />
        </g>
      );
    case 'led-retrofit-corn-light':
      return (
        <g>
          <path d="M92 96 v14 a8 8 0 0 0 16 0 v-14 z" fill="rgba(245,179,1,0.3)" stroke="#f5b301" strokeWidth="3" />
          <ellipse cx="100" cy="52" rx="26" ry="42" fill="rgba(245,179,1,0.14)" stroke="#f5b301" strokeWidth="3" />
          <path d="M82 34 q18 8 36 0 M78 52 q22 10 44 0 M82 70 q18 8 36 0" stroke="rgba(255,211,77,0.6)" strokeWidth="2" fill="none" />
          <circle cx="100" cy="52" r="6" fill="#ffd34d" />
        </g>
      );
    case 'led-slim-canopy-light':
      return (
        <g>
          <rect x="40" y="44" width="120" height="34" rx="10" fill="rgba(245,179,1,0.14)" stroke="#f5b301" strokeWidth="3" />
          <line x1="52" y1="56" x2="148" y2="56" stroke="rgba(255,211,77,0.5)" strokeWidth="2" />
          <line x1="52" y1="66" x2="148" y2="66" stroke="rgba(255,211,77,0.3)" strokeWidth="2" />
          <path d="M66 88 l-8 12 M100 88 v14 M134 88 l8 12" stroke="#ffd34d" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      );
    case 'led-outdoor-shoebox-light':
    case 'led-post-top-light':
      return (
        <g>
          <line x1="72" y1="40" x2="72" y2="116" stroke="#f5b301" strokeWidth="5" strokeLinecap="round" />
          <rect x="72" y="38" width="72" height="30" rx="8" fill="rgba(245,179,1,0.15)" stroke="#f5b301" strokeWidth="3" />
          <rect x="138" y="44" width="10" height="18" rx="3" fill="#ffd34d" />
          <path d="M84 78 l-6 12 M104 78 v13 M124 78 l6 12" stroke="rgba(255,211,77,0.55)" strokeWidth="2" strokeLinecap="round" />
          <path d="M52 116 h44" stroke="rgba(245,179,1,0.5)" strokeWidth="3" strokeLinecap="round" />
        </g>
      );
    case 'led-linear-strip-fixture':
    case 'led-linear-strip-light':
      return (
        <g>
          <rect x="24" y="50" width="152" height="26" rx="13" fill="rgba(245,179,1,0.14)" stroke="#f5b301" strokeWidth="3" />
          <rect x="34" y="58" width="132" height="10" rx="5" fill="rgba(255,211,77,0.35)" />
          <path d="M50 86 l-5 10 M85 86 v11 M120 86 v11 M155 86 l5 10" stroke="rgba(255,211,77,0.55)" strokeWidth="2" strokeLinecap="round" />
        </g>
      );
    case 'led-vapor-tight-fixture':
      return (
        <g>
          <rect x="28" y="42" width="144" height="44" rx="10" fill="none" stroke="#f5b301" strokeWidth="3" />
          <rect x="38" y="52" width="124" height="24" rx="6" fill="rgba(245,179,1,0.16)" />
          <circle cx="38" cy="46" r="3" fill="#ffd34d" />
          <circle cx="162" cy="46" r="3" fill="#ffd34d" />
          <circle cx="38" cy="82" r="3" fill="#ffd34d" />
          <circle cx="162" cy="82" r="3" fill="#ffd34d" />
          <path d="M60 96 l-4 10 M100 96 v11 M140 96 l4 10" stroke="rgba(255,211,77,0.5)" strokeWidth="2" strokeLinecap="round" />
        </g>
      );
    case 'led-track-light':
      return (
        <g>
          <line x1="34" y1="40" x2="166" y2="40" stroke="#f5b301" strokeWidth="4" strokeLinecap="round" />
          <g transform="rotate(20 66 40)">
            <rect x="58" y="40" width="16" height="12" rx="3" fill="#ffd34d" />
            <path d="M58 52 l-8 24 h32 l-8 -24 z" fill="rgba(245,179,1,0.18)" stroke="#f5b301" strokeWidth="2.5" />
          </g>
          <g transform="rotate(-15 118 40)">
            <rect x="110" y="40" width="16" height="12" rx="3" fill="#ffd34d" />
            <path d="M110 52 l-8 24 h32 l-8 -24 z" fill="rgba(245,179,1,0.18)" stroke="#f5b301" strokeWidth="2.5" />
          </g>
          <path d="M52 92 l-6 12 M112 92 v12 M146 92 l6 12" stroke="rgba(255,211,77,0.5)" strokeWidth="2" strokeLinecap="round" />
        </g>
      );
    case 'exit-emergency-led-lighting':
      return (
        <g>
          <rect x="52" y="30" width="96" height="38" rx="6" fill="rgba(245,179,1,0.12)" stroke="#f5b301" strokeWidth="3" />
          <text x="100" y="57" textAnchor="middle" fontFamily="monospace" fontSize="20" fontWeight="bold" fill="#ffd34d">EXIT</text>
          <circle cx="70" cy="86" r="9" fill="rgba(255,211,77,0.4)" stroke="#f5b301" strokeWidth="2.5" />
          <circle cx="130" cy="86" r="9" fill="rgba(255,211,77,0.4)" stroke="#f5b301" strokeWidth="2.5" />
          <path d="M62 108 l-6 10 M100 108 v11 M138 108 l6 10" stroke="rgba(255,211,77,0.55)" strokeWidth="2" strokeLinecap="round" />
        </g>
      );
    case 'led-ufo-high-bay':
      return (
        <g>
          <line x1="100" y1="18" x2="100" y2="36" stroke="#f5b301" strokeWidth="4" strokeLinecap="round" />
          <ellipse cx="100" cy="62" rx="52" ry="26" fill="rgba(245,179,1,0.14)" stroke="#f5b301" strokeWidth="3" />
          <ellipse cx="100" cy="70" rx="34" ry="14" fill="rgba(255,211,77,0.3)" stroke="rgba(245,179,1,0.6)" strokeWidth="2" />
          <path d="M66 96 l-8 12 M100 96 v14 M134 96 l8 12" stroke="#ffd34d" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      );
    case 'led-linear-high-bay':
      return (
        <g>
          <line x1="70" y1="20" x2="70" y2="48" stroke="#f5b301" strokeWidth="3" />
          <line x1="130" y1="20" x2="130" y2="48" stroke="#f5b301" strokeWidth="3" />
          <rect x="40" y="48" width="120" height="32" rx="10" fill="rgba(245,179,1,0.14)" stroke="#f5b301" strokeWidth="3" />
          <rect x="52" y="58" width="96" height="12" rx="6" fill="rgba(255,211,77,0.35)" />
          <path d="M60 90 l-6 12 M100 90 v13 M140 90 l6 12" stroke="rgba(255,211,77,0.55)" strokeWidth="2" strokeLinecap="round" />
        </g>
      );
    // ── Electrical materials ──
    case 'device-box':
      return (
        <g>
          <rect x="52" y="34" width="96" height="72" rx="6" fill="rgba(245,179,1,0.1)" stroke="#f5b301" strokeWidth="3" />
          <circle cx="52" cy="52" r="7" fill="none" stroke="rgba(255,211,77,0.6)" strokeWidth="2.5" />
          <circle cx="148" cy="52" r="7" fill="none" stroke="rgba(255,211,77,0.6)" strokeWidth="2.5" />
          <circle cx="52" cy="88" r="7" fill="none" stroke="rgba(255,211,77,0.6)" strokeWidth="2.5" />
          <circle cx="148" cy="88" r="7" fill="none" stroke="rgba(255,211,77,0.6)" strokeWidth="2.5" />
          <circle cx="100" cy="70" r="10" fill="none" stroke="#ffd34d" strokeWidth="2.5" />
        </g>
      );
    case 'wire':
      return (
        <g>
          <circle cx="100" cy="66" r="38" fill="rgba(245,179,1,0.1)" stroke="#f5b301" strokeWidth="3" />
          <circle cx="100" cy="66" r="26" fill="none" stroke="rgba(255,211,77,0.5)" strokeWidth="2.5" />
          <circle cx="100" cy="66" r="14" fill="none" stroke="rgba(255,211,77,0.35)" strokeWidth="2" />
          <circle cx="100" cy="66" r="5" fill="#ffd34d" />
          <path d="M134 84 q26 14 18 34" stroke="#f5b301" strokeWidth="3" fill="none" strokeLinecap="round" />
        </g>
      );
    case 'device':
      return (
        <g>
          <rect x="66" y="30" width="68" height="80" rx="10" fill="rgba(245,179,1,0.1)" stroke="#f5b301" strokeWidth="3" />
          <circle cx="88" cy="58" r="6" fill="#ffd34d" />
          <circle cx="112" cy="58" r="6" fill="#ffd34d" />
          <line x1="88" y1="86" x2="112" y2="86" stroke="rgba(255,211,77,0.6)" strokeWidth="3" strokeLinecap="round" />
          <path d="M52 70 h-14 M148 70 h14" stroke="rgba(245,179,1,0.5)" strokeWidth="3" strokeLinecap="round" />
        </g>
      );
    case 'panel-board-breakers':
      return (
        <g>
          <rect x="52" y="26" width="96" height="88" rx="8" fill="rgba(245,179,1,0.08)" stroke="#f5b301" strokeWidth="3" />
          <rect x="64" y="38" width="72" height="14" rx="3" fill="rgba(255,211,77,0.25)" />
          {[0, 1, 2].map((r) =>
            [0, 1, 2, 3].map((c) => (
              <rect key={`${r}-${c}`} x={66 + c * 18} y={60 + r * 16} width="13" height="11" rx="2" fill="rgba(245,179,1,0.2)" stroke="rgba(255,211,77,0.55)" strokeWidth="1.5" />
            )),
          )}
        </g>
      );
    case 'disconnect-switch-fuses':
      return (
        <g>
          <rect x="58" y="30" width="84" height="80" rx="8" fill="rgba(245,179,1,0.08)" stroke="#f5b301" strokeWidth="3" />
          <rect x="70" y="44" width="60" height="20" rx="4" fill="rgba(255,211,77,0.2)" stroke="rgba(245,179,1,0.6)" strokeWidth="2" />
          <line x1="80" y1="54" x2="120" y2="54" stroke="#ffd34d" strokeWidth="3" strokeLinecap="round" />
          <path d="M88 84 l24 -12" stroke="#f5b301" strokeWidth="4" strokeLinecap="round" />
          <circle cx="88" cy="84" r="5" fill="#ffd34d" />
        </g>
      );
    case 'transformer':
      return (
        <g>
          <circle cx="100" cy="66" r="40" fill="rgba(245,179,1,0.08)" stroke="#f5b301" strokeWidth="3" />
          <circle cx="100" cy="66" r="30" fill="none" stroke="rgba(255,211,77,0.4)" strokeWidth="2" strokeDasharray="5 5" />
          <path d="M84 52 l12 14 -12 14 M116 52 l-12 14 12 14" stroke="#ffd34d" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      );
    case 'service-meter-sockets':
      return (
        <g>
          <circle cx="100" cy="68" r="38" fill="rgba(245,179,1,0.08)" stroke="#f5b301" strokeWidth="3" />
          <circle cx="100" cy="68" r="26" fill="none" stroke="rgba(255,211,77,0.5)" strokeWidth="2.5" />
          <path d="M100 42 v52 M74 68 h52" stroke="rgba(255,211,77,0.5)" strokeWidth="2" />
          <rect x="88" y="18" width="24" height="12" rx="4" fill="rgba(245,179,1,0.25)" stroke="#f5b301" strokeWidth="2" />
        </g>
      );
    case 'pvc-conduit-fittings':
    case 'emt-conduit-fittings':
      return (
        <g>
          <rect x="20" y="56" width="86" height="20" rx="10" fill="rgba(245,179,1,0.14)" stroke="#f5b301" strokeWidth="3" />
          <rect x="92" y="50" width="30" height="32" rx="6" fill="rgba(255,211,77,0.22)" stroke="#f5b301" strokeWidth="3" />
          <rect x="116" y="56" width="64" height="20" rx="10" fill="rgba(245,179,1,0.14)" stroke="#f5b301" strokeWidth="3" />
          <path d="M40 50 v-8 M60 50 v-8 M140 82 v8 M158 82 v8" stroke="rgba(255,211,77,0.5)" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      );
    case 'floor-heating-cable-thermostat':
      return (
        <g>
          <rect x="70" y="26" width="60" height="44" rx="8" fill="rgba(245,179,1,0.1)" stroke="#f5b301" strokeWidth="3" />
          <text x="100" y="54" textAnchor="middle" fontFamily="monospace" fontSize="16" fill="#ffd34d">23°</text>
          <path d="M40 96 q20 -18 40 0 t40 0 t40 0" stroke="#f5b301" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M40 108 q20 -18 40 0 t40 0 t40 0" stroke="rgba(255,211,77,0.45)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </g>
      );
    case 'bathroom-exhaust-fan':
      return (
        <g>
          <circle cx="100" cy="66" r="38" fill="rgba(245,179,1,0.08)" stroke="#f5b301" strokeWidth="3" />
          <circle cx="100" cy="66" r="26" fill="none" stroke="rgba(255,211,77,0.4)" strokeWidth="2" />
          <path d="M100 66 m0 -20 a20 20 0 0 1 17 10 l-17 10 z" fill="rgba(255,211,77,0.5)" />
          <path d="M100 66 m17 10 a20 20 0 0 1 -17 10 l0 -20 z" fill="rgba(255,211,77,0.32)" />
          <path d="M100 66 m-17 10 a20 20 0 0 1 0 -20 l17 10 z" fill="rgba(255,211,77,0.18)" />
          <circle cx="100" cy="66" r="5" fill="#ffd34d" />
        </g>
      );
    case 'vapor-barrier':
      return (
        <g>
          <rect x="34" y="34" width="132" height="10" rx="5" fill="rgba(245,179,1,0.2)" stroke="#f5b301" strokeWidth="2" />
          <rect x="34" y="54" width="132" height="10" rx="5" fill="rgba(245,179,1,0.3)" stroke="#f5b301" strokeWidth="2" />
          <rect x="34" y="74" width="132" height="10" rx="5" fill="rgba(245,179,1,0.2)" stroke="#f5b301" strokeWidth="2" />
          <rect x="34" y="94" width="132" height="10" rx="5" fill="rgba(245,179,1,0.3)" stroke="#f5b301" strokeWidth="2" />
        </g>
      );
    case 'emergency-smoke-alarm':
      return (
        <g>
          <circle cx="100" cy="60" r="34" fill="rgba(245,179,1,0.08)" stroke="#f5b301" strokeWidth="3" />
          <circle cx="100" cy="60" r="24" fill="none" stroke="rgba(255,211,77,0.35)" strokeWidth="2" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
            <line
              key={a}
              x1={100 + 28 * Math.cos((a * Math.PI) / 180)}
              y1={60 + 28 * Math.sin((a * Math.PI) / 180)}
              x2={100 + 34 * Math.cos((a * Math.PI) / 180)}
              y2={60 + 34 * Math.sin((a * Math.PI) / 180)}
              stroke="rgba(255,211,77,0.6)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          ))}
          <path d="M88 60 l9 9 l16 -18" stroke="#ffd34d" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M64 102 q36 16 72 0" stroke="rgba(245,179,1,0.5)" strokeWidth="2.5" fill="none" />
        </g>
      );
    default:
      return (
        <g>
          <circle cx="100" cy="66" r="38" fill="rgba(245,179,1,0.1)" stroke="#f5b301" strokeWidth="3" />
          <path d="M106 40 l-18 30 h14 l-8 24 l24 -32 h-14 z" fill="#ffd34d" />
        </g>
      );
  }
}

export default function ProductArt({ category, collection, className, id }: ArtProps) {
  const g = bg(collection);
  const uid = `${category.replace(/[^a-z0-9]/gi, '')}-${id ?? 'x'}`;
  return (
    <svg
      viewBox="0 0 200 132"
      role="img"
      aria-hidden="true"
      className={className}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id={`bg-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={g.from} />
          <stop offset="100%" stopColor={g.to} />
        </linearGradient>
        <radialGradient id={`gl-${uid}`} cx="0.5" cy="0.42" r="0.65">
          <stop offset="0%" stopColor={g.glow} stopOpacity="0.16" />
          <stop offset="100%" stopColor={g.glow} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="200" height="132" fill={`url(#bg-${uid})`} />
      <rect width="200" height="132" fill={`url(#gl-${uid})`} />
      <Artwork category={category} />
    </svg>
  );
}

export function ProductArtForProduct({ product, className }: { product: Product; className?: string }) {
  return (
    <ProductArt
      category={product.category}
      collection={product.collection}
      className={className}
      id={product.slug}
    />
  );
}
