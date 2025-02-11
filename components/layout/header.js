export function createHeader() {
  // 使用全局变量
  const baseUrl = window.siteConfig?.BASE_URL || "";
  const isLoggedIn = true; // 这里应该从实际的登录状态获取

  const userMenu = isLoggedIn
    ? `
    <div class="user-menu">
      <div class="avatar-wrapper">
        <img src="${baseUrl}/images/avatar.jpeg" alt="用户头像" class="user-avatar">
      </div>
      <div class="dropdown-menu">
        <a href="${baseUrl}/profile.html" class="menu-item">
          <span class="material-icons">person</span>
          个人中心
        </a>
        <a href="${baseUrl}/account.html" class="menu-item">
          <span class="material-icons">settings</span>
          账号设置
        </a>
        <button class="menu-item logout-btn">
          <span class="material-icons">logout</span>
          退出登录
        </button>
      </div>
    </div>
  `
    : `
    <a href="${baseUrl}/profile.html">
      <button class="login-btn">登录</button>
    </a>
  `;

  return `
    <nav class="nav-bar">
      <div class="nav-container">
        <div class="nav-left">
          <a href="${baseUrl}/index.html">
            <img src="${baseUrl}/images/vegelogo.svg" alt="vegesense" class="logo">
          </a>
          <span class="nav-separator">|</span>
          <span class="nav-title">教育 Education</span>
        </div>
        <div class="nav-right">
          ${userMenu}
        </div>
      </div>
    </nav>
  `;
}

// 更新页面标题
export function updateNavTitle(title) {
  const titleElement = document.querySelector(".nav-title");
  if (titleElement) {
    titleElement.textContent = title;
  }
}

// 初始化导航栏事件
export function initializeNavbar() {
  const navbar = document.querySelector(".nav-bar");
  const userMenu = document.querySelector(".user-menu");
  let lastScrollTop = 0;

  // 处理滚动效果
  function checkScroll() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
    lastScrollTop = scrollTop;
  }

  // 初始检查滚动位置
  checkScroll();

  // 监听滚动事件
  window.addEventListener("scroll", checkScroll);

  // 用户菜单点击事件
  if (userMenu) {
    const avatarWrapper = userMenu.querySelector(".avatar-wrapper");
    const dropdownMenu = userMenu.querySelector(".dropdown-menu");
    const logoutBtn = userMenu.querySelector(".logout-btn");

    // 切换下拉菜单
    avatarWrapper.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdownMenu.classList.toggle("active");
    });

    // 点击其他区域关闭下拉菜单
    document.addEventListener("click", () => {
      dropdownMenu.classList.remove("active");
    });

    // 退出登录
    logoutBtn?.addEventListener("click", () => {
      // 这里添加退出登录的逻辑
      console.log("退出登录");
    });
  }
}
