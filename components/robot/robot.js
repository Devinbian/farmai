export function createRobot() {
  return `
    <div class="robot-container">
        <div class="robot-wrapper">
            <button class="robot-tool-btn hide-button" title="隐藏">
                <span class="material-icons">chevron_right</span>
            </button>
            <div class="robot-tools">
                <button class="robot-tool-btn" title="联系客服">
                    <span class="material-icons">chat</span>
                </button>
                <button class="robot-tool-btn" title="Ai工具箱">
                    <span class="material-icons">smart_toy</span>
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
  const hideButton = document.querySelector(".hide-button");
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
  let isAnimating = false;

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

    robotWrapper.setAttribute("data-state", newState);
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
    if (e.target.closest(".robot-tool-btn") || isAnimating) return;

    initialMouseX = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
    initialMouseY = e.type === "touchstart" ? e.touches[0].clientY : e.clientY;

    const rect = robotContainer.getBoundingClientRect();
    initialRobotX = rect.left;
    initialRobotY = rect.top;
  }

  // 处理拖拽过程
  function handleDrag(e) {
    if (!initialMouseX || !initialMouseY || isAnimating) return;

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

      robotContainer.style.transition = "none";
      robotContainer.classList.remove("hidden");
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

      robotContainer.style.position = "fixed";
      robotContainer.style.left = `${newX}px`;
      robotContainer.style.right = "auto";
      robotContainer.style.top = `${newY}px`;
      robotContainer.style.bottom = "auto";
      robotContainer.style.transform = "none";
    }
  }

  // 添加一个辅助函数来获取当前设备类型的位置配置
  function getDeviceConfig() {
    if (window.innerWidth <= 480) {
      return {
        right: "16px",
        bottom: "16px",
        transform: "translateX(calc(100% + 16px))",
      };
    } else if (window.innerWidth <= 768) {
      return {
        right: "20px",
        bottom: "20px",
        transform: "translateX(calc(100% + 20px))",
      };
    } else {
      return {
        right: "40px",
        bottom: "40px",
        transform: "translateX(calc(100% + 40px))",
      };
    }
  }

  // 修改 toggleRobot 函数
  function toggleRobot() {
    if (isDragging || isAnimating) return;

    isAnimating = true;
    const isHidden = robotContainer.classList.contains("hidden");
    const config = getDeviceConfig();

    if (isHidden) {
      // 显示动画
      robotContainer.style.transition = "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)";
      robotContainer.style.position = "fixed";
      robotContainer.style.left = "";
      robotContainer.style.top = "";
      robotContainer.style.right = config.right;
      robotContainer.style.bottom = config.bottom;
      robotContainer.style.transform = config.transform;

      requestAnimationFrame(() => {
        robotContainer.classList.remove("hidden");
        requestAnimationFrame(() => {
          robotContainer.style.transform = "none";
          updateRobotState("happy", true);
          setTimeout(() => {
            isAnimating = false;
          }, 500);
        });
      });
    } else {
      // 隐藏动画
      robotContainer.style.transition = "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)";
      robotContainer.style.transform = config.transform;

      setTimeout(() => {
        robotContainer.classList.add("hidden");
        robotContainer.style.position = "fixed";
        robotContainer.style.left = "";
        robotContainer.style.top = "";
        robotContainer.style.right = config.right;
        robotContainer.style.bottom = config.bottom;
        updateRobotState("surprised", true);
        isAnimating = false;
      }, 500);
    }
  }

  // 修改 handleDragEnd 函数
  function handleDragEnd() {
    if (isDragging) {
      isDragging = false;
      isInteracting = false;
      robotContainer.style.transition = "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)";
      updateRobotState("happy", true);
    }
    initialMouseX = null;
    initialMouseY = null;
  }

  // 单独处理隐藏按钮的点击事件
  hideButton.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleRobot();
  });

  // 工具按钮点击事件
  robotTools.forEach((btn) => {
    if (!btn.classList.contains("hide-button")) {
      // 跳过隐藏按钮
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
          case "Ai工具箱":
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
        }
      });
    }
  });

  // 处理机器人的点击和拖拽
  robotContainer.addEventListener("click", handleClick);
  robotContainer.addEventListener("mousedown", handleDragStart);
  robotContainer.addEventListener("touchstart", handleDragStart);
  document.addEventListener("mousemove", handleDrag);
  document.addEventListener("touchmove", handleDrag, { passive: false });
  document.addEventListener("mouseup", handleDragEnd);
  document.addEventListener("touchend", handleDragEnd);

  // 添加窗口大小变化监听
  window.addEventListener("resize", () => {
    if (!isDragging && !robotContainer.classList.contains("hidden")) {
      const config = getDeviceConfig();
      robotContainer.style.right = config.right;
      robotContainer.style.bottom = config.bottom;
    }
  });
}
