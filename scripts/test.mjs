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
assert.equal(buildPrompt(slots, { ...base, style: 'none', level: 2 }), ORIGINAL, '화풍 지정 안 함은 원문과 같아야 한다');

// 지형마다 고를 배경이 하나 이상 있어야 한다.
for (const a of slots.actions)
  assert.ok(slots.settings.some((s) => s.terrains.includes(a.terrain)), `배경 없는 지형: ${a.terrain}`);
for (const key of ['tech', 'subjects', 'actions', 'settings', 'styles', 'extras']) {
  const ids = slots[key].map((x) => x.id);
  assert.equal(new Set(ids).size, ids.length, `${key}에 중복 id`);
}

// 직접 입력: 지형 검사 없이 어떤 조합이든 문장이 완성되어야 한다.
const custom = buildPrompt(slots, {
  tech: 'three', level: 2,
  subject: { custom: 'a sleepy koala ' },
  action: { custom: 'drives a tiny tractor.' },
  setting: { custom: 'through a busy night market in Seoul' },
});
assert.ok(custom.startsWith('Create a 3D scene using Three.js: a sleepy koala drives a tiny tractor through a busy night market in Seoul. The character is actually doing it'), custom);
assert.ok(!/[{}]|undefined|\.\./.test(custom), custom);
assert.ok(buildPrompt(slots, { ...base, action: 'kayak', setting: { custom: 'on a lake' }, level: 2 }).includes('kayak'));

let count = 0;
for (const tech of slots.tech)
  for (const subject of slots.subjects)
    for (const action of slots.actions)
      for (const setting of slots.settings.filter((s) => s.terrains.includes(action.terrain))) {
        const p = buildPrompt(slots, {
          tech: tech.id, subject: subject.id, action: action.id, setting: setting.id,
          style: slots.styles[count % slots.styles.length].id,
          level: 3, extras: slots.extras.map((e) => e.id),
        });
        assert.ok(!/[{}]|undefined/.test(p), `채워지지 않은 자리: ${p}`);
        assert.ok(p.includes('in sync with'), `맞물림 누락: ${p}`);
        if (tech.dim === '2d') assert.ok(!p.includes('3D'), `2D에 3D 표현: ${p}`);
        assert.ok(!/\s[,.]|,,|\.\./.test(p), `문장부호 오류: ${p}`);
        count++;
      }

for (let i = 0; i < 200; i++) buildPrompt(slots, { ...randomSelection(slots, { tech: 'three' }), level: 2 });
console.log(`ok: ${count} combinations`);
