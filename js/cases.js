// 确保在导入其他模块前注册
gsap.registerPlugin(ScrollTrigger);

// 声明全局变量
let waterfallInstance = null;
let colcade = null;
let currentIndex = 0;
let currentMainCategory = "all";
let currentSubCategory = "全部";
let currentResourceType = "image";
let categoryData = {};

// 获取 DOM 元素的引用
const casesGrid = document.querySelector(".cases-grid");
const filterContainer = document.querySelector(".cases-filter");
const subFilterContainer = document.createElement("div");
subFilterContainer.className = "cases-subfilter";
const loadingSpinner = document.querySelector(".loading-spinner");

// 动态导入模块并初始化
async function initializeCases() {
  const baseUrl = window.siteConfig?.BASE_URL || "";

  try {
    // 获取URL参数
    const urlParams = new URLSearchParams(window.location.search);
    const mainCategoryFromUrl = urlParams.get("category");
    const subCategoryFromUrl = urlParams.get("subcategory");

    // 导航栏滚动效果
    const navbar = document.querySelector(".nav-bar");
    let lastScrollTop = 0;

    // 设置二级分类容器
    filterContainer.after(subFilterContainer);

    // 加载分类数据
    const categories = await loadCategoryData();
    initializeMainFilters(categories);

    // 根据URL参数设置初始状态
    if (mainCategoryFromUrl && categories.includes(mainCategoryFromUrl)) {
      currentMainCategory = mainCategoryFromUrl;
      // 激活对应的主分类按钮
      document.querySelectorAll(".cases-filter .filter-btn").forEach((btn) => {
        if (btn.dataset.category === mainCategoryFromUrl) {
          btn.classList.add("active");
        } else {
          btn.classList.remove("active");
        }
      });

      // 初始化并设置二级分类
      initializeSubFilters(mainCategoryFromUrl);
      if (subCategoryFromUrl) {
        currentSubCategory = subCategoryFromUrl;
        // 激活对应的二级分类按钮
        document
          .querySelectorAll(".cases-subfilter .filter-btn")
          .forEach((btn) => {
            if (btn.dataset.category === subCategoryFromUrl) {
              btn.classList.add("active");
            } else {
              btn.classList.remove("active");
            }
          });
      }

      loadImages(mainCategoryFromUrl, currentSubCategory);
    } else {
      loadImages("all", "全部");
    }

    // 根据 URL 参数设置初始资源类型
    const typeFromUrl = urlParams.get("type");
    if (typeFromUrl && ["image", "video"].includes(typeFromUrl)) {
      currentResourceType = typeFromUrl;
      document.querySelectorAll(".type-btn").forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.type === typeFromUrl);
      });
    }
  } catch (error) {
    console.error("初始化失败:", error);
  }
}

// 当DOM加载完成后初始化
document.addEventListener("DOMContentLoaded", () => {
  if (casesGrid && filterContainer && loadingSpinner) {
    initializeCases();
  } else {
    console.error("必要的 DOM 元素未找到");
  }
});

// 从JSON文件加载分类数据
async function loadCategoryData() {
  try {
    const response = await fetch("js/cases-data.json");
    categoryData = await response.json();
    return Object.keys(categoryData);
  } catch (error) {
    console.error("Error loading category data:", error);
    return [];
  }
}

// 添加懒加载和图片优化相关的函数
function optimizeImageLoading() {
  // 使用 Intersection Observer 实现懒加载
  const imageObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute("data-src");
            observer.unobserve(img);
          }
        }
      });
    },
    {
      rootMargin: "50px 0px", // 提前50px开始加载
      threshold: 0.01,
    },
  );

  return imageObserver;
}

