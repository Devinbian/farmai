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
