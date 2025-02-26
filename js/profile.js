// 服务器图片相关功能
function showServerImages(btn) {
  const modal = document.getElementById("serverImagesModal");
  const previewGrid = btn
    .closest(".record-item-content")
    .querySelector(".media-preview-grid");
  modal.dataset.targetGrid = previewGrid.id || `grid_${Date.now()}`;
  if (!previewGrid.id) previewGrid.id = modal.dataset.targetGrid;
  // 加载服务器图片
  loadServerImages();
  modal.style.display = "flex";
}

function closeServerImagesModal() {
  const modal = document.getElementById("serverImagesModal");
  modal.style.display = "none";
  // 清除选中状态
  const selectedImages = modal.querySelectorAll(".server-image-item.selected");
  selectedImages.forEach((item) => item.classList.remove("selected"));
}

async function loadServerImages() {
  const grid = document.querySelector(".server-images-grid");
  grid.innerHTML = ""; // 清空现有内容
  try {
    // 创建时间轴容器
    const timelineContainer = document.createElement("div");
    timelineContainer.className = "server-images-timeline";
    // 创建时间轴
    const timeline = document.createElement("div");
    timeline.className = "timeline";
    timelineContainer.appendChild(timeline);
    grid.appendChild(timelineContainer);
    // 模拟按日期分组的图片数据
    const imageGroups = {
      "2024-02-15": [
        "./images/plants/black-oyster-mushrooms.jpg",
        "./images/plants/butter-lettuce.jpg",
        "./images/plants/chives.jpg",
        "./images/plants/black-oyster-mushrooms.jpg",
        "./images/plants/butter-lettuce.jpg",
        "./images/plants/chives.jpg",
      ],
      "2024-02-16": [
        "./images/plants/black-oyster-mushrooms.jpg",
        "./images/plants/butter-lettuce.jpg",
        "./images/plants/chives.jpg",
        "./images/plants/black-oyster-mushrooms.jpg",
        "./images/plants/butter-lettuce.jpg",
        "./images/plants/chives.jpg",
      ],
    };
    // 遍历日期组并创建图片网格
    Object.entries(imageGroups).forEach(([date, images]) => {
      const dateGroup = document.createElement("div");
      dateGroup.className = "timeline-date-group";
      const dateLabel = document.createElement("div");
      dateLabel.className = "timeline-date";
      dateLabel.textContent = date;
      dateLabel.onclick = () => {
        dateGroup.classList.toggle("collapsed");
      };
      dateGroup.appendChild(dateLabel);
      // 创建图片网格容器
      const imagesGrid = document.createElement("div");
      imagesGrid.className = "timeline-images-grid";
      // 添加图片
      images.forEach((imageSrc) => {
        const imageItem = document.createElement("div");
        imageItem.className = "server-image-item";
        imageItem.onclick = () => toggleImageSelection(imageItem);
        const img = document.createElement("img");
        img.src = imageSrc;
        img.alt = imageSrc
          .split("/")
          .pop()
          .replace(".jpg", "")
          .replace(/-/g, " ");
        const imageInfo = document.createElement("div");
        imageInfo.className = "image-info";
        imageInfo.innerHTML = `<span class="upload-date">${date}</span>`;
        imageItem.appendChild(img);
        imageItem.appendChild(imageInfo);
        imagesGrid.appendChild(imageItem);
      });
      dateGroup.appendChild(imagesGrid);
      timeline.appendChild(dateGroup);
    });
  } catch (error) {
    console.error("加载图片失败:", error);
    grid.innerHTML = '<div class="error-message">加载图片失败，请重试</div>';
  }
}

function toggleImageSelection(item) {
  item.classList.toggle("selected");
}

function filterServerImages(keyword) {
  const items = document.querySelectorAll(".server-image-item");
  items.forEach((item) => {
    const imageName = item.querySelector("img").alt.toLowerCase();
    item.style.display = imageName.includes(keyword.toLowerCase())
      ? ""
      : "none";
  });
}

function addSelectedImages() {
  const modal = document.getElementById("serverImagesModal");
  const targetGrid = document.getElementById(modal.dataset.targetGrid);
  const selectedImages = document.querySelectorAll(
    ".server-image-item.selected img",
  );
  selectedImages.forEach((img) => {
    const mediaCard = document.createElement("div");
    mediaCard.className = "media-card";
    mediaCard.style.opacity = "0";
    mediaCard.style.transform = "translateY(20px)";

    // 创建加载指示器
    const loadingIndicator = document.createElement("div");
    loadingIndicator.className = "loading-indicator";
    loadingIndicator.innerHTML =
      '<span class="material-icons rotating">refresh</span>';
    mediaCard.appendChild(loadingIndicator);
    // 创建新的图片元素
    const newImg = document.createElement("img");
    newImg.style.opacity = "0";
    newImg.src = img.src;
    newImg.alt = img.alt;
    // 图片加载完成后显示
    newImg.onload = function () {
      loadingIndicator.style.display = "none";
      newImg.style.opacity = "1";
      // 添加平滑过渡效果
      setTimeout(() => {
        mediaCard.style.opacity = "1";
        mediaCard.style.transform = "translateY(0)";
      }, 50);
    };
    mediaCard.appendChild(newImg);
    mediaCard.innerHTML += `
      <div class="media-overlay">
        <button type="button" class="media-action-btn delete-btn" onclick="deleteMedia(this)">
          <span class="material-icons">delete</span>
        </button>
      </div>
    `;

    targetGrid.appendChild(mediaCard);
  });
  closeServerImagesModal();
}

