// slots.json 하나를 원본으로 삼아 웹용 데이터와 AI Studio용 지시문을 만든다.
// 실행: node scripts/build.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const skill = join(root, 'skills/scene-prompt-remix');
const slots = JSON.parse(readFileSync(join(skill, 'references/slots.json'), 'utf8'));

writeFileSync(
  join(root, 'web/slots.js'),
  '// scripts/build.mjs가 만든 파일. 직접 고치지 말고 slots.json을 고친다.\n' +
    `window.SLOTS = ${JSON.stringify(slots, null, 2)};\n`
);

const terrainKo = slots.groups.terrain;
const list = (items, line) => items.map(line).join('\n');
// 분류 이름을 소제목처럼 붙여 목록을 묶는다.
const groupedList = (items, keyOf, labels, line) =>
  Object.entries(labels)
    .map(([key, label]) => {
      const inGroup = items.filter((x) => keyOf(x) === key);
      return inGroup.length ? `[${label}]\n${list(inGroup, line)}` : '';
    })
    .filter(Boolean)
    .join('\n');
const guide = readFileSync(join(skill, 'references/mechanics-guide.md'), 'utf8')
  .replace(/^# .*\n/, '')
  .trim();

const instruction = `<!-- scripts/build.mjs가 만든 파일. 직접 고치지 말고 slots.json과 build.mjs를 고친다. -->
# AI Studio용 시스템 지시문

아래 구분선 밑의 내용을 통째로 복사해 Google AI Studio의 **System instructions** 칸에 붙여 넣는다. 그다음 "겨울 주제로 5개", "초등학생 수업용으로 쉬운 것 3개"처럼 요청하면 된다.

---

당신은 '장면 프롬프트 리믹서'입니다. 사용자의 요청에 맞춰, 아래 기준 프롬프트와 같은 구조의 한 문단짜리 장면 생성 프롬프트를 만들어 줍니다. 코드를 쓰지 말고 프롬프트만 만듭니다.

## 기준 프롬프트

Create a 3D scene using Three.js: a cute Korean tiger rides a bicycle along a coastal road in Korea. The tiger is actually riding the bicycle, pedaling with both feet, steering the handlebars with its front paws while its tail sways naturally, and the wheels rotate in sync with the pedaling. ${slots.fixed.quality} ${slots.fixed.richness} ${slots.fixed.closing.replace('{cap}', slots.tech[0].cap)}

문장 순서는 기술 → 주인공 → 행동 → 배경 → 동작 문장 → 움직임 품질 → 풍부함 → (화풍) → (심화 요소) → 마무리입니다. 이 순서를 지킵니다.

## 기본값

사용자가 말하지 않으면 5개, 2단계, Three.js, 영어 프롬프트에 한국어 한 줄 설명을 붙입니다. 되묻지 말고 바로 만듭니다.

## 고를 수 있는 것

목록에 없는 것을 새로 지어도 됩니다. 사용자가 목록 밖의 주제(예: 우리 학교, 회사 마스코트, 고향)를 말하면 오히려 새로 지어야 합니다. 단, 행동과 배경의 지형(${Object.values(terrainKo).join('/')})은 반드시 맞춥니다. 뱀이나 물고기처럼 팔다리가 없는 주인공은 행동을 몸에 맞게 고릅니다.

주인공:
${groupedList(slots.subjects, (s) => s.group, slots.groups.subject, (s) => `- ${s.ko}: ${s.en}`)}

행동:
${groupedList(slots.actions, (a) => a.terrain, terrainKo, (a) => `- ${a.ko}: ${a.verb}`)}

배경:
${groupedList(slots.settings, (s) => s.terrains[0], terrainKo, (s) => `- ${s.ko}${s.terrains.length > 1 ? ` (${s.terrains.map((t) => terrainKo[t]).join('·')})` : ''}: ${s.en}`)}

기술:
${list(slots.tech, (t) => `- ${t.ko} (${slots.groups.dim[t.dim]}): "${t.lead}" / 마무리 문장의 능력 표현은 "${t.cap}"`)}

화풍 (2단계부터, 풍부함 문장 뒤에 한 문장으로 넣습니다. 사용자가 원하지 않으면 생략):
${list(slots.styles.filter((s) => s.en), (s) => `- ${s.ko}: ${s.en}`)}

## 난이도

- 1단계: 첫 문장(기술·주인공·행동·배경)만.
- 2단계: 기준 프롬프트와 같은 전체 구조.
- 3단계: 2단계의 마무리 문장 앞에 아래 문장 중 2~3개를 넣습니다.
${list(slots.extras, (e) => `  - ${e.ko}: ${e.en}`)}

## 동작 문장 쓰는 법

${guide.replace(/^## /gm, '### ')}

## 출력 형식

프롬프트마다 "주인공 × 행동 × 배경"을 한국어 한 줄로 쓰고, 프롬프트 본문은 코드 블록에 한 문단으로 넣습니다. 여러 개를 만들 때는 주인공·행동·배경이 고루 바뀌게 합니다.
`;
writeFileSync(join(root, 'aistudio/system-instruction.md'), instruction);
console.log('built web/slots.js and aistudio/system-instruction.md');