// 修改 createCaseItem 函数中的图片处理部分
function createCaseItem(fileUrl, category, fileType, metadata) {
  // console.log('Creating item:', { fileUrl, category, fileType });
  const caseItem = document.createElement("div");
  caseItem.className = "case-item";
  caseItem.setAttribute("data-category", category);

  const mediaWrapper = document.createElement("div");
  mediaWrapper.className = "media-wrapper";

  const fullUrl = `images/cases/${category}/${fileUrl}`;
  // console.log('Full URL:', fullUrl);

  if (fileType === "video") {
    const videoContainer = document.createElement("div");
    videoContainer.className = "video-wrapper";
    videoContainer.style.cssText = `
            width: 100%;
            padding-top: 56.25%;
            position: relative;
            border-radius: 16px;
            overflow: hidden;
            background: #f5f5f5;
        `;

    // 修改默认缩略图路径
    const thumbnail = document.createElement("img");
    thumbnail.className = "video-thumbnail";
    thumbnail.src = "images/cases/video-thumbnail.jpg"; // 修改为正确的路径
    thumbnail.alt = metadata.title || "视频缩略图";
    thumbnail.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover; // 修改为 cover 以填充整个容器
            background-color: #f5f5f5;
        `;

    // 创建视频元素
    const video = document.createElement("video");
    video.controls = true;
    video.preload = "metadata";
    video.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: none;
            object-fit: contain;
        `;
    video.playsInline = true;
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
    video.src = encodeURI(fullUrl);

    // 创建播放按钮
    const playButton = document.createElement("div");
    playButton.className = "play-button";
    playButton.innerHTML = '<i class="material-icons">play_circle_outline</i>';

    // 视频播放状态管理
    let isPlaying = false;

    const showVideo = () => {
      video.style.display = "block";
      thumbnail.style.display = "none";
      playButton.style.display = "none";
    };

    const hideVideo = () => {
      video.style.display = "none";
      thumbnail.style.display = "block";
      playButton.style.display = "flex";
      isPlaying = false;
    };

    const startPlayback = async () => {
      if (isPlaying) return;

      try {
        showVideo();
        await video.play();
        isPlaying = true;
      } catch (error) {
        console.error("Failed to play video:", error);
        hideVideo();
      }
    };

    // 事件监听
    const handlePlayClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      startPlayback();
    };

    playButton.addEventListener("click", handlePlayClick);

    // 视频事件处理
    video.addEventListener("ended", hideVideo);
    video.addEventListener("pause", () => {
      isPlaying = false;
    });

    video.addEventListener("play", () => {
      isPlaying = true;
    });

    video.addEventListener("error", (e) => {
      console.error("Video error:", e);
      videoContainer.innerHTML = `
                <div class="video-error">
                    <i class="material-icons">error_outline</i>
                    <p>视频加载失败</p>
                </div>
            `;
    });

    videoContainer.appendChild(thumbnail);
    videoContainer.appendChild(playButton);
    videoContainer.appendChild(video);
    mediaWrapper.appendChild(videoContainer);
  } else {
    const imageContainer = document.createElement("div");
    imageContainer.className = "image-wrapper";

    // 创建图片容器
    const imgWrapper = document.createElement("div");
    imgWrapper.className = "img-wrapper";
    imgWrapper.style.backgroundColor = "#f5f5f5";

    // 创建主图片
    const img = document.createElement("img");
    img.dataset.src = fullUrl;
    img.alt = metadata.title || "案例图片";
    img.className = "lazy-image main-image";

    // 预加载图片以获取实际尺寸
    const tempImg = new Image();
    tempImg.onload = function () {
      // 根据实际图片比例设置容器高度
      const ratio = tempImg.height / tempImg.width;
      imgWrapper.style.paddingBottom = `${ratio * 100}%`;
    };
    tempImg.src = fullUrl;

    // 添加加载状态指示器
    const loadingIndicator = document.createElement("div");
    loadingIndicator.className = "loading-indicator";

    // 图片加载完成后的处理
    img.onload = function () {
      loadingIndicator.style.display = "none";
      img.style.opacity = "1";
      if (waterfallInstance) {
        waterfallInstance.refresh();
      }
    };

    imgWrapper.appendChild(img);
    imgWrapper.appendChild(loadingIndicator);
    imageContainer.appendChild(imgWrapper);
    mediaWrapper.appendChild(imageContainer);

    // 将图片添加到观察列表
    if (window.imageObserver) {
      window.imageObserver.observe(img);
    }
  }

  // 添加摘要信息
  if (
    metadata.title ||
    metadata.description ||
    (metadata.categories && metadata.categories.length)
  ) {
    const infoOverlay = document.createElement("div");
    infoOverlay.className = "media-info";

    if (metadata.title) {
      const title = document.createElement("h3");
      title.textContent = metadata.title;
      infoOverlay.appendChild(title);
    }

    if (metadata.categories && metadata.categories.length) {
      const tagsContainer = document.createElement("div");
      tagsContainer.className = "category-tags";
      metadata.categories.forEach((cat) => {
        if (cat) {
          // 确保分类值存在
          const tag = document.createElement("span");
          tag.className = "category-tag";
          tag.textContent = cat;
          tagsContainer.appendChild(tag);
        }
      });
      if (tagsContainer.children.length > 0) {
        infoOverlay.appendChild(tagsContainer);
      }
    }

    if (metadata.description) {
      const desc = document.createElement("p");
      desc.textContent = metadata.description;
      infoOverlay.appendChild(desc);
    }

    mediaWrapper.appendChild(infoOverlay);
  }

  // 确保 mediaWrapper 被添加到 caseItem
  caseItem.appendChild(mediaWrapper);
  return caseItem;
}

