// AI绘画模块 - 包含图像生成功能

import { handleFavorite, handleDownload } from "./ai-common.js";

export function initImageGeneration() {
  const imagePrompt = document.getElementById("imagePrompt");
  const generateButton = document.getElementById("generateImage");
  const suggestionTags = document.querySelectorAll(".tag");

  suggestionTags.forEach((tag) => {
    tag.addEventListener("click", () => {
      const tagText = tag.textContent;
      const currentPrompt = imagePrompt.value.trim();
      imagePrompt.value = currentPrompt
        ? `${currentPrompt}, ${tagText}`
        : tagText;
      imagePrompt.focus();
    });
  });

  generateButton.addEventListener("click", async () => {
    const prompt = imagePrompt.value.trim();

    if (!prompt) {
      alert("请输入创作描述");
      return;
    }

    generateButton.disabled = true;
    generateButton.innerHTML = '<i class="ri-loader-4-line"></i>创作中...';

    try {
      const imageUrl = await mockImageGeneration(prompt, "");

      const imageCard = document.createElement("div");
      imageCard.className = "image-card";
    } catch (error) {
      alert("创作失败，请稍后重试");
    } finally {
      generateButton.disabled = false;
      generateButton.innerHTML = '<i class="ri-magic-line"></i>开始创作';
    }
  });

  async function mockImageGeneration(prompt, style) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return "https://imgapi.cn/api.php?zd=mobile&fl=meizi&gs=images";
  }

  // 注册全局函数，以便HTML调用
  window.handleFavorite = handleFavorite;
  window.handleDownload = handleDownload;

  // 初始化视图切换功能
  initViewToggle();
}

// 初始化图像历史视图切换
function initViewToggle() {
  document.addEventListener("DOMContentLoaded", function () {
    const viewButtons = document.querySelectorAll(".image-history .view-btn");
    const treeView = document.getElementById("treeViewList");
    const gridView = document.getElementById("gridViewList");

    viewButtons.forEach((button) => {
      button.addEventListener("click", function () {
        // 移除所有按钮的active类
        viewButtons.forEach((btn) => btn.classList.remove("active"));
        // 给当前点击的按钮添加active类
        this.classList.add("active");

        // 根据按钮的data-view属性切换视图
        const viewType = this.getAttribute("data-view");
        if (viewType === "tree") {
          treeView.style.display = "flex";
          gridView.style.display = "none";
        } else {
          treeView.style.display = "none";
          gridView.style.display = "flex";
        }
      });
    });
  });
}

// 图像生成控制器类
export class ImageGenerationController {
  constructor() {
    this.initElements();
    if (this.elementsExist()) {
      this.bindEvents();
    } else {
      console.warn("Some required elements are missing");
    }

    // 初始状态
    this.isGenerating = false;
    this.currentRatio = "1:1";
    this.currentCount = 1;

    // 初始化历史区域为空状态
    const treeViewList = document.getElementById("treeViewList");
    const gridViewList = document.getElementById("gridViewList");

    if (treeViewList) {
      treeViewList.innerHTML = `
        <div class="history-empty-state">
          <div class="empty-icon">
            <i class="ri-image-2-line"></i>
          </div>
          <p class="empty-text">暂无生成记录</p>
        </div>
      `;
    }

    if (gridViewList) {
      gridViewList.innerHTML = `
        <div class="history-empty-state">
          <div class="empty-icon">
            <i class="ri-image-2-line"></i>
          </div>
          <p class="empty-text">暂无生成记录</p>
        </div>
      `;
    }
  }

  initElements() {
    this.prompt = document.querySelector(".prompt-input textarea");
    this.generateBtn = document.querySelector(".primary-btn");
    this.previewArea = document.querySelector(".preview-area");
    this.emptyPreview = document.querySelector(".empty-preview");
    this.previewGrid = document.querySelector(".preview-grid");
    this.generateCount = document.querySelector(".number-input input");
    this.uploadArea = document.querySelector(".upload-area");
    this.imageHistory = document.querySelector(".image-history");
    this.historyToggleBtn = document.querySelector(".toggle-btn");

    if (this.imageHistory) {
      const isCollapsed =
        localStorage.getItem("imageHistoryCollapsed") === "true";
      if (isCollapsed) {
        this.imageHistory.classList.add("collapsed");
        const icon = this.historyToggleBtn?.querySelector("i");
        if (icon) {
          icon.classList.replace(
            "ri-arrow-left-s-line",
            "ri-arrow-right-s-line",
          );
        }
      }
    }
  }

