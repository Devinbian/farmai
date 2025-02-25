// 确保在导入其他模块前注册
gsap.registerPlugin(ScrollTrigger);

// 动态导入模块
async function loadModules() {
  const baseUrl = window.siteConfig?.BASE_URL || "";

  const [
    { createRobot, initializeRobot },
    { initializeCardInteractions },
    {
      initializeScrollAnimations,
      initializeBannerAnimations,
      initializeHoverAnimations,
    },
  ] = await Promise.all([
    // import(`${baseUrl}/components/robot/robot.js`),
    import(`${baseUrl}/components/card/card-interactions.js`),
    import(`${baseUrl}/components/animation/scroll-animations.js`),
  ]);

  // 初始化所有功能
  function initializeAll() {
    // 添加机器人HTML
    const robotContainer = document.createElement("div");
    robotContainer.innerHTML = createRobot();
    document.body.appendChild(robotContainer.firstElementChild);

    // 初始化各个组件
    initializeRobot();
    initializeCardInteractions(".camp-section:not(.service-section)");
    initializeCardInteractions(".service-section");
    initializeCardInteractions(".children-section");
    initializeCardInteractions(".study-section");
    initializeCardInteractions(".summer-section");
    initializeCardInteractions(".competition-section");

    // initializeScrollAnimations();
    initializeBannerAnimations();
    initializeHoverAnimations();
  }

  initializeAll();
}

// 当DOM加载完成后加载模块并初始化
document.addEventListener("DOMContentLoaded", loadModules);
