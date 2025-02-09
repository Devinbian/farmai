document.addEventListener("DOMContentLoaded", async function () {
  // 初始化GSAP ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);

  // 声明全局变量
  let waterfallInstance = null;
  let colcade = null;

  // 导航栏滚动效果
  const navbar = document.querySelector(".nav-bar");
  let lastScrollTop = 0;

  // 获取URL参数
  const urlParams = new URLSearchParams(window.location.search);
  const mainCategoryFromUrl = urlParams.get("category");
  const subCategoryFromUrl = urlParams.get("subcategory");

  window.addEventListener("scroll", function () {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }

    lastScrollTop = scrollTop;
  });

  const casesGrid = document.querySelector(".cases-grid");
  const filterContainer = document.querySelector(".cases-filter");
  const subFilterContainer = document.createElement("div");
  subFilterContainer.className = "cases-subfilter";
  filterContainer.after(subFilterContainer);

  const loadingSpinner = document.querySelector(".loading-spinner");
  let currentMainCategory = "all";
  let currentSubCategory = "全部";
  let currentResourceType = 'image';
  let categoryData = {};

  // 初始化Layout
  function initLayout() {
    // 监听图片加载
    imagesLoaded(casesGrid, function() {
        // 所有图片加载完成后的处理
        const items = casesGrid.querySelectorAll('.case-item');
        gsap.to(items, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: {
                each: 0.1,
                from: "start"
            },
            ease: "power2.out"
        });
    });
  }

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

  // 创建案例项
  function createCaseItem(fileUrl, category, fileType, metadata) {
    console.log('Creating item:', { fileUrl, category, fileType });
    const caseItem = document.createElement('div');
    caseItem.className = 'case-item';
    caseItem.setAttribute('data-category', category);

    const mediaWrapper = document.createElement('div');
    mediaWrapper.className = 'media-wrapper';

    const fullUrl = `images/cases/${category}/${fileUrl}`;
    console.log('Full URL:', fullUrl);

    if (fileType === 'video') {
        const videoContainer = document.createElement('div');
        videoContainer.className = 'video-wrapper';
        videoContainer.style.cssText = `
            width: 100%;
            padding-top: 56.25%;
            position: relative;
            border-radius: 16px;
            overflow: hidden;
            background: #f0f0f0;
        `;

        // 创建缩略图
        const thumbnail = document.createElement('img');
        thumbnail.className = 'video-thumbnail';
        thumbnail.alt = metadata.title || '视频缩略图';
        thumbnail.src = 'images/cases/video-thumbnail.jpg';
        thumbnail.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
        `;

        // 创建视频元素
        const video = document.createElement('video');
        video.controls = true;
        video.preload = 'metadata';
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
        video.setAttribute('playsinline', '');
        video.setAttribute('webkit-playsinline', '');
        video.src = encodeURI(fullUrl);

        // 创建播放按钮
        const playButton = document.createElement('div');
        playButton.className = 'play-button';
        playButton.innerHTML = '<i class="material-icons">play_circle_outline</i>';

        // 视频播放状态管理
        let isPlaying = false;

        const showVideo = () => {
            video.style.display = 'block';
            thumbnail.style.display = 'none';
            playButton.style.display = 'none';
        };

        const hideVideo = () => {
            video.style.display = 'none';
            thumbnail.style.display = 'block';
            playButton.style.display = 'flex';
            isPlaying = false;
        };

        const startPlayback = async () => {
            if (isPlaying) return;
            
            try {
                showVideo();
                await video.play();
                isPlaying = true;
            } catch (error) {
                console.error('Failed to play video:', error);
                hideVideo();
            }
        };

        // 事件监听
        const handlePlayClick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            startPlayback();
        };

        playButton.addEventListener('click', handlePlayClick);
        thumbnail.addEventListener('click', handlePlayClick);

        // 视频事件处理
        video.addEventListener('ended', hideVideo);
        video.addEventListener('pause', () => {
            isPlaying = false;
        });

        video.addEventListener('play', () => {
            isPlaying = true;
        });

        video.addEventListener('error', (e) => {
            console.error('Video error:', e);
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
        const imageContainer = document.createElement('div');
        imageContainer.className = 'image-wrapper';

        const img = document.createElement('img');
        img.src = fullUrl;
        img.alt = metadata.title || '案例图片';
        img.loading = 'lazy';

        // 图片加载完成后刷新布局
        img.onload = function() {
            if (waterfallInstance) {
                waterfallInstance.refresh();
            }
        };

        imageContainer.appendChild(img);
        mediaWrapper.appendChild(imageContainer);
    }

    // 添加摘要信息
    if (metadata.title || metadata.description || (metadata.categories && metadata.categories.length)) {
        const infoOverlay = document.createElement('div');
        infoOverlay.className = 'media-info';
        
        if (metadata.title) {
            const title = document.createElement('h3');
            title.textContent = metadata.title;
            infoOverlay.appendChild(title);
        }

        if (metadata.categories && metadata.categories.length) {
            const tagsContainer = document.createElement('div');
            tagsContainer.className = 'category-tags';
            metadata.categories.forEach(cat => {
                if (cat) {  // 确保分类值存在
                    const tag = document.createElement('span');
                    tag.className = 'category-tag';
                    tag.textContent = cat;
                    tagsContainer.appendChild(tag);
                }
            });
            if (tagsContainer.children.length > 0) {
                infoOverlay.appendChild(tagsContainer);
            }
        }

        if (metadata.description) {
            const desc = document.createElement('p');
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
  const resourceTypeFilter = document.querySelector('.resource-type-filter');
  resourceTypeFilter.addEventListener('click', (e) => {
    const typeBtn = e.target.closest('.type-btn');
    if (!typeBtn) return;

    const type = typeBtn.dataset.type;
    if (type === currentResourceType) return;

    // 更新按钮状态
    document.querySelectorAll('.type-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    typeBtn.classList.add('active');

    currentResourceType = type;
    
    // 重新加载当前分类的资源
    loadImages(currentMainCategory, currentSubCategory);
  });

  // 修改 loadImages 函数
  function loadImages(mainCategory = "all", subCategory = "全部") {
    const wrapper = casesGrid.querySelector('.grid-sizer-wrapper') || casesGrid;
    wrapper.innerHTML = "";
    loadingSpinner.style.display = "flex";
    currentIndex = 0;

    // 重新初始化 Colcade
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
                        }))
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
                    .filter((file) => file.subCategory === subCategory)
                    .map((file) => ({
                        ...file,
                        mainCategory: mainCategory,
                    }));
            }
        }

        // 根据资源类型过滤
        images = images.filter(image => {
            const isVideo = image.filename.match(/\.(mp4|webm|mov)$/i);
            return currentResourceType === 'video' ? isVideo : !isVideo;
        });

        const batchSize = 8;
        let currentIndex = 0;

        function loadNextBatch() {
            const endIndex = Math.min(currentIndex + batchSize, images.length);
            
            for (let i = currentIndex; i < endIndex; i++) {
                const image = images[i];
                const fileType = image.filename.match(/\.(mp4|webm|mov)$/i) ? 'video' : 'image';
                const metadata = {
                    title: image.title,
                    description: image.description,
                    categories: image.categories || [image.subCategory].filter(Boolean)
                };
                const item = createCaseItem(image.filename, image.mainCategory, fileType, metadata);
                colcade?.append(item);
            }

            currentIndex = endIndex;

            if (currentIndex < images.length) {
                setTimeout(loadNextBatch, 300);
            } else {
                loadingSpinner.style.display = 'none';
            }
        }

        loadNextBatch();
    } catch (error) {
        console.error('Error in loadImages:', error);
        loadingSpinner.style.display = 'none';
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
    const items = casesGrid.querySelectorAll('.case-item');
    const itemWidth = getItemWidth();

    items.forEach(item => {
        item.style.width = itemWidth;
        
        // 设置视频容器尺寸
        const videoWrapper = item.querySelector('.video-wrapper');
        if (videoWrapper) {
            videoWrapper.style.cssText = `
                width: 100% !important;
                padding-top: 56.25% !important;
                position: relative !important;
            `;

            const video = videoWrapper.querySelector('video');
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

        // 设置图片尺寸
        const img = item.querySelector('img:not(.video-thumbnail)');
        if (img) {
            img.style.width = '100%';
            img.style.height = 'auto';
            img.style.maxHeight = '70vh';
        }
    });
  }

  // 修改 setupInfiniteScroll 函数
  function setupInfiniteScroll() {
    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // 一旦元素可见就停止观察
                observer.unobserve(entry.target);
            }
        });
    }, options);

    function observeNewItems() {
        const items = casesGrid.querySelectorAll('.case-item:not(.visible)');
        items.forEach(item => {
            // 添加初始类
            item.classList.add('will-animate');
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

    // 添加点击事件监听
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
        
        // 清空并重新加载图片
        casesGrid.innerHTML = '';
        loadImages(category, "全部");
    });
  }

  // 初始化
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
  if (typeFromUrl && ['image', 'video'].includes(typeFromUrl)) {
    currentResourceType = typeFromUrl;
    document.querySelectorAll('.type-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.type === typeFromUrl);
    });
  }

  // 优化图片加载
  document.addEventListener('DOMContentLoaded', function() {
    // 预加载缩略图
    const thumbnailImg = new Image();
    thumbnailImg.src = 'images/cases/video-thumbnail.jpg';
  });

  // 修改 initColcade 函数
  function initColcade() {
    // 保存当前的项目
    const currentItems = Array.from(casesGrid.querySelectorAll('.case-item'));
    
    if (colcade) {
        colcade.destroy();
    }
    
    // 先清空网格
    casesGrid.innerHTML = '';
    
    // 创建列容器包装器
    const wrapper = document.createElement('div');
    wrapper.className = 'grid-sizer-wrapper';
    casesGrid.appendChild(wrapper);
    
    // 创建列容器
    const columns = window.innerWidth >= 1200 ? 4 : 
                   window.innerWidth >= 768 ? 3 : 
                   window.innerWidth >= 480 ? 2 : 1;
    
    // 添加列元素
    for (let i = 0; i < columns; i++) {
        const col = document.createElement('div');
        col.className = 'grid-col';
        col.style.cssText = '';
        wrapper.appendChild(col);
    }

    // 初始化 Colcade
    colcade = new Colcade(wrapper, {
        columns: '.grid-col',
        items: '.case-item'
    });

    // 重新添加之前的项目，确保不添加内联样式
    if (currentItems.length > 0) {
        currentItems.forEach(item => {
            item.style.cssText = '';
            colcade.append(item);
        });
    }
  }

  // 优化窗口大小改变事件监听
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        const oldColumns = casesGrid.querySelectorAll('.grid-col').length;
        const newColumns = window.innerWidth >= 1200 ? 4 : 
                          window.innerWidth >= 768 ? 3 : 
                          window.innerWidth >= 480 ? 2 : 1;
        
        // 只有当列数发生变化时才重新初始化
        if (oldColumns !== newColumns) {
            initColcade();
        }
    }, 250);
  });
});