document.addEventListener("DOMContentLoaded", () => {
  const navGroups = document.querySelectorAll(".nav-group");
  const navItems = document.querySelectorAll(".nav-item");
  const contentSections = document.querySelectorAll(".content-section");

  // 处理导航组点击
  navGroups.forEach((group) => {
    const title = group.querySelector(".nav-title");
    const subMenu = group.querySelector(".sub-menu");

    title.addEventListener("click", () => {
      // 可以添加展开/折叠效果
      group.classList.toggle("expanded");
    });
  });

  // 处理导航项点击
  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      // 移除所有活动状态
      navItems.forEach((nav) => nav.classList.remove("active"));
      contentSections.forEach((section) => section.classList.remove("active"));

      // 添加新的活动状态
      item.classList.add("active");
      const sectionId = item.dataset.section;
      document.getElementById(sectionId)?.classList.add("active");
    });
  });

  // 种植记录标签页切换
  const plantingTabBtns = document.querySelectorAll("#my-planting .tab-btn");
  const plantingTabContents = document.querySelectorAll(
    ".planting-tab-content",
  );

  plantingTabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      // 移除所有活动状态
      plantingTabBtns.forEach((b) => b.classList.remove("active"));
      plantingTabContents.forEach((c) => c.classList.remove("active"));

      // 添加新的活动状态
      btn.classList.add("active");
      const tabId = `${btn.dataset.tab}-planting`;
      const targetContent = document.getElementById(tabId);
      if (targetContent) {
        targetContent.classList.add("active");
      }
    });
  });

  // 海报记录标签页切换
  const posterTabBtns = document.querySelectorAll("#generate-poster .tab-btn");
  const posterTabContents = document.querySelectorAll(
    "#generate-poster .poster-tab-content",
  );

  posterTabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      // 移除所有活动状态
      posterTabBtns.forEach((b) => b.classList.remove("active"));
      posterTabContents.forEach((c) => c.classList.remove("active"));

      // 添加新的活动状态
      btn.classList.add("active");
      const tabId = `${btn.dataset.tab}-content`;
      const targetContent = document.getElementById(tabId);
      if (targetContent) {
        targetContent.classList.add("active");
      }
    });
  });

  // 移动端菜单控制
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  const sidebar = document.querySelector(".profile-sidebar");
  const overlay = document.querySelector(".sidebar-overlay");

  if (mobileMenuBtn && sidebar && overlay) {
    // 打开菜单
    mobileMenuBtn.addEventListener("click", () => {
      sidebar.classList.add("active");
      overlay.classList.add("active");
      document.body.style.overflow = "hidden"; // 防止背景滚动
    });

    // 点击遮罩层关闭菜单
    overlay.addEventListener("click", () => {
      sidebar.classList.remove("active");
      overlay.classList.remove("active");
      document.body.style.overflow = "";
    });

    // 点击菜单项后关闭菜单
    navItems.forEach((item) => {
      item.addEventListener("click", () => {
        if (window.innerWidth <= 768) {
          sidebar.classList.remove("active");
          overlay.classList.remove("active");
          document.body.style.overflow = "";
        }
      });
    });
  }

  // 导航组展开/折叠
  navGroups.forEach((group) => {
    const title = group.querySelector(".nav-title");
    title.addEventListener("click", () => {
      if (window.innerWidth <= 768) {
        group.classList.toggle("expanded");
      }
    });
  });

  // AI问答标签页切换
  const qaTabBtns = document.querySelectorAll("#ai-qa .tab-btn");
  const qaTabContents = document.querySelectorAll("#ai-qa .qa-tab-content");

  qaTabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      // 移除所有活动状态
      qaTabBtns.forEach((b) => b.classList.remove("active"));
      qaTabContents.forEach((c) => c.classList.remove("active"));

      // 添加新的活动状态
      btn.classList.add("active");
      const tabId = `${btn.dataset.tab}-content`;
      const targetContent = document.querySelector(`#ai-qa #${tabId}`);
      if (targetContent) {
        targetContent.classList.add("active");

        // 如果切换到历史记录，确保滚动条重置
        if (btn.dataset.tab === "history") {
          const historyList = targetContent.querySelector(".qa-history-list");
          if (historyList) {
            historyList.scrollTop = 0;
          }
        }
      }
    });
  });

  // 确保文本域自动调整高度
  document
    .querySelectorAll('textarea[data-autosize="true"]')
    .forEach((textarea) => {
      textarea.addEventListener("input", function () {
        this.style.height = "auto";
        this.style.height = this.scrollHeight + "px";
      });
    });
});

// 切换报告详情显示
function toggleReportDetail(button) {
  const reportCard = button.closest(".report-card");
  const reportDetail = reportCard.querySelector(".report-detail");
  const isExpanded = reportDetail.classList.contains("active");

  // 更新按钮状态
  button.classList.toggle("active");

  if (isExpanded) {
    reportDetail.classList.remove("active");
  } else {
    reportDetail.classList.add("active");

    // 滚动到展开的卡片
    setTimeout(() => {
      reportCard.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 300);
  }
}