// 添加资源类型切换处理
const resourceTypeFilter = document.querySelector(".resource-type-filter");
resourceTypeFilter.addEventListener("click", (e) => {
  const typeBtn = e.target.closest(".type-btn");
  if (!typeBtn) return;

  const type = typeBtn.dataset.type;
  if (type === currentResourceType) return;

  // 更新按钮状态
  document.querySelectorAll(".type-btn").forEach((btn) => {
    btn.classList.remove("active");
  });
  typeBtn.classList.add("active");

  currentResourceType = type;

  // 重新加载当前分类的资源
  loadImages(currentMainCategory, currentSubCategory);
});

// 修改 loadImages 函数
function loadImages(mainCategory = "all", subCategory = "全部") {
  // 清空网格
  casesGrid.innerHTML = "";
  loadingSpinner.style.display = "flex";
  currentIndex = 0;

  // 初始化或重新初始化 Colcade
  initColcade();

  let images = [];
  try {
    if (mainCategory === "all") {
      Object.entries(categoryData).forEach(([category, data]) => {
        if (data.files) {
          images = images.concat(
            data.files.map((file) => ({
              ...file,
              mainCategory: category,
            })),
          );
        }
      });
    } else if (categoryData[mainCategory]?.files) {
      const categoryFiles = categoryData[mainCategory].files;
      if (subCategory === "全部") {
        images = categoryFiles.map((file) => ({
          ...file,
          mainCategory: mainCategory,
        }));
      } else {
        images = categoryFiles
          .filter((file) =>
            file.subCategories.some((cat) => cat.name === subCategory),
          )
          .map((file) => ({
            ...file,
            mainCategory: mainCategory,
          }));
      }
    }

    // 根据资源类型过滤
    images = images.filter((image) => {
      const isVideo = image.filename.match(/\.(mp4|webm|mov)$/i);
      return currentResourceType === "video" ? isVideo : !isVideo;
    });

    const batchSize = 8;
    let currentIndex = 0;

    // 初始化图片懒加载观察器
    if (!window.imageObserver) {
      window.imageObserver = optimizeImageLoading();
    }

    // 使用 requestAnimationFrame 优化批量加载
    function loadNextBatch() {
      const endIndex = Math.min(currentIndex + batchSize, images.length);

      requestAnimationFrame(() => {
        for (let i = currentIndex; i < endIndex; i++) {
          const image = images[i];
          const fileType = image.filename.match(/\.(mp4|webm|mov)$/i)
            ? "video"
            : "image";
          const metadata = {
            title: image.title,
            description: image.description,
            categories: image.subCategories.reduce((tags, category) => {
              if (category.tags && category.tags.length > 0) {
                return [...tags, ...category.tags];
              }
              return [...tags, category.name];
            }, []),
          };
          const item = createCaseItem(
            image.filename,
            image.mainCategory,
            fileType,
            metadata,
          );
          colcade.append(item);
        }

        currentIndex = endIndex;

        if (currentIndex < images.length) {
          setTimeout(() => requestAnimationFrame(loadNextBatch), 300);
        } else {
          loadingSpinner.style.display = "none";
        }
      });
    }

    loadNextBatch();
  } catch (error) {
    console.error("Error in loadImages:", error);
    loadingSpinner.style.display = "none";
  }
}

