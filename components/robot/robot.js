export function createRobot() {
  return `
        <div class="robot-container">
            <div class="robot-wrapper">
                <div class="robot-tools">
                    <button class="robot-tool-btn" title="联系客服">
                        <span class="material-icons">chat</span>
                    </button>
                    <button class="robot-tool-btn" title="查看文档">
                        <span class="material-icons">description</span>
                    </button>
                    <button class="robot-tool-btn" title="返回顶部">
                        <span class="material-icons">arrow_upward</span>
                    </button>
                </div>
            </div>
        </div>
    `;
}

export function initializeRobot() {
  const robotContainer = document.querySelector(".robot-container");
  const robotWrapper = document.querySelector(".robot-wrapper");
  const robotTools = document.querySelectorAll(".robot-tool-btn");
  const robotStates = {
    normal: "images/robot/normal.png",
    thinking: "images/robot/thinking.png",
    surprised: "images/robot/surprised.png",
    happy: "images/robot/happy.png",
  };

  let currentState = "normal";
  let isDragging = false;
  let isInteracting = false;
  let initialMouseX, initialMouseY;
  let initialRobotX, initialRobotY;

  // 设置初始状态
  robotWrapper.style.backgroundImage = `url('${robotStates.normal}')`;

  // 预加载图片
  Object.values(robotStates).forEach((src) => {
    const img = new Image();
    img.src = src;
  });

  // 随机获取一个状态（除了当前状态）
  function getRandomState() {
    const states = Object.keys(robotStates).filter(
      (state) => state !== currentState,
    );
    return states[Math.floor(Math.random() * states.length)];
  }

  // 更新机器人状态
  function updateRobotState(newState, isTemporary = false) {
    if (currentState === newState || isInteracting) return;

    robotWrapper.style.backgroundImage = `url('${robotStates[newState]}')`;
    currentState = newState;

    if (isTemporary) {
      setTimeout(() => {
        if (!isInteracting) {
          updateRobotState("normal");
        }
      }, 2000);
    }
  }

  // 处理点击事件
  function handleClick(e) {
    if (e.target.closest(".robot-tool-btn")) return;
    if (!isDragging) {
      updateRobotState(getRandomState(), true);
    }
  }

  // 处理拖拽开始
  function handleDragStart(e) {
    if (e.target.closest(".robot-tool-btn")) return;

    initialMouseX = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
    initialMouseY = e.type === "touchstart" ? e.touches[0].clientY : e.clientY;

    const rect = robotContainer.getBoundingClientRect();
    initialRobotX = rect.left;
    initialRobotY = rect.top;
  }

  // 处理拖拽过程
  function handleDrag(e) {
    if (!initialMouseX || !initialMouseY) return;

    const currentX = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
    const currentY = e.type === "touchmove" ? e.touches[0].clientY : e.clientY;

    const moveDistance = Math.sqrt(
      Math.pow(currentX - initialMouseX, 2) +
        Math.pow(currentY - initialMouseY, 2),
    );

    if (!isDragging && moveDistance > 5) {
      isDragging = true;
      isInteracting = true;
      updateRobotState("surprised");
    }

    if (isDragging) {
      e.preventDefault();

      const deltaX = currentX - initialMouseX;
      const deltaY = currentY - initialMouseY;
      let newX = initialRobotX + deltaX;
      let newY = initialRobotY + deltaY;

      const maxX = window.innerWidth - robotContainer.offsetWidth;
      const maxY = window.innerHeight - robotContainer.offsetHeight;

      newX = Math.min(Math.max(0, newX), maxX);
      newY = Math.min(Math.max(0, newY), maxY);

      robotContainer.style.left = newX + "px";
      robotContainer.style.right = "auto";
      robotContainer.style.top = newY + "px";
      robotContainer.style.bottom = "auto";
      robotContainer.style.transform = "none";
    }
  }

  // 处理拖拽结束
  function handleDragEnd() {
    if (isDragging) {
      isDragging = false;
      isInteracting = false;
      updateRobotState("happy", true);
    }
    initialMouseX = null;
    initialMouseY = null;
  }

  // 添加事件监听
  robotContainer.addEventListener("click", handleClick);
  robotContainer.addEventListener("mousedown", handleDragStart);
  robotContainer.addEventListener("touchstart", handleDragStart);
  document.addEventListener("mousemove", handleDrag);
  document.addEventListener("touchmove", handleDrag, { passive: false });
  document.addEventListener("mouseup", handleDragEnd);
  document.addEventListener("touchend", handleDragEnd);

  // 处理悬停效果
  let hoverTimer;
  robotContainer.addEventListener("mouseenter", () => {
    if (!isDragging && !isInteracting) {
      hoverTimer = setInterval(() => {
        if (!isInteracting) {
          updateRobotState(getRandomState());
        }
      }, 4000);
    }
  });

  robotContainer.addEventListener("mouseleave", (e) => {
    if (e.relatedTarget && e.relatedTarget.closest(".robot-tools")) {
      return;
    }
    clearInterval(hoverTimer);
    if (!isDragging && !isInteracting) {
      updateRobotState("normal");
    }
  });

  // 工具按钮点击事件
  robotTools.forEach((btn) => {
    btn.addEventListener("mouseenter", (e) => {
      e.stopPropagation();
      isInteracting = true;
    });

    btn.addEventListener("mouseleave", (e) => {
      e.stopPropagation();
      if (!isDragging) {
        isInteracting = false;
      }
    });

    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      isInteracting = true;
      const action = this.title;

      switch (action) {
        case "联系客服":
          updateRobotState("thinking");
          window.open("https://chat.deepseek.com/", "_blank");
          setTimeout(() => {
            isInteracting = false;
            updateRobotState("happy", true);
          }, 1000);
          break;
        case "查看文档":
          updateRobotState("thinking");
          window.open("https://docs.vegesense.com/", "_blank");
          setTimeout(() => {
            isInteracting = false;
            updateRobotState("happy", true);
          }, 1000);
          break;
        case "返回顶部":
          updateRobotState("happy");
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
          setTimeout(() => {
            isInteracting = false;
          }, 1000);
          break;
        default:
          setTimeout(() => {
            isInteracting = false;
          }, 1500);
          break;
      }
    });
  });
}
