  (() => {
    const game = document.querySelector("#vibeRunner");
    const player = document.querySelector("#runnerPlayer");
    const obstacle = document.querySelector("#runnerObstacle");
    const scoreEl = document.querySelector("#runnerScore");
    const message = document.querySelector("#runnerMessage");

    if (!game || !player || !obstacle || !scoreEl || !message) return;

    let score = 0;
    let scoreTimer = null;
    let collisionTimer = null;
    let isGameOver = false;
    let isStarted = false;

    function startGame() {
      if (isStarted) return;

      isStarted = true;
      isGameOver = false;
      game.classList.add("is-playing");
      game.classList.remove("is-game-over");
      message.textContent = "CLICK / SPACE";

      scoreTimer = setInterval(() => {
        score += 1;
        scoreEl.textContent = score;
      }, 100);

      collisionTimer = setInterval(checkCollision, 16);
    }

    function jump() {
      if (isGameOver) {
        restartGame();
        return;
      }

      startGame();

      if (player.classList.contains("is-jumping")) return;

      player.classList.add("is-jumping");

      setTimeout(() => {
        player.classList.remove("is-jumping");
      }, 550);
    }

    function checkCollision() {
      const playerRect = player.getBoundingClientRect();
      const obstacleRect = obstacle.getBoundingClientRect();

      const hit =
        obstacleRect.left < playerRect.right - 6 &&
        obstacleRect.right > playerRect.left + 6 &&
        obstacleRect.bottom > playerRect.top + 8 &&
        obstacleRect.top < playerRect.bottom - 4;

      if (hit) {
        gameOver();
      }
    }

    function gameOver() {
      isGameOver = true;
      isStarted = false;

      game.classList.remove("is-playing");
      game.classList.add("is-game-over");
      message.textContent = "GAME OVER — CLICK TO RESTART";

      clearInterval(scoreTimer);
      clearInterval(collisionTimer);

      scoreTimer = null;
      collisionTimer = null;
    }

    function restartGame() {
      clearInterval(scoreTimer);
      clearInterval(collisionTimer);

      score = 0;
      scoreEl.textContent = "0";
      isGameOver = false;
      isStarted = false;

      game.classList.remove("is-game-over");
      game.classList.remove("is-playing");
      player.classList.remove("is-jumping");

      obstacle.style.animation = "none";
      void obstacle.offsetHeight;
      obstacle.style.animation = "";

      startGame();
    }

    game.addEventListener("click", jump);

    document.addEventListener("keydown", (event) => {
      if (event.code !== "Space") return;

      const isGameFocused =
        document.activeElement === game ||
        game.matches(":hover");

      if (!isGameFocused) return;

      event.preventDefault();
      jump();
    });

    game.addEventListener("mouseenter", () => {
      game.focus();
    });
  })();