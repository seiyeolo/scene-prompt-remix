# Scene Prompt Remix

한 문단짜리 장면 생성 프롬프트를 슬롯으로 분해해 변형 프롬프트를 만들어 주는 도구 묶음입니다. 출발점은 이 프롬프트입니다.

> Create a 3D scene using Three.js: a cute Korean tiger rides a bicycle along a coastal road in Korea. The tiger is actually riding the bicycle, pedaling with both feet, steering the handlebars with its front paws while its tail sways naturally, and the wheels rotate in sync with the pedaling. …

같은 내용을 세 가지 방식으로 쓸 수 있습니다.

| 쓰는 곳 | 파일 | 방법 |
|---|---|---|
| Claude Code, Codex, Cursor 등 | `skills/scene-prompt-remix/` | 스킬로 설치한 뒤 "겨울 주제로 프롬프트 5개 만들어줘"처럼 요청 |
| Google AI Studio, Gemini | `aistudio/system-instruction.md` | 구분선 아래 내용을 System instructions 칸에 붙여 넣기 |
| 웹 브라우저 | `web/index.html` | 파일을 열어 주인공·행동·배경을 고르고 복사 |

## 스킬 설치

아래 명령으로 설치합니다.

```bash
npx skills add seiyeolo/scene-prompt-remix
```

또는 `skills/scene-prompt-remix` 폴더를 `~/.claude/skills/`에 복사합니다.

## 웹 생성기

`web/` 폴더는 빌드 없이 동작하는 정적 페이지입니다. `index.html`을 브라우저로 열거나 GitHub Pages 등에 그대로 올리면 됩니다.

## 고를 수 있는 것

| 슬롯 | 개수 | 예 |
|---|---|---|
| 주인공 | 30 | 호랑이, 수달, 십이지 동물, 해태, 구미호, 선비, 할머니, 로봇 |
| 행동 | 20 | 자전거, 외발자전거, 서핑, 얼음썰매, 패러글라이딩, 열기구, 연날리기, 제기차기, 널뛰기 |
| 배경 | 34 | 남이섬, 광안대교, 담양 대나무숲, 화천 얼음축제, 지리산 운해, 경복궁 앞마당 |
| 기술 | 11 | Three.js, Three.js 게임, React Three Fiber, A-Frame VR, WebGL 셰이더, PixiJS, Phaser 게임 |
| 화풍 | 9 | 로우폴리, 카툰, 클레이, 수채화, 민화풍, 픽셀아트, 종이 공예, 실사풍, 네온 |
| 심화 요소 | 10 | 낮/밤, 계절, 날씨, 파티클, 카메라, 속도, 소리, 미니게임, 사진 모드, 단일 HTML |

목록에 없는 주인공·행동·배경은 웹 생성기에서 **직접 입력**을 골라 쓸 수 있습니다. 스킬과 AI Studio 지시문은 목록 밖의 주제도 새로 지어 냅니다.

## 슬롯 고치기

주인공·행동·배경 목록의 원본은 `skills/scene-prompt-remix/references/slots.json` 하나입니다. 고친 뒤 아래 명령으로 웹용 데이터와 AI Studio용 지시문을 다시 만들고 검사합니다.

```bash
node scripts/build.mjs
```

```bash
node scripts/test.mjs
```

### 항목 추가하는 법

`slots.json`의 해당 목록에 한 줄을 더하면 웹, 스킬, AI Studio 지시문에 모두 반영됩니다.

- **주인공**: `group`(animal·zodiac·legend·people), 영어 묘사 `en`, 두 번째 문장에 쓸 짧은 이름 `short`, 소유격 `poss`(its·her·his·their), 앞쪽 부위 `front`, 뒤쪽 부위 `rear`, 따라 움직이는 부분 `secondary`를 채웁니다.
- **행동**: 지형 `terrain`(road·water·sea·snow·ice·sky·field)을 정하고, `mech` 문장을 `references/mechanics-guide.md`의 다섯 요소에 맞춰 씁니다. `{rear}`, `{front}`, `{poss}`, `{secondary}` 자리는 주인공 값으로 채워집니다.
- **배경**: 어울리는 지형을 `terrains` 목록에 적습니다. 한 배경이 여러 지형에 맞을 수 있습니다 (예: 제주 앞바다는 물과 바다).
- **기술·화풍·심화 요소**: 문장 하나씩만 쓰면 됩니다. 2D 기술은 `dim`을 `2d`로 하고 `cap`에 "3D"를 넣지 않습니다.

추가한 뒤 `node scripts/build.mjs`와 `node scripts/test.mjs`를 실행하면, 모든 조합에서 빈 자리나 지형 불일치가 없는지 검사합니다. 다른 사람이 추가한 항목도 Pull Request로 받을 수 있습니다.

## 구성

```
skills/scene-prompt-remix/
  SKILL.md                      스킬 본문: 슬롯 구조와 작업 순서
  references/slots.json         슬롯 목록 (원본)
  references/mechanics-guide.md 동작 문장 쓰는 법
aistudio/system-instruction.md  AI Studio용 지시문 (자동 생성)
web/                            프롬프트 생성기 페이지
scripts/                        빌드와 검사
```

## 라이선스

[MIT](LICENSE)
