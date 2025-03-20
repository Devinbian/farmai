// 公共功能模块 - 包含导航、侧边栏等功能

export function initNavigation() {
  const navLinks = document.querySelectorAll(".ai-nav a");
  const sections = document.querySelectorAll(".ai-section");
  const navGroups = document.querySelectorAll(".nav-group");

  // 设置一级菜单展开/折叠功能
  navGroups.forEach((group) => {
    const title = group.querySelector(".nav-group-title");

    title.addEventListener("click", () => {
      group.classList.toggle("collapsed");
    });
  });

  // 设置链接点击处理
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href").substring(1);

      navLinks.forEach((l) => l.classList.remove("active"));
      link.classList.add("active");

      sections.forEach((section) => {
        section.classList.remove("active");
        if (section.id === targetId) {
          section.classList.add("active");
        }
      });
    });
  });
}

export function initSidebarToggle() {
  const sidebar = document.querySelector(".ai-sidebar");
  const toggleBtn = document.querySelector(".sidebar-toggle-btn");

  if (!sidebar || !toggleBtn) return;

  // 添加点击事件
  toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");

    // 切换图标
    const icon = toggleBtn.querySelector("i");
    if (icon) {
      if (sidebar.classList.contains("collapsed")) {
        icon.classList.replace("ri-menu-fold-line", "ri-menu-unfold-line");
      } else {
        icon.classList.replace("ri-menu-unfold-line", "ri-menu-fold-line");
      }
    }

    // 保存当前状态到localStorage
    localStorage.setItem(
      "sidebarCollapsed",
      sidebar.classList.contains("collapsed"),
    );
  });

  // 页面加载时恢复状态
  const isCollapsed = localStorage.getItem("sidebarCollapsed") === "true";
  if (isCollapsed) {
    sidebar.classList.add("collapsed");
    // 恢复图标状态
    const icon = toggleBtn.querySelector("i");
    if (icon) {
      icon.classList.replace("ri-menu-fold-line", "ri-menu-unfold-line");
    }
  }
}

