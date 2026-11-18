// 실행: node scripts/test.mjs
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const slots = JSON.parse(
  readFileSync(join(root, 'skills/scene-prompt-remix/references/slots.json'), 'utf8')
);
await import(join(root, 'web/generator.js'));
const { buildPrompt, randomSelection } = globalThis.ScenePrompt;

const ORIGINAL =
  'Create a 3D scene using Three.js: a cute Korean tiger rides a bicycle along a coastal road in Korea. The tiger is actually riding the bicycle, pedaling with both feet, steering the handlebars with its front paws while its tail sways naturally, and the wheels rotate in sync with the pedaling. The motion is natural and smooth. The scene is lively and richly detailed, with a natural environment, dynamic effects, lighting and shadows, and interactive features. Make full use of your 3D modeling, animation, and visual design capabilities to create a polished, ready-to-run web piece.';

const base = { tech: 'three', subject: 'tiger', action: 'bicycle', setting: 'coast' };
assert.equal(buildPrompt(slots, { ...base, level: 2 }), ORIGINAL, '기본 조합은 원문과 같아야 한다');
assert.equal(
  buildPrompt(slots, { ...base, level: 1 }),
  'Create a 3D scene using Three.js: a cute Korean tiger rides a bicycle along a coastal road in Korea.'
);
assert.throws(() => buildPrompt(slots, { ...base, action: 'kayak', level: 2 }), /needs a water setting/);

let count = 0;
for (const tech of slots.tech)
  for (const subject of slots.subjects)
    for (const action of slots.actions)
      for (const setting of slots.settings.filter((s) => s.terrain === action.terrain)) {
        const p = buildPrompt(slots, {
          tech: tech.id, subject: subject.id, action: action.id, setting: setting.id,
          level: 3, extras: slots.extras.map((e) => e.id),
        });
        assert.ok(!/[{}]|undefined/.test(p), `채워지지 않은 자리: ${p}`);
        assert.ok(p.includes('in sync with'), `맞물림 누락: ${p}`);
        if (tech.cap.startsWith('illustration')) assert.ok(!p.includes('3D'), `2D에 3D 표현: ${p}`);
        count++;
      }

for (let i = 0; i < 200; i++) buildPrompt(slots, { ...randomSelection(slots, { tech: 'three' }), level: 2 });
console.log(`ok: ${count} combinations`);
