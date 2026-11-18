---
name: scene-prompt-remix
description: "한 문단짜리 '장면 생성 프롬프트'(예: 호랑이가 해안도로에서 자전거를 타는 Three.js 3D 장면)를 슬롯으로 분해해 주인공·행동·배경·기술·난이도를 바꾼 변형 프롬프트를 만든다. 사용자가 3D 장면/애니메이션/인터랙티브 웹 작품용 프롬프트를 만들어 달라거나, 기존 프롬프트를 응용·변형·리믹스해 달라거나, AI Studio·Gemini·Claude 등에 넣을 창작 코딩 프롬프트 세트, 수업용 프롬프트 예제, 모델 비교용 프롬프트를 요청할 때 사용한다. Use for generating or remixing one-paragraph creative-coding scene prompts (Three.js, p5.js, SVG)."
---

# Scene Prompt Remix

한 문단짜리 장면 프롬프트를 여러 갈래로 변형해 주는 스킬이다. 결과물은 **코드가 아니라 프롬프트**이며, 사용자는 그것을 AI Studio, Gemini, Claude 같은 도구에 붙여 넣어 장면을 만든다.

## 기준 프롬프트

모든 변형은 아래 원문의 구조를 따른다.

> Create a 3D scene using Three.js: a cute Korean tiger rides a bicycle along a coastal road in Korea. The tiger is actually riding the bicycle, pedaling with both feet, steering the handlebars with its front paws while its tail sways naturally, and the wheels rotate in sync with the pedaling. The motion is natural and smooth. The scene is lively and richly detailed, with a natural environment, dynamic effects, lighting and shadows, and interactive features. Make full use of your 3D modeling, animation, and visual design capabilities to create a polished, ready-to-run web piece.

이 프롬프트가 잘 작동하는 이유는 문장마다 역할이 다르기 때문이다.

| 순서 | 슬롯 | 원문 | 역할 |
|---|---|---|---|
| 1 | 기술 | Create a 3D scene using Three.js | 매체를 정한다 |
| 2 | 주인공 | a cute Korean tiger | 무엇을 그릴지 |
| 3 | 행동 | rides a bicycle | 무엇을 하는지 |
| 4 | 배경 | along a coastal road in Korea | 어디서 |
| 5 | 동작 문장 | The tiger is actually riding … in sync with the pedaling. | 몸과 기구가 맞물리는 방식을 못박는다 |
| 6 | 움직임 품질 | The motion is natural and smooth. | 고정 |
| 7 | 풍부함 | The scene is lively and richly detailed … | 환경·효과·조명·상호작용 |
| 8 | 마무리 | Make full use of … ready-to-run web piece. | 완성도와 실행 가능성 |

5번 동작 문장이 핵심이다. 이 문장이 없으면 모델은 주인공을 기구 위에 얹어 놓기만 하고 다리와 바퀴가 따로 논다.

## 작업 순서

### 1. 요청 파악

사용자가 밝히지 않은 값은 묻지 말고 다음 기본값을 쓴다.

- 개수: 5개
- 난이도: 2단계 (원문 수준)
- 기술: Three.js
- 언어: 프롬프트는 영어, 각 프롬프트 위에 한국어 한 줄 설명

사용자가 주제(예: "겨울", "제주", "십이지")나 대상(예: "초등학생 수업용")을 말했다면 그에 맞춰 고른다.

### 2. 조합 고르기

`references/slots.json`을 읽고 주인공·행동·배경을 고른다. 목록에 없는 것을 새로 지어도 된다. 사용자의 주제가 목록 밖이면 오히려 그래야 한다.

지켜야 할 것은 하나다. **행동과 배경의 지형이 맞아야 한다.** 자전거는 길, 카약은 물, 썰매는 눈 위다. `slots.json`의 `terrain` 값이 같은 것끼리 짝지으면 된다.

여러 개를 만들 때는 주인공·행동·배경이 고루 바뀌게 한다. 다섯 개가 전부 자전거면 변형으로서 가치가 없다.

### 3. 동작 문장 쓰기

`slots.json`에 있는 행동은 `mech` 틀에 주인공의 `front`, `rear`, `poss`, `secondary`를 채우면 된다. 새 행동이나 틀이 어색한 주인공이라면 `references/mechanics-guide.md`의 다섯 요소에 따라 직접 쓴다. 주인공의 몸에 없는 부위(예: 사람에게 꼬리)를 쓰지 않도록 한다.

### 4. 난이도에 맞춰 조립

- **1단계 (한 줄)**: 1~4번 슬롯만. `Create a 3D scene using Three.js: a cute Korean tiger rides a bicycle along a coastal road in Korea.`
- **2단계 (표준)**: 1~8번 전부. 원문과 같은 길이.
- **3단계 (심화)**: 2단계의 7번과 8번 사이에 `extras` 문장을 2~3개 넣는다 (낮/밤 전환, 날씨, 카메라 전환, 속도 조절, 단일 HTML).

기술을 바꾸면 1번 첫머리와 8번의 능력 표현도 함께 바꾼다(`slots.json`의 `lead`, `cap`). 2D 매체에 "3D modeling"이 남으면 안 된다.

### 5. 점검

내보내기 전에 각 프롬프트를 확인한다.

- 행동과 배경의 지형이 맞는가
- 동작 문장의 신체 부위가 그 주인공에게 실제로 있는가
- 동작 문장에 "맞물림"(in sync with …)이 하나 들어 있는가
- 한 문단인가 (목록이나 제목으로 쪼개지지 않았는가)

### 6. 출력 형식

프롬프트마다 한국어 한 줄 설명을 쓰고, 프롬프트 본문은 복사하기 쉽게 코드 블록에 넣는다.

````
**1. 까치 × 스케이트보드 × 한옥마을**
```
Create a 3D scene using Three.js: a cheerful Korean magpie rides a skateboard through …
```
````

## 응용 모드

사용자가 다음을 요청하면 같은 구조를 다르게 쓴다.

- **난이도 계단**: 같은 장면을 1·2·3단계로 나란히 내어 준다. 프롬프트가 구체적일수록 결과가 어떻게 달라지는지 보여 주는 수업 자료가 된다.
- **모델 비교 세트**: 프롬프트 하나를 고정하고, 여러 모델에 똑같이 넣어 비교하도록 안내한다. 이때는 프롬프트를 모델별로 바꾸지 않는다.
- **이야기에서 장면으로**: 전래동화나 글 한 문단을 받으면 주인공·행동·배경을 뽑아 2단계 프롬프트로 만든다. 행동이 탈것이 아니어도(절구 찧기, 연날리기) 동작 문장의 다섯 요소는 그대로 적용한다.
- **다국어**: 요청한 언어로 옮기되 문장 순서와 역할은 유지한다.
- **자기 프롬프트 리믹스**: 사용자가 다른 프롬프트를 가져오면 먼저 위 표처럼 슬롯으로 분해해 보여 주고, 그다음 변형을 만든다.
