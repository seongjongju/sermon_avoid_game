import { useEffect, useRef, useState } from 'react';
import '../styled/styled.scss';
import gameBg from '../assets/img/game_bg.webp';
import playerCharacter from '../assets/img/character.gif';

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const PLAYER_WIDTH = 50;
const OBSTACLE_SIZE = 100;

//랜덤한 텍스트 배열
const TEXTS = [
    "결혼은 했니?",
    "대기업 가야지?",
    "나이가 몇인데?",
    "애인은 있고?",
    "살 좀 빼거라",
    "눈이 높은가봐?",
    "철 좀 들거라",
    "취직은 언제 하니?",
    "돈은 좀 모았니?",
    "사촌은 합격했다"
];

const Screen = () => {
    const [score, setScore] = useState(0); // 점수
    const [isGameOver, setIsGameOver] = useState(true); // 게임 오버 상태

    // 플레이어 상호작용 데이터
    const playerXRef = useRef(GAME_WIDTH / 2 - PLAYER_WIDTH / 2); // 플레이어 X 좌표
    const obstaclesRef = useRef([]); // [{ id, x, y, speed, element }, ...]
    const keysRef = useRef({}); // 눌린 키보드 키 저장용
    const scoreRef = useRef(0);
    const isGameOverRef = useRef(true);
    
    const gameLoopRef = useRef(null);

    // DOM 조작을 위한 Ref
    const gameBoardRef = useRef(null); 
    const playerRef = useRef(null);
    const requestRef = useRef(null);
    const getRandom = useRef(() => Math.random()).current;

    // 게임 시작 및 초기화
    const startGame = () => {
        // 기존에 화면에 남아있던 장애물 DOM 엘리먼트 제거
        obstaclesRef.current.forEach(obs => obs.element?.remove());
        
        // 데이터 초기화
        obstaclesRef.current = [];
        playerXRef.current = GAME_WIDTH / 2 - PLAYER_WIDTH / 2;
        scoreRef.current = 0;
        isGameOverRef.current = false;
        
        setScore(0);
        setIsGameOver(false);

        // 키보드 입력 초기화
        keysRef.current = {};

        if (gameLoopRef.current) {
            requestRef.current = requestAnimationFrame(gameLoopRef.current);
        }
    };

    // 게임 루프 로직 세팅
    useEffect(() => {
        const gameLoop = () => {
            if (isGameOverRef.current) return;

            // 1. 플레이어 이동 계산 (A, Left = 왼쪽 / D, Right = 오른쪽)
            if (keysRef.current['ArrowLeft'] || keysRef.current['a'] || keysRef.current['A']) {
                playerXRef.current = Math.max(0, playerXRef.current - 8);
            }
            if (keysRef.current['ArrowRight'] || keysRef.current['d'] || keysRef.current['D']) {
                playerXRef.current = Math.min(GAME_WIDTH - PLAYER_WIDTH, playerXRef.current + 8);
            }

            // 플레이어 DOM 위치 실시간 반영
            if (playerRef.current) {
                playerRef.current.style.transform = `translateX(${playerXRef.current}px)`;
            }

            // 2. 새로운 장애물 생성 (약 3% 확률)
            if (getRandom() < 0.03) {
                const speedBonus = scoreRef.current / 100;
                const cappedBonus = Math.min(5, speedBonus); //속도 최대 5

                const newObstacle = {
                    id: Date.now() + getRandom(),
                    x: getRandom() * (GAME_WIDTH - OBSTACLE_SIZE),
                    y: 0,
                    speed: 4 + getRandom() * 5 + cappedBonus, //점점 빠르게 
                    element: null
                };

                // 실시간으로 DOM 엘리먼트를 생성해서 GameBoard에 부착
                const obsElem = document.createElement('div');
                obsElem.className = 'game-obstacle';
                obsElem.style.transform = `translate(${newObstacle.x}px, ${newObstacle.y}px)`;

                //랜덤 텍스트
                const randomIndex = Math.floor(getRandom() * TEXTS.length);
                const randomText = TEXTS[randomIndex];

                obsElem.textContent = randomText;

                gameBoardRef.current?.appendChild(obsElem);
                
                newObstacle.element = obsElem;
                obstaclesRef.current.push(newObstacle);
            }

            // 3. 장애물 이동 및 충돌 검사
            const currentObstacles = [];
            const playerY = GAME_HEIGHT - PLAYER_WIDTH + 20;

            for (let obs of obstaclesRef.current) {
                obs.y += obs.speed;

                // 화면 아래로 벗어난 경우
                if (obs.y > GAME_HEIGHT - 20) {
                    obs.element?.remove(); // 화면에서 삭제
                    scoreRef.current += 10;
                    setScore(scoreRef.current); 
                } else {
                    // 화면 안에 있으면 위치 업데이트
                    if (obs.element) {
                        obs.element.style.transform = `translate(${obs.x}px, ${obs.y}px)`;
                    }

                    // 사각형 충돌 검사
                    const isColliding = 
                        playerXRef.current < obs.x + OBSTACLE_SIZE &&
                        playerXRef.current + PLAYER_WIDTH > obs.x &&
                        playerY < obs.y + OBSTACLE_SIZE &&
                        playerY + PLAYER_WIDTH > obs.y;

                    if (isColliding) {
                        isGameOverRef.current = true;
                        setIsGameOver(true);
                    }

                    currentObstacles.push(obs);
                }
            }
            obstaclesRef.current = currentObstacles;

            // 게임 오버가 아니면 다음 프레임 계속 실행
            if (!isGameOverRef.current) {
                requestRef.current = requestAnimationFrame(gameLoop);
            }
        };

        gameLoopRef.current = gameLoop;
    }, []);

    // 키보드 이벤트 리스너 등록
    useEffect(() => {
        const handleKeyDown = (e) => { keysRef.current[e.key] = true; };
        const handleKeyUp = (e) => { keysRef.current[e.key] = false; };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, []);

    return (
        <div id='screen' ref={gameBoardRef} style={{
            background: `url(${gameBg}) no-repeat center / cover` 
        }}>
            <div className='score'>Score: {score}</div>

            {/* 플레이어 캐릭터에 ref 연결 */}
            <div className="player" ref={playerRef}>
                <img src={playerCharacter} alt="플레이어 캐릭터" />
            </div>

            {isGameOver && (
                <div className="game-over">
                    <h1>{score > 0 ? '💥 패배하셨습니다 💥' : '잔소리 피하기 게임'}</h1>
                    {score > 0 && <p>최종 점수: {score}점</p>}
                    <button className="game-button" onClick={startGame}>
                        {score > 0 ? '다시 도전하기' : '게임 시작'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default Screen;