  elementsExist() {
    const elements = {
      prompt: this.prompt,
      generateBtn: this.generateBtn,
      previewArea: this.previewArea,
      previewGrid: this.previewGrid,
      generateCount: this.generateCount,
      imageHistory: this.imageHistory,
      historyToggleBtn: this.historyToggleBtn,
    };

    Object.entries(elements).forEach(([name, element]) => {
      if (!element) {
        console.warn(`Missing element: ${name}`);
      }
    });

    return Object.values(elements).every((element) => element !== null);
  }

  bindEvents() {
    this.generateBtn.addEventListener("click", () => this.handleGenerate());

    const minusBtn = document.querySelector(".number-btn.minus");
    const plusBtn = document.querySelector(".number-btn.plus");
    if (minusBtn && plusBtn) {
      minusBtn.addEventListener("click", () => this.updateCount(-1));
      plusBtn.addEventListener("click", () => this.updateCount(1));
    }
    if (this.generateCount) {
      this.generateCount.addEventListener("change", () => this.validateCount());
    }

    const ratioButtons = document.querySelectorAll(".ratio-btn");
    ratioButtons.forEach((btn) => {
      btn.addEventListener("click", () => this.handleRatioChange(btn));
    });

    if (this.historyToggleBtn) {
      this.historyToggleBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.toggleHistory();
      });
    }

    if (this.uploadArea) {
      this.uploadArea.addEventListener("click", () => this.handleUpload());
      this.uploadArea.addEventListener("dragover", (e) => e.preventDefault());
      this.uploadArea.addEventListener("drop", (e) => this.handleDrop(e));
    }
  }

  handleGenerate() {
    if (this.isGenerating) return;

    const prompt = this.prompt.value.trim();
    if (!prompt) {
      alert("请输入创意描述");
      return;
    }

    this.isGenerating = true;
    this.generateBtn.disabled = true;

    this.emptyPreview.style.display = "none";
    this.previewGrid.style.display = "grid";
    this.previewGrid.setAttribute("data-count", this.currentCount);

    this.previewGrid.innerHTML = "";

    for (let i = 0; i < this.currentCount; i++) {
      this.previewGrid.appendChild(this.createGeneratingItem());
    }

    setTimeout(() => {
      this.handleGenerateComplete();
    }, 3000);
  }

  createGeneratingItem() {
    const div = document.createElement("div");
    div.className = "preview-item generating";
    div.innerHTML = `
            <div class="loading-spinner"></div>
            <span class="generating-text">图像生成中...</span>
        `;
    return div;
  }

  createImageItem(imageUrl) {
    const div = document.createElement("div");
    div.className = "preview-item";
    div.innerHTML = `
            <img src="${imageUrl}" alt="生成的图片">
            <div class="image-actions">
                <button class="image-action-btn" title="收藏" onclick="handleFavorite(this)">
                    <i class="ri-heart-line"></i>
                </button>
                <button class="image-action-btn" title="下载" onclick="handleDownload('${imageUrl}')">
                    <i class="ri-download-line"></i>
                </button>
            </div>
        `;
    return div;
  }

  handleGenerateComplete() {
    this.isGenerating = false;
    this.generateBtn.disabled = false;

    this.previewGrid.innerHTML = "";

    const demoImages = [
      "https://imgapi.cn/api.php?zd=mobile&fl=meizi&gs=images",
      "https://imgapi.cn/api.php?zd=mobile&fl=meizi&gs=images",
      "https://imgapi.cn/api.php?zd=mobile&fl=meizi&gs=images",
      "https://imgapi.cn/api.php?zd=mobile&fl=meizi&gs=images",
    ];

    const now = new Date();
    const timeString = `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;

    // 生成所有图片URL
    const generatedImages = [];
    for (let i = 0; i < this.currentCount; i++) {
      const imageUrl =
        demoImages[i] ||
        `https://imgapi.cn/api.php?zd=mobile&fl=meizi&gs=images`;
      generatedImages.push(imageUrl);

      // 添加到预览区
      this.previewGrid.appendChild(this.createImageItem(imageUrl));
    }

    // 创建层级视图的图片组
    const historyGroup = document.createElement("div");
    historyGroup.className = "history-group";
    historyGroup.innerHTML = `
      <img src="${generatedImages[0]}" alt="组预览图片">
      <div class="image-actions">
        <button class="image-action-btn" title="收藏" onclick="handleFavorite(this)">
          <i class="ri-heart-line"></i>
        </button>
      </div>
      <div class="group-count">${this.currentCount}张</div>
    `;

    // 添加到层级视图
    const treeViewList = document.getElementById("treeViewList");
    const emptyState = treeViewList.querySelector(".history-empty-state");
    if (emptyState) {
      emptyState.remove();
    }
    treeViewList.insertBefore(historyGroup, treeViewList.firstChild);

    // 添加到平铺视图
    const gridViewList = document.getElementById("gridViewList");
    generatedImages.forEach((imageUrl) => {
      const historyItem = document.createElement("div");
      historyItem.className = "history-item";
      historyItem.innerHTML = `
        <img src="${imageUrl}" alt="生成图片">
        <div class="image-actions">
          <button class="image-action-btn" title="收藏" onclick="handleFavorite(this)">
            <i class="ri-heart-line"></i>
          </button>
        </div>
      `;
      const gridEmptyState = gridViewList.querySelector(".history-empty-state");
      if (gridEmptyState) {
        gridEmptyState.remove();
      }
      gridViewList.insertBefore(historyItem, gridViewList.firstChild);
    });
  }

  updateCount(delta) {
    let count = parseInt(this.generateCount.value) + delta;
    count = Math.max(1, Math.min(4, count));
    this.generateCount.value = count;
    this.currentCount = count;
  }

  validateCount() {
    let count = parseInt(this.generateCount.value);
    count = Math.max(1, Math.min(4, count));
    this.generateCount.value = count;
    this.currentCount = count;
  }

  handleRatioChange(btn) {
    document
      .querySelectorAll(".ratio-btn")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    this.currentRatio = btn.getAttribute("data-ratio");
  }

  toggleHistory() {
    if (this.imageHistory) {
      this.imageHistory.classList.toggle("collapsed");
      const icon = this.historyToggleBtn.querySelector("i");
      if (icon) {
        if (this.imageHistory.classList.contains("collapsed")) {
          icon.classList.replace(
            "ri-arrow-left-s-line",
            "ri-arrow-right-s-line",
          );
        } else {
          icon.classList.replace(
            "ri-arrow-right-s-line",
            "ri-arrow-left-s-line",
          );
        }
      }
      localStorage.setItem(
        "imageHistoryCollapsed",
        this.imageHistory.classList.contains("collapsed"),
      );
    }
  }

  handleUpload() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/jpeg,image/png";
    input.onchange = (e) => this.handleFile(e.target.files[0]);
    input.click();
  }

  handleDrop(e) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      this.handleFile(file);
    }
  }

  handleFile(file) {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      this.uploadArea.innerHTML = `
                <img src="${e.target.result}" alt="上传的图片" style="max-width: 100%; max-height: 100%; object-fit: contain;">
            `;

      // 添加删除按钮
      const deleteBtn = document.createElement("button");
      deleteBtn.className = "delete-btn";
      deleteBtn.innerHTML = '<i class="ri-delete-bin-line"></i>';
      deleteBtn.style.position = "absolute";
      deleteBtn.style.top = "8px";
      deleteBtn.style.right = "8px";
      deleteBtn.style.background = "rgba(255, 255, 255, 0.9)";
      deleteBtn.style.border = "none";
      deleteBtn.style.borderRadius = "50%";
      deleteBtn.style.width = "24px";
      deleteBtn.style.height = "24px";
      deleteBtn.style.display = "flex";
      deleteBtn.style.alignItems = "center";
      deleteBtn.style.justifyContent = "center";
      deleteBtn.style.cursor = "pointer";
      deleteBtn.style.zIndex = "10";
      deleteBtn.onclick = (e) => {
        e.stopPropagation();
        this.uploadArea.innerHTML = `
          <div class="upload-icon">
            <i class="ri-upload-cloud-2-line"></i>
          </div>
          <div class="upload-text">
            <p>点击上传参考图片</p>
            <p class="upload-tip">支持jpg、png等格式</p>
          </div>
        `;
      };
      this.uploadArea.appendChild(deleteBtn);
    };
    reader.readAsDataURL(file);
  }
}