// 修改 getItemWidth 函数，使用屏幕宽度而不是容器宽度
function getItemWidth() {
  const screenWidth = window.innerWidth;
  const padding = 40; // 考虑左右内边距
  const maxWidth = 1600; // 最大宽度限制
  const gutter = 20; // 项目间距

  // 计算实际可用宽度
  let availableWidth = Math.min(screenWidth - padding, maxWidth);

  // 根据屏幕宽度决定列数和宽度
  if (screenWidth <= 480) {
    return `${availableWidth}px`; // 单列
  } else if (screenWidth <= 768) {
    return `${(availableWidth - gutter) / 2}px`; // 两列
  } else if (screenWidth <= 1200) {
    return `${(availableWidth - gutter * 2) / 3}px`; // 三列
  }
  return `${(availableWidth - gutter * 3) / 4}px`; // 四列
}

// 添加函数来设置正确的尺寸
function setCorrectSizes() {
  const items = casesGrid.querySelectorAll(".case-item");
  const itemWidth = getItemWidth();

  items.forEach((item) => {
    item.style.width = itemWidth;

    // 设置视频容器尺寸
    const videoWrapper = item.querySelector(".video-wrapper");
    if (videoWrapper) {
      videoWrapper.style.cssText = `
                width: 100% !important;
                padding-top: 56.25% !important;
                position: relative !important;
            `;

      const video = videoWrapper.querySelector("video");
      if (video) {
        video.style.cssText = `
                    position: absolute !important;
                    top: 0 !important;
                    left: 0 !important;
                    width: 100% !important;
                    height: 100% !important;
                    object-fit: contain !important;
                `;
      }
    }
  });
}

// 修改 setupInfiniteScroll 函数
function setupInfiniteScroll() {
  const options = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        // 一旦元素可见就停止观察
        observer.unobserve(entry.target);
      }
    });
  }, options);

  function observeNewItems() {
    const items = casesGrid.querySelectorAll(".case-item:not(.visible)");
    items.forEach((item) => {
      // 添加初始类
      item.classList.add("will-animate");
      observer.observe(item);
    });
  }

  return observeNewItems;
}

// 在 DOMContentLoaded 事件处理程序中初始化
const observeNewItems = setupInfiniteScroll();

// 修改二级分类的事件监听，移除重复的事件监听
function initializeSubFilters(mainCategory) {
  subFilterContainer.innerHTML = "";

  if (mainCategory === "all") {
    subFilterContainer.style.display = "none";
    return;
  }

  subFilterContainer.style.display = "flex";
  const categoryConfig = categoryData[mainCategory]?.config;
  if (!categoryConfig) return;

  // 添加"全部"按钮
  const allButton = document.createElement("button");
  allButton.className = "filter-btn active";
  allButton.textContent = categoryConfig.default_category;
  allButton.dataset.category = categoryConfig.default_category;
  subFilterContainer.appendChild(allButton);

  // 添加其他分类按钮
  Object.keys(categoryConfig.categories).forEach((category) => {
    const button = document.createElement("button");
    button.className = "filter-btn";
    button.textContent = category;
    button.dataset.category = category;
    subFilterContainer.appendChild(button);
  });
}

// 添加一次性的事件监听
subFilterContainer.addEventListener("click", (e) => {
  const button = e.target.closest(".filter-btn");
  if (!button) return;

  // 更新按钮状态
  subFilterContainer.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.classList.remove("active");
  });
  button.classList.add("active");

  // 更新当前分类并重新加载图片
  currentSubCategory = button.dataset.category;
  loadImages(currentMainCategory, currentSubCategory);
});

// 修改一级分类的事件监听
function initializeMainFilters(categories) {
  filterContainer.innerHTML = "";

  // 添加"全部"按钮
  const allButton = document.createElement("button");
  allButton.className = "filter-btn active";
  allButton.textContent = "全部";
  allButton.dataset.category = "all";
  filterContainer.appendChild(allButton);

  // 添加分类按钮
  categories.forEach((category) => {
    const button = document.createElement("button");
    button.className = "filter-btn";
    button.textContent = category;
    button.dataset.category = category;
    filterContainer.appendChild(button);
  });

  // 修改点击事件处理
  filterContainer.addEventListener("click", (e) => {
    const button = e.target.closest(".filter-btn");
    if (!button) return;

    // 更新按钮状态
    filterContainer.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.classList.remove("active");
    });
    button.classList.add("active");

    // 更新当前分类
    const category = button.dataset.category;
    currentMainCategory = category;

    // 初始化二级分类
    initializeSubFilters(category);
    currentSubCategory = "全部";

    // 加载图片（不重新初始化 Colcade）
    loadImages(category, "全部");
  });
}

