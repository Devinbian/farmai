// AI视频模块 - 包含视频生成功能

import { handleFavorite, handleDownload } from "./ai-common.js";

export function initVideoGeneration() {
  const videoGenerationContainer = document.querySelector(
    ".video-generation-container",
  );
  if (!videoGenerationContainer) return;

  // 创意想象力滑块
  const imaginationSlider = videoGenerationContainer.querySelector(
    ".imagination-slider input",
  );
  const sliderValue = videoGenerationContainer.querySelector(".slider-value");
  if (imaginationSlider && sliderValue) {
    imaginationSlider.addEventListener("input", () => {
      sliderValue.textContent = imaginationSlider.value;
    });
  }

  // 标签点击事件
  const videoTags = videoGenerationContainer.querySelectorAll(".tag");
  videoTags.forEach((tag) => {
    tag.addEventListener("click", () => {
      const promptTextarea = videoGenerationContainer.querySelector(
        ".prompt-input textarea",
      );
      const currentText = promptTextarea.value;
      const tagText = tag.textContent.trim();

      // 如果标签文本已经存在，则移除
      if (currentText.includes(tagText)) {
        promptTextarea.value = currentText.replace(tagText, "").trim();
      } else {
        // 否则添加标签文本
        promptTextarea.value = currentText
          ? `${currentText} ${tagText}`
          : tagText;
      }
    });
  });

  // 生成数量控制
  const generateCount = videoGenerationContainer.querySelector(
    ".number-input input",
  );
  const minusBtn = videoGenerationContainer.querySelector(".number-btn.minus");
  const plusBtn = videoGenerationContainer.querySelector(".number-btn.plus");

  if (minusBtn && plusBtn && generateCount) {
    minusBtn.addEventListener("click", () => {
      let count = parseInt(generateCount.value) - 1;
      count = Math.max(1, Math.min(4, count));
      generateCount.value = count;
    });

    plusBtn.addEventListener("click", () => {
      let count = parseInt(generateCount.value) + 1;
      count = Math.max(1, Math.min(4, count));
      generateCount.value = count;
    });

    generateCount.addEventListener("change", () => {
      let count = parseInt(generateCount.value);
      count = Math.max(1, Math.min(4, count));
      generateCount.value = count;
    });
  }

  // 上传参考视频功能
  const uploadArea = videoGenerationContainer.querySelector(".upload-area");
  if (uploadArea) {
    uploadArea.addEventListener("click", () => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "video/*";
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          // 检查文件大小（限制为100MB）
          if (file.size > 100 * 1024 * 1024) {
            alert("视频文件大小不能超过100MB");
            return;
          }

          // 检查文件类型
          if (!file.type.startsWith("video/")) {
            alert("请上传有效的视频文件");
            return;
          }

          // 创建视频预览
          const videoUrl = URL.createObjectURL(file);
          const videoPreview = document.createElement("video");
          videoPreview.src = videoUrl;
          videoPreview.controls = true;
          videoPreview.style.width = "100%";
          videoPreview.style.height = "100%";
          videoPreview.style.objectFit = "cover";

          // 清空上传区域并添加视频预览
          uploadArea.innerHTML = "";
          uploadArea.appendChild(videoPreview);

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
            uploadArea.innerHTML = `
              <div class="upload-icon">
                <i class="ri-upload-cloud-2-line"></i>
              </div>
              <div class="upload-text">
                <p>点击上传参考视频</p>
                <p class="upload-tip">支持mp4、mov等格式，大小不超过100MB</p>
              </div>
            `;
          };
          uploadArea.appendChild(deleteBtn);
        }
      };
      input.click();
    });
  }

  // 立即生成视频功能
  const generateBtn = videoGenerationContainer.querySelector(".primary-btn");
  if (generateBtn) {
    generateBtn.addEventListener("click", () => {
      const prompt = videoGenerationContainer.querySelector(
        ".prompt-input textarea",
      ).value;
      if (!prompt.trim()) {
        alert("请输入视频描述");
        return;
      }

      // 获取所有参数
      const imagination = videoGenerationContainer.querySelector(
        ".imagination-slider input",
      ).value;
      const mode = videoGenerationContainer.querySelector(
        ".mode-options input:checked",
      ).value;
      const duration = videoGenerationContainer.querySelector(
        ".duration-options input:checked",
      ).value;
      const ratio =
        videoGenerationContainer.querySelector(".ratio-btn.active").textContent;
      const count = parseInt(
        videoGenerationContainer.querySelector(".number-input input").value,
      );

      // 显示生成中的状态
      const previewArea =
        videoGenerationContainer.querySelector(".preview-area");
      if (!previewArea) {
        console.warn("预览区域未找到");
        return;
      }

      // 创建预览网格
      const previewGrid = document.createElement("div");
      previewGrid.className = "preview-grid";
      previewGrid.style.display = "grid";
      previewGrid.style.gridTemplateColumns =
        "repeat(auto-fit, minmax(200px, 1fr))";
      previewGrid.style.gap = "16px";
      previewGrid.style.padding = "16px";

      // 清空预览区域并添加预览网格
      previewArea.innerHTML = "";
      previewArea.appendChild(previewGrid);

      // 添加生成中的状态
      for (let i = 0; i < count; i++) {
        const previewItem = document.createElement("div");
        previewItem.className = "preview-item generating";
        previewItem.innerHTML = `
          <div class="loading-spinner"></div>
          <div class="generating-text">正在生成视频 ${i + 1}/${count}</div>
        `;
        previewGrid.appendChild(previewItem);
      }

      // 模拟视频生成过程
      mockVideoGeneration(prompt, imagination, mode, duration, ratio, count);
    });
  } else {
    console.warn("生成按钮未找到");
  }

  // 注册全局函数，以便HTML调用
  window.handleFavorite = handleFavorite;
  window.handleDownload = handleDownload;

  // 初始化视频历史区域功能
  initVideoHistory();
}

