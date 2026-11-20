/* Renders assets/icon-180.png — the storefront tile for the plugin market.
   Pure JS: no canvas, no ImageMagick. Supersampled 3x then box-downsampled. */
import { deflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';

const SIZE = 180;
const SS = 3;
const W = SIZE * SS;

const hex = (value) => [parseInt(value.slice(1, 3), 16), parseInt(value.slice(3, 5), 16), parseInt(value.slice(5, 7), 16)];
const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

const SPECTRUM = ['#f59e0b', '#f43f5e', '#ec4899', '#6366f1', '#06b6d4', '#10b981'].map(hex);
function spectrumAt(t) {
  const scaled = ((t % 1) + 1) % 1 * (SPECTRUM.length - 1);
  const index = Math.min(SPECTRUM.length - 2, Math.floor(scaled));
  return mix(SPECTRUM[index], SPECTRUM[index + 1], scaled - index);
}

const BG_TOP = hex('#0b1a26');
const BG_BOTTOM = hex('#050b12');
const CORE = hex('#a5f3fc');
const DISC = hex('#22d3ee');
const DISC_OUTER = hex('#4f46e5');

const CX = 0.5, CY = 0.455;      // disc centre, as fractions of the tile
const DISC_R = 0.245;
const RING_1 = 0.318, RING_1_W = 0.016;
const RING_2 = 0.393, RING_2_W = 0.009;
const STARS = [
  { x: 0.245, y: 0.225, r: 0.012, a: 0.95 },
  { x: 0.78, y: 0.275, r: 0.009, a: 0.8 },
  { x: 0.715, y: 0.735, r: 0.0075, a: 0.7 },
  { x: 0.2, y: 0.66, r: 0.006, a: 0.6 },
];

const pixels = new Float64Array(W * W * 3); // premultiplied rgb, 0..1
const alpha = new Float64Array(W * W);

for (let y = 0; y < W; y += 1) {
  for (let x = 0; x < W; x += 1) {
    const u = (x + 0.5) / W;
    const v = (y + 0.5) / W;
    const index = y * W + x;

    // rounded-square mask
    const R = 0.24;
    const dx = Math.max(Math.abs(u - 0.5) - (0.5 - R), 0);
    const dy = Math.max(Math.abs(v - 0.5) - (0.5 - R), 0);
    const outside = Math.hypot(dx, dy);
    if (outside > R) continue;

    let color = mix(BG_TOP, BG_BOTTOM, v);
    const d = Math.hypot((u - CX) * (SIZE / SIZE), v - CY);

    // nebula disc: hot core, cool rim
    if (d < DISC_R) {
      const t = d / DISC_R;
      const disc = t < 0.42 ? mix(CORE, DISC, t / 0.42) : mix(DISC, DISC_OUTER, (t - 0.42) / 0.58);
      color = mix(color, disc, 0.92 - 0.25 * t);
    }
    // outer halo
    if (d > DISC_R && d < DISC_R + 0.16) {
      const t = (d - DISC_R) / 0.16;
      color = mix(color, DISC_OUTER, 0.24 * (1 - t) ** 2);
    }
    // spectrum rings, hue follows the angle
    const angle = (Math.atan2(v - CY, u - CX) / (Math.PI * 2) + 1) % 1;
    const ring = (radius, width) => {
      const edge = Math.abs(d - radius);
      if (edge > width) return 0;
      return 1 - edge / width;
    };
    const r1 = ring(RING_1, RING_1_W);
    const r2 = ring(RING_2, RING_2_W);
    if (r1 > 0) color = mix(color, spectrumAt(angle + 0.08), 0.95 * r1);
    if (r2 > 0) color = mix(color, spectrumAt(angle + 0.5), 0.8 * r2);

    // stars
    for (const star of STARS) {
      const ds = Math.hypot(u - star.x, v - star.y);
      if (ds < star.r * 2.2) {
        const falloff = Math.max(0, 1 - ds / (star.r * 2.2));
        color = mix(color, [244, 251, 253], star.a * falloff ** 2);
      }
    }

    pixels[index * 3] = color[0];
    pixels[index * 3 + 1] = color[1];
    pixels[index * 3 + 2] = color[2];
    alpha[index] = 1;
  }
}

// box downsample
const out = Buffer.alloc(SIZE * SIZE * 4);
for (let y = 0; y < SIZE; y += 1) {
  for (let x = 0; x < SIZE; x += 1) {
    let r = 0, g = 0, b = 0, a = 0;
    for (let sy = 0; sy < SS; sy += 1) {
      for (let sx = 0; sx < SS; sx += 1) {
        const index = (y * SS + sy) * W + (x * SS + sx);
        r += pixels[index * 3];
        g += pixels[index * 3 + 1];
        b += pixels[index * 3 + 2];
        a += alpha[index];
      }
    }
    const n = SS * SS;
    const offset = (y * SIZE + x) * 4;
    const av = a / n;
    // un-premultiply for the straight-alpha PNG
    out[offset] = Math.round(Math.min(255, av ? (r / n) / av : 0));
    out[offset + 1] = Math.round(Math.min(255, av ? (g / n) / av : 0));
    out[offset + 2] = Math.round(Math.min(255, av ? (b / n) / av : 0));
    out[offset + 3] = Math.round(av * 255);
  }
}

// PNG encode
const raw = Buffer.alloc(SIZE * (SIZE * 4 + 1));
for (let y = 0; y < SIZE; y += 1) {
  raw[y * (SIZE * 4 + 1)] = 0;
  out.copy(raw, y * (SIZE * 4 + 1) + 1, y * SIZE * 4, (y + 1) * SIZE * 4);
}

const CRC_TABLE = (() => {
  const table = new Int32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c;
  }
  return table;
})();
function crc32(buffer) {
  let c = 0xffffffff;
  for (const byte of buffer) c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'latin1'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([length, body, crc]);
}

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(SIZE, 0);
ihdr.writeUInt32BE(SIZE, 4);
ihdr[8] = 8;   // bit depth
ihdr[9] = 6;   // RGBA
const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk('IHDR', ihdr),
  chunk('IDAT', deflateSync(raw, { level: 9 })),
  chunk('IEND', Buffer.alloc(0)),
]);

mkdirSync('D:/DeepSeekharness/dsh-nebula-spectrum/assets', { recursive: true });
writeFileSync('D:/DeepSeekharness/dsh-nebula-spectrum/assets/icon-180.png', png);
console.log('icon-180.png', png.length + 'B');
