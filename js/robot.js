// 初始化机器人功能
function initRobot() {
  const robotContainer = document.querySelector(".robot-container");
  const hideButton = document.querySelector(".hide-button");

  if (!robotContainer || !hideButton) return;

  // 添加点击事件
  hideButton.addEventListener("click", (e) => {
    e.stopPropagation();
    robotContainer.classList.toggle("hidden");
  });

  // 当机器人被隐藏时，点击机器人显示
  robotContainer.addEventListener("click", () => {
    if (robotContainer.classList.contains("hidden")) {
      robotContainer.classList.remove("hidden");
    }
  });
}

// 当 DOM 加载完成后初始化
document.addEventListener("DOMContentLoaded", initRobot);