// 模拟视频生成
function mockVideoGeneration(
  prompt,
  imagination,
  mode,
  duration,
  ratio,
  count,
) {
  const previewGrid = document.querySelector(
    ".video-generation-container .preview-grid",
  );
  let completedCount = 0;

  // 模拟每个视频的生成过程
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      completedCount++;
      const previewItem = previewGrid.children[i];

      // 创建视频元素
      const video = document.createElement("video");
      video.src = "path/to/mock/video.mp4"; // 这里应该是实际的视频URL
      video.controls = true;
      video.style.width = "100%";
      video.style.height = "100%";
      video.style.objectFit = "cover";

      // 替换生成中的状态
      previewItem.innerHTML = "";
      previewItem.appendChild(video);

      // 添加操作按钮
      const actions = document.createElement("div");
      actions.className = "image-actions";
      actions.innerHTML = `
        <button class="image-action-btn" title="收藏" onclick="handleFavorite(this)">
          <i class="ri-heart-line"></i>
        </button>
        <button class="image-action-btn" title="下载" onclick="handleDownload('path/to/mock/video.mp4')">
          <i class="ri-download-line"></i>
        </button>
      `;
      previewItem.appendChild(actions);

      // 如果所有视频都生成完成，更新状态并添加到历史记录
      if (completedCount === count) {
        const previewFooter = document.querySelector(
          ".video-generation-container .preview-footer",
        );
        previewFooter.innerHTML = "<p>视频生成完成</p>";

        // 添加到历史记录
        const now = new Date();
        const timeString = `${now.getHours().toString().padStart(2, "0")}:${now
          .getMinutes()
          .toString()
          .padStart(2, "0")}`;

        // 创建层级视图的视频组
        const historyGroup = document.createElement("div");
        historyGroup.className = "history-group";
        historyGroup.innerHTML = `
          <video src="path/to/mock/video.mp4" controls></video>
          <div class="image-actions">
            <button class="image-action-btn" title="收藏" onclick="handleFavorite(this)">
              <i class="ri-heart-line"></i>
            </button>
          </div>
          <div class="group-count">${count}个</div>
        `;

        // 添加到层级视图
        const treeViewList = document.getElementById("videoTreeViewList");
        const emptyState = treeViewList.querySelector(".history-empty-state");
        if (emptyState) {
          emptyState.remove();
        }
        treeViewList.insertBefore(historyGroup, treeViewList.firstChild);

        // 添加到平铺视图
        const gridViewList = document.getElementById("videoGridViewList");
        for (let i = 0; i < count; i++) {
          const historyItem = document.createElement("div");
          historyItem.className = "history-item";
          historyItem.innerHTML = `
            <video src="path/to/mock/video.mp4" controls></video>
            <div class="image-actions">
              <button class="image-action-btn" title="收藏" onclick="handleFavorite(this)">
                <i class="ri-heart-line"></i>
              </button>
            </div>
          `;
          const gridEmptyState = gridViewList.querySelector(
            ".history-empty-state",
          );
          if (gridEmptyState) {
            gridEmptyState.remove();
          }
          gridViewList.insertBefore(historyItem, gridViewList.firstChild);
        }
      }
    }, (i + 1) * 2000); // 每个视频间隔2秒生成
  }
}

