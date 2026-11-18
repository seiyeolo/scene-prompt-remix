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

## 슬롯 고치기

주인공·행동·배경 목록의 원본은 `skills/scene-prompt-remix/references/slots.json` 하나입니다. 고친 뒤 아래 명령으로 웹용 데이터와 AI Studio용 지시문을 다시 만들고 검사합니다.

```bash
node scripts/build.mjs
```

```bash
node scripts/test.mjs
```

새 행동을 넣을 때는 `terrain`(road·water·snow)을 정하고, `mech` 문장을 `references/mechanics-guide.md`의 다섯 요소에 맞춰 씁니다.

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
