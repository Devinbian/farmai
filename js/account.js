document.addEventListener("DOMContentLoaded", () => {
  // 导航项点击处理
  const navItems = document.querySelectorAll(".nav-item");
  const contentSections = document.querySelectorAll(".content-section");

  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      // 移除所有活动状态
      navItems.forEach((nav) => nav.classList.remove("active"));
      contentSections.forEach((section) => section.classList.remove("active"));

      // 添加新的活动状态
      item.classList.add("active");
      const sectionId = item.dataset.section;
      document.getElementById(sectionId)?.classList.add("active");

      // 确保父级导航组保持展开
      const parentGroup = item.closest(".nav-group");
      if (parentGroup && !parentGroup.classList.contains("expanded")) {
        parentGroup.classList.add("expanded");
      }
    });
  });

  // 默认展开包含活动项的导航组
  const activeItem = document.querySelector(".nav-item.active");
  if (activeItem) {
    const parentGroup = activeItem.closest(".nav-group");
    if (parentGroup) {
      parentGroup.classList.add("expanded");
    }
  }

  // 导航组展开/折叠
  const navGroups = document.querySelectorAll(".nav-group");
  navGroups.forEach((group) => {
    const title = group.querySelector(".nav-title");
    title.addEventListener("click", () => {
      // 先关闭其他展开的组
      navGroups.forEach((g) => {
        if (g !== group && g.classList.contains("expanded")) {
          g.classList.remove("expanded");
        }
      });
      // 切换当前组的展开状态
      group.classList.toggle("expanded");
    });
  });

  // 移动端菜单控制
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  const sidebar = document.querySelector(".account-sidebar");
  const overlay = document.querySelector(".sidebar-overlay");

  if (mobileMenuBtn && sidebar && overlay) {
    mobileMenuBtn.addEventListener("click", () => {
      sidebar.classList.add("active");
      overlay.classList.add("active");
      document.body.style.overflow = "hidden";
    });

    overlay.addEventListener("click", () => {
      sidebar.classList.remove("active");
      overlay.classList.remove("active");
      document.body.style.overflow = "";
    });

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

  // 充值金额选择
  const amountItems = document.querySelectorAll(".amount-item");
  amountItems.forEach((item) => {
    item.addEventListener("click", () => {
      if (!item.classList.contains("custom")) {
        amountItems.forEach((i) => i.classList.remove("active"));
        item.classList.add("active");
      }
    });
  });

  // 支付方式选择
  const methodItems = document.querySelectorAll(".method-item");
  methodItems.forEach((item) => {
    item.addEventListener("click", () => {
      methodItems.forEach((i) => i.classList.remove("active"));
      item.classList.add("active");
    });
  });

  // 消息标签页切换
  const messageTabs = document.querySelectorAll(".message-tabs .tab-btn");
  messageTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      messageTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
    });
  });
});
