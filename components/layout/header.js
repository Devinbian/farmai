export function createHeader() {
  // 使用全局变量
  const baseUrl = window.siteConfig?.BASE_URL || "";
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const userRole = localStorage.getItem("userRole");

  // 根据用户角色确定个人中心链接
  let profileLink = `${baseUrl}/profile.html`;
  if (isLoggedIn && userRole) {
    switch (userRole) {
      case "admin":
        profileLink = `${baseUrl}/admin-dashboard.html`;
        break;
      case "teacher":
        profileLink = `${baseUrl}/teacher-dashboard.html`;
        break;
      case "student":
        profileLink = `${baseUrl}/student-dashboard.html`;
        break;
      default:
        profileLink = `${baseUrl}/profile.html`;
    }
  }

  const userMenu = isLoggedIn
    ? `
    <div class="user-menu">
      <div class="avatar-wrapper">
        <img src="${baseUrl}/images/avatar.jpeg" alt="用户头像" class="user-avatar">
      </div>
      <div class="dropdown-menu">
        <a href="${profileLink}" class="menu-item">
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
    <a href="${baseUrl}/login.html">
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
      // 清除登录状态
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("userRole");
      localStorage.removeItem("username");

      // 重定向到首页
      window.location.href = "index.html";
    });
  }
}