// 视频历史区域功能
export function initVideoHistory() {
  const videoHistory = document.querySelector(".video-history");
  const videoHistoryToggleBtn = videoHistory?.querySelector(".toggle-btn");
  const videoViewButtons = document.querySelectorAll(
    ".video-history .view-btn",
  );
  const videoTreeView = document.getElementById("videoTreeViewList");
  const videoGridView = document.getElementById("videoGridViewList");
  const videoBatchBtn = videoHistory?.querySelector(".batch-btn");

  // 添加z-index样式以确保按钮可点击
  if (videoHistoryToggleBtn) {
    videoHistoryToggleBtn.style.zIndex = "100";
  }

  if (videoBatchBtn) {
    videoBatchBtn.style.zIndex = "10";
  }

  // 展开/收起功能
  if (videoHistoryToggleBtn) {
    videoHistoryToggleBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      videoHistory.classList.toggle("collapsed");
      const icon = videoHistoryToggleBtn.querySelector("i");
      if (icon) {
        if (videoHistory.classList.contains("collapsed")) {
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
        "videoHistoryCollapsed",
        videoHistory.classList.contains("collapsed"),
      );
    });

    // 恢复上次的展开/收起状态
    const isCollapsed =
      localStorage.getItem("videoHistoryCollapsed") === "true";
    if (isCollapsed) {
      videoHistory.classList.add("collapsed");
      const icon = videoHistoryToggleBtn.querySelector("i");
      if (icon) {
        icon.classList.replace("ri-arrow-left-s-line", "ri-arrow-right-s-line");
      }
    }
  }

  // 视图切换功能
  videoViewButtons.forEach((button) => {
    button.addEventListener("click", function () {
      videoViewButtons.forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");

      const viewType = this.getAttribute("data-view");
      if (viewType === "tree") {
        videoTreeView.style.display = "flex";
        videoGridView.style.display = "none";
      } else {
        videoTreeView.style.display = "none";
        videoGridView.style.display = "flex";
      }
    });
  });

  // 收藏功能
  function handleVideoFavorite(btn) {
    const iconEl = btn.querySelector("i");
    if (iconEl.classList.contains("ri-heart-line")) {
      iconEl.classList.remove("ri-heart-line");
      iconEl.classList.add("ri-heart-fill");
      btn.setAttribute("data-favorited", "true");
    } else {
      iconEl.classList.remove("ri-heart-fill");
      iconEl.classList.add("ri-heart-line");
      btn.setAttribute("data-favorited", "false");
    }
  }

  // 为所有视频收藏按钮添加事件监听
  function addVideoFavoriteListeners() {
    const favoriteButtons = document.querySelectorAll(
      '.video-history .video-action-btn[title="收藏"]',
    );
    favoriteButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        handleVideoFavorite(btn);
      });
    });
  }

  // 批量操作功能
  if (videoBatchBtn) {
    let batchActionsBar = document.createElement("div");
    batchActionsBar.className = "batch-actions-bar";
    batchActionsBar.innerHTML = `
      <div class="batch-info">已选择 <span class="selected-count">0</span> 项</div>
      <div class="batch-buttons">
        <button class="batch-action-btn favorite-btn">
          <i class="ri-heart-line"></i>
          <span>收藏</span>
        </button>
        <button class="batch-action-btn download-btn">
          <i class="ri-download-line"></i>
          <span>下载</span>
        </button>
        <button class="batch-action-btn delete-btn">
          <i class="ri-delete-bin-line"></i>
          <span>删除</span>
        </button>
      </div>
    `;

    videoHistory.appendChild(batchActionsBar);

    function addCheckboxesToVideoItems() {
      document
        .querySelectorAll(
          ".video-history .history-group, .video-history .history-item",
        )
        .forEach((item) => {
          if (!item.querySelector(".checkbox-container")) {
            const checkboxContainer = document.createElement("div");
            checkboxContainer.className = "checkbox-container";
            checkboxContainer.innerHTML = `
            <div class="custom-checkbox">
              <i class="ri-check-line"></i>
            </div>
          `;
            item.appendChild(checkboxContainer);

            checkboxContainer.addEventListener("click", (e) => {
              e.stopPropagation();
              toggleCheckbox(
                checkboxContainer.querySelector(".custom-checkbox"),
              );
              updateSelectedCount();
            });
          }
        });
    }

    function toggleCheckbox(checkbox) {
      checkbox.classList.toggle("checked");
    }

    function updateSelectedCount() {
      const checkedBoxes = document.querySelectorAll(
        ".video-history .custom-checkbox.checked",
      );
      document.querySelector(".video-history .selected-count").textContent =
        checkedBoxes.length;
    }

    function getSelectedVideoItems() {
      const checkedBoxes = Array.from(
        document.querySelectorAll(".video-history .custom-checkbox.checked"),
      );
      return checkedBoxes.map(
        (checkbox) =>
          checkbox.closest(".history-group") ||
          checkbox.closest(".history-item"),
      );
    }

    videoBatchBtn.addEventListener("click", () => {
      videoBatchBtn.classList.toggle("active");
      if (videoHistory.classList.toggle("batch-mode")) {
        addCheckboxesToVideoItems();
        updateSelectedCount();
      } else {
        document
          .querySelectorAll(".video-history .custom-checkbox")
          .forEach((checkbox) => {
            checkbox.classList.remove("checked");
          });
        updateSelectedCount();
      }
    });

    // 批量操作按钮事件
    const favoriteBtn = batchActionsBar.querySelector(".favorite-btn");
    const downloadBtn = batchActionsBar.querySelector(".download-btn");
    const deleteBtn = batchActionsBar.querySelector(".delete-btn");

    favoriteBtn.addEventListener("click", () => {
      const selectedItems = getSelectedVideoItems();
      selectedItems.forEach((item) => {
        const favoriteBtn = item.querySelector(
          '.video-action-btn[title="收藏"]',
        );
        if (favoriteBtn) {
          handleVideoFavorite(favoriteBtn);
        }
      });
    });

    downloadBtn.addEventListener("click", () => {
      const selectedItems = getSelectedVideoItems();
      selectedItems.forEach((item) => {
        const videoSrc = item.querySelector("video").src;
        const link = document.createElement("a");
        link.href = videoSrc;
        link.download = "video-" + Date.now() + ".mp4";
        link.click();
      });
    });

    deleteBtn.addEventListener("click", () => {
      const selectedItems = getSelectedVideoItems();
      selectedItems.forEach((item) => item.remove());
      updateSelectedCount();

      // 检查是否需要显示空状态
      if (
        videoTreeView &&
        videoTreeView.querySelectorAll(".history-group").length === 0
      ) {
        videoTreeView.innerHTML = `
          <div class="history-empty-state">
            <div class="empty-icon">
              <i class="ri-video-add-line"></i>
            </div>
            <p class="empty-text">暂无生成记录</p>
          </div>
        `;
      }

      if (
        videoGridView &&
        videoGridView.querySelectorAll(".history-item").length === 0
      ) {
        videoGridView.innerHTML = `
          <div class="history-empty-state">
            <div class="empty-icon">
              <i class="ri-video-add-line"></i>
            </div>
            <p class="empty-text">暂无生成记录</p>
          </div>
        `;
      }
    });
  }

  // 初始化时添加收藏按钮事件监听
  addVideoFavoriteListeners();

  // 监听视频历史区域的变化，为新添加的元素添加事件监听
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
        addVideoFavoriteListeners();
        if (videoHistory.classList.contains("batch-mode")) {
          addCheckboxesToVideoItems();
        }
      }
    });
  });

  if (videoTreeView) {
    observer.observe(videoTreeView, { childList: true });
  }
  if (videoGridView) {
    observer.observe(videoGridView, { childList: true });
  }
}
