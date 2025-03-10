export const config = {
  // 本地开发使用空字符串，GitHub Pages 使用 '/repository-name'
  // BASE_URL: "/farmai",
  BASE_URL: "",
};

// 设置 favicon
document.addEventListener("DOMContentLoaded", () => {
  const faviconLink = document.createElement("link");
  faviconLink.rel = "icon";
  faviconLink.type = "image/svg+xml";
  faviconLink.href = `${window.siteConfig.BASE_URL}/favicon.svg`;
  document.head.appendChild(faviconLink);
});
