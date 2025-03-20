// AI模块主入口文件 - 整合所有AI相关功能

import {
  initNavigation,
  initSidebarToggle,
  initBatchOperations,
  handleFavorite,
  handleDownload,
} from "./ai-common.js";
import { initChat } from "./ai-chat.js";
import { initImageGeneration, ImageGenerationController } from "./ai-image.js";
import { initVideoGeneration, initVideoHistory } from "./ai-video.js";

// 初始化所有AI功能
export function initAI() {
  // 绑定DOMContentLoaded事件
  document.addEventListener("DOMContentLoaded", () => {
    // 初始化导航
    initNavigation();

    // 初始化聊天功能
    initChat();

    // 初始化图像生成功能
    initImageGeneration();

    // 初始化视频生成功能
    initVideoGeneration();

    // 初始化批量操作功能
    initBatchOperations();

    // 初始化侧边栏切换功能
    initSidebarToggle();

    // 初始化视频历史功能
    initVideoHistory();

    // 初始化图像生成控制器
    const controller = new ImageGenerationController();
  });
}

// 导出所有功能模块，方便单独使用
export {
  initNavigation,
  initSidebarToggle,
  initBatchOperations,
  handleFavorite,
  handleDownload,
  initChat,
  initImageGeneration,
  ImageGenerationController,
  initVideoGeneration,
  initVideoHistory,
};
