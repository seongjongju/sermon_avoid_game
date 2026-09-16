# 잔소리 피하기 게임

하늘에서 떨어지는 잔소리 장애물을 피하며 점수를 획득하는 캐주얼 웹 게임입니다.
React와 Vite를 기반으로 제작했으며, 개발 과정에서 ChatGPT와 Gemini를 활용해 코드 작성과 그래픽 리소스 제작을 진행했습니다.

* 개발 형태: 요구사항 정의, 결과물 검수, 방향 결정 / 코드 작성 및 디버깅은 AI 협업으로 진행
* 서비스: https://sermon-avoid-game.vercel.app/
* itch.io: https://seongjongju.itch.io/sermon-avoid-game
* GitHub: https://github.com/seongjongju/sermon_avoid_game

> PC 환경을 기준으로 제작되었으며 모바일 및 반응형 환경은 지원하지 않습니다.

## 주요 기능

### 게임 플레이

* 잔소리 문구가 적힌 장애물 랜덤 낙하
* 장애물 통과 시 점수 증가
* 플레이어와 장애물 충돌 시 게임 종료
* 시작 및 게임 오버 화면
* 제한 시간 없이 점수 기반으로 진행

### 오디오

* BGM 재생
* 음소거 기능
* 볼륨 조절

## 기술 스택

### 개발

* React
* Vite
* SCSS

### AI 협업

* ChatGPT
* Gemini

## AI 활용 방식

* ChatGPT를 활용해 요구사항을 프롬프트로 정리하고 검토
* Gemini를 활용해 코드 작성 및 디버깅 진행
* 결과물 검수 후 수정사항을 프롬프트로 정리하여 재작업
* 그래픽 리소스 제작에도 ChatGPT와 Gemini 활용

## 개발 환경 설정 및 실행 방법

### 1. 프로젝트 클론 및 패키지 설치

```bash
git clone https://github.com/seongjongju/sermon_avoid_game.git
cd sermon_avoid_game
npm install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

## 크레딧

* BGM: "Children's Happy" by Kevin MacLeod (incompetech.com), CC BY 4.0 라이선스