// 批量操作相关公共函数
export function handleFavorite(btn) {
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

export function handleDownload(url) {
  const link = document.createElement("a");
  link.href = url;
  link.download = `generated-file-${Date.now()}`;
  link.click();
}

export function initBatchOperations() {
  // 获取批量按钮和历史区域DOM元素
  const batchBtn = document.querySelector(".batch-btn");
  const imageHistory = document.querySelector(".image-history");
  const historyContent = document.querySelector(".history-content");

  // 检查批量按钮是否存在
  if (!batchBtn) return;

  // 初始化批量操作栏
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

  // 将批量操作栏添加到历史区域
  imageHistory.appendChild(batchActionsBar);

  // 为图片项添加复选框
  function addCheckboxesToItems() {
    // 处理层级视图中的图片组
    document.querySelectorAll(".history-group").forEach((group) => {
      if (!group.querySelector(".checkbox-container")) {
        const checkboxContainer = document.createElement("div");
        checkboxContainer.className = "checkbox-container";
        checkboxContainer.innerHTML = `
          <div class="custom-checkbox">
            <i class="ri-check-line"></i>
          </div>
        `;
        group.appendChild(checkboxContainer);

        // 添加点击事件
        checkboxContainer.addEventListener("click", (e) => {
          e.stopPropagation();
          toggleCheckbox(checkboxContainer.querySelector(".custom-checkbox"));
          updateSelectedCount();
        });
      }
    });

    // 处理平铺视图中的图片项
    document.querySelectorAll(".history-item").forEach((item) => {
      if (!item.querySelector(".checkbox-container")) {
        const checkboxContainer = document.createElement("div");
        checkboxContainer.className = "checkbox-container";
        checkboxContainer.innerHTML = `
          <div class="custom-checkbox">
            <i class="ri-check-line"></i>
          </div>
        `;
        item.appendChild(checkboxContainer);

        // 添加点击事件
        checkboxContainer.addEventListener("click", (e) => {
          e.stopPropagation();
          toggleCheckbox(checkboxContainer.querySelector(".custom-checkbox"));
          updateSelectedCount();
        });
      }
    });
  }

  // 切换复选框状态
  function toggleCheckbox(checkbox) {
    checkbox.classList.toggle("checked");
  }

  // 更新已选择项计数
  function updateSelectedCount() {
    const checkedBoxes = document.querySelectorAll(".custom-checkbox.checked");
    document.querySelector(".selected-count").textContent = checkedBoxes.length;
  }

  // 添加批量按钮点击事件
  batchBtn.addEventListener("click", () => {
    // 切换批量按钮激活状态
    batchBtn.classList.toggle("active");

    // 切换批量模式
    if (imageHistory.classList.toggle("batch-mode")) {
      // 进入批量模式
      addCheckboxesToItems();

      // 更新选中计数
      updateSelectedCount();
    } else {
      // 退出批量模式，清除所有选中状态
      document.querySelectorAll(".custom-checkbox").forEach((checkbox) => {
        checkbox.classList.remove("checked");
      });
      updateSelectedCount();
    }
  });

  // 为批量操作按钮添加事件监听
  const favoriteBtn = batchActionsBar.querySelector(".favorite-btn");
  const downloadBtn = batchActionsBar.querySelector(".download-btn");
  const deleteBtn = batchActionsBar.querySelector(".delete-btn");

  favoriteBtn.addEventListener("click", () => {
    const selectedItems = getSelectedItems();
    // 添加收藏功能
    selectedItems.forEach((item) => {
      const favoriteBtn = item.querySelector('.image-action-btn[title="收藏"]');
      if (favoriteBtn) {
        handleFavorite(favoriteBtn);
      }
    });
  });

  downloadBtn.addEventListener("click", () => {
    const selectedItems = getSelectedItems();
    // 下载选择的图片
    selectedItems.forEach((item) => {
      const imgSrc = item.querySelector("img").src;
      const link = document.createElement("a");
      link.href = imgSrc;
      link.download = "image-" + Date.now() + ".jpg";
      link.click();
    });
  });

  deleteBtn.addEventListener("click", () => {
    const selectedItems = getSelectedItems();
    // 删除选择的图片
    selectedItems.forEach((item) => {
      item.remove();
    });
    // 更新计数
    updateSelectedCount();

    // 检查是否需要显示空状态
    const treeViewList = document.getElementById("treeViewList");
    const gridViewList = document.getElementById("gridViewList");

    if (
      treeViewList &&
      treeViewList.querySelectorAll(".history-group").length === 0
    ) {
      treeViewList.innerHTML = `
        <div class="history-empty-state">
          <div class="empty-icon">
            <i class="ri-image-2-line"></i>
          </div>
          <p class="empty-text">暂无生成记录</p>
        </div>
      `;
    }

    if (
      gridViewList &&
      gridViewList.querySelectorAll(".history-item").length === 0
    ) {
      gridViewList.innerHTML = `
        <div class="history-empty-state">
          <div class="empty-icon">
            <i class="ri-image-2-line"></i>
          </div>
          <p class="empty-text">暂无生成记录</p>
        </div>
      `;
    }
  });

  // 获取所有已选择的项
  function getSelectedItems() {
    const checkedBoxes = Array.from(
      document.querySelectorAll(".custom-checkbox.checked"),
    );
    return checkedBoxes.map(
      (checkbox) =>
        checkbox.closest(".history-group") || checkbox.closest(".history-item"),
    );
  }

  // 当生成新图片时，为新元素添加复选框
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
        if (imageHistory.classList.contains("batch-mode")) {
          addCheckboxesToItems();
        }
      }
    });
  });

  // 监视树形视图和网格视图的变化
  const treeViewList = document.getElementById("treeViewList");
  const gridViewList = document.getElementById("gridViewList");

  if (treeViewList) {
    observer.observe(treeViewList, { childList: true });
  }

  if (gridViewList) {
    observer.observe(gridViewList, { childList: true });
  }
}
