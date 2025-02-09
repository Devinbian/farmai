// 确保在导入其他模块前注册
gsap.registerPlugin(ScrollTrigger);

import { createRobot, initializeRobot } from "/components/robot/robot.js";
import { initializeCardInteractions } from "/components/card/card-interactions.js";
import {
  initializeScrollAnimations,
  initializeBannerAnimations,
  initializeHoverAnimations,
} from "/components/animation/scroll-animations.js";

// 初始化所有功能
function initializeAll() {
  // 添加机器人HTML
  const robotContainer = document.createElement("div");
  robotContainer.innerHTML = createRobot();
  document.body.appendChild(robotContainer.firstElementChild);

  // 初始化各个组件
  initializeRobot();

  // 初始化所有卡片交互
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

// 当DOM加载完成后初始化
document.addEventListener("DOMContentLoaded", initializeAll);