// 修改 initColcade 函数
function initColcade() {
  // 销毁现有的 colcade 实例
  if (colcade) {
    colcade.destroy();
  }

  // 清空网格
  casesGrid.innerHTML = "";

  // 创建新的列容器包装器
  const wrapper = document.createElement("div");
  wrapper.className = "grid-sizer-wrapper";
  casesGrid.appendChild(wrapper);

  // 根据屏幕宽度确定列数
  const columns =
    window.innerWidth >= 1200
      ? 4
      : window.innerWidth >= 768
      ? 3
      : window.innerWidth >= 480
      ? 2
      : 1;

  // 添加列元素
  for (let i = 0; i < columns; i++) {
    const col = document.createElement("div");
    col.className = "grid-col";
    col.style.width = `${100 / columns}%`;
    col.style.paddingLeft = i === 0 ? "0" : "20px";
    wrapper.appendChild(col);
  }

  // 初始化新的 Colcade 实例
  colcade = new Colcade(wrapper, {
    columns: ".grid-col",
    items: ".case-item",
  });
}

// 修改窗口大小监听函数
let resizeTimeout;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    // 只在移动设备上或窗口宽度大于最小宽度时处理
    if (
      window.innerWidth >= 1200 ||
      /Mobi|Android/i.test(navigator.userAgent)
    ) {
      const oldColumns = casesGrid.querySelectorAll(".grid-col").length;
      const newColumns =
        window.innerWidth >= 1200
          ? 4
          : window.innerWidth >= 768
          ? 3
          : window.innerWidth >= 480
          ? 2
          : 1;

      if (oldColumns !== newColumns) {
        initColcade();
      }
    }
  }, 250);
});

// 更新 CSS 样式
const style = document.createElement("style");
style.textContent = `
  /* 添加最小宽度限制 */
  body {
    min-width: 1200px; /* PC端最小宽度 */
  }

  .grid-sizer-wrapper {
    display: flex;
    width: 100%;
    margin: 0 auto;
    gap: 20px;
    min-width: 1200px; /* 确保网格也有最小宽度 */
  }

  .grid-col {
    flex: 1;
  }

  .case-item {
    width: 100%;
    margin-bottom: 20px;
    break-inside: avoid;
  }

  .img-wrapper {
    position: relative;
    width: 100%;
    height: 0;
    overflow: hidden;
    background-color: #f5f5f5;
    border-radius: 12px;
  }

  .img-wrapper img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .main-image {
    opacity: 0;
    transition: opacity 0.3s ease-in;
    z-index: 2;
  }

  .loading-indicator {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 30px;
    height: 30px;
    z-index: 3;
    border: 2px solid rgba(0,0,0,0.1);
    border-top: 2px solid #3498db;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: translate(-50%, -50%) rotate(0deg); }
    100% { transform: translate(-50%, -50%) rotate(360deg); }
  }

  .image-wrapper {
    position: relative;
    width: 100%;
    transition: transform 0.3s ease;
  }

  .image-wrapper:hover {
    transform: translateY(-4px);
  }

  /* 修改媒体查询，只在真正的移动设备上应用 */
  @media screen and (max-width: 1200px) and (max-device-width: 1200px) {
    body {
      min-width: auto; /* 移动设备取消最小宽度限制 */
    }
    
    .grid-sizer-wrapper {
      min-width: auto;
    }

    .grid-col {
      width: calc(33.333% - 14px);
    }
  }

  @media screen and (max-width: 768px) and (max-device-width: 768px) {
    .grid-col {
      width: calc(50% - 10px);
    }
  }

  @media screen and (max-width: 480px) and (max-device-width: 480px) {
    .grid-col {
      width: 100%;
    }
    .grid-sizer-wrapper {
      gap: 10px;
    }
  }

  .video-thumbnail {
    opacity: 1;
    transition: opacity 0.3s ease-out;
    z-index: 1;
  }

  .play-button {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.6);
    transition: background 0.3s ease;
  }

  .play-button:hover {
    background: rgba(0, 0, 0, 0.8);
  }

  .play-button i {
    color: white;
    font-size: 40px;
  }

  .video-wrapper {
    position: relative;
    background-color: #f5f5f5;
  }
`;

document.head.appendChild(style);
