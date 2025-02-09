import { config } from '../../js/config.js';

export function createHeader() {
  return `
    <nav class="nav-bar">
        <div class="nav-container">
            <div class="nav-left">
                <a href="${config.BASE_URL}/index.html">
                    <img src="${config.BASE_URL}/images/vegelogo.svg" alt="vegesense" class="logo">
                </a>
                <span class="nav-separator">|</span>
                <span class="nav-title">教育 Education</span>
            </div>
            <div class="nav-right">
                <button class="login-btn">登录</button>
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
  let lastScrollTop = 0;

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
}
