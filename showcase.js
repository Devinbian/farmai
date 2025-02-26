// 修改渲染书架函数
function renderBookshelf(pageIndex = 0) {
  const shelfLayers = document.querySelectorAll(".shelf-layer");
  const booksPerPage = 21; // 3行 × 7列
  const totalPages = Math.ceil(booksData.course.length / booksPerPage);

  if (shelfLayers[0]) {
    const layer = shelfLayers[0];

    // 计算当前页的书本
    const startIndex = pageIndex * booksPerPage;
    const endIndex = Math.min(
      startIndex + booksPerPage,
      booksData.course.length,
    );
    const pageBooks = booksData.course.slice(startIndex, endIndex);

    // 生成当前页HTML
    layer.innerHTML = pageBooks.map((book) => generateBookHTML(book)).join("");

    // 更新导航按钮状态和显示
    const prevBtn = document.querySelector(".shelf-nav.prev");
    const nextBtn = document.querySelector(".shelf-nav.next");

    if (prevBtn && nextBtn) {
      // 始终显示按钮，使用透明度控制可见性
      prevBtn.style.display = "flex";
      nextBtn.style.display = "flex";

      prevBtn.style.opacity = pageIndex > 0 ? "1" : "0";
      nextBtn.style.opacity = pageIndex < totalPages - 1 ? "1" : "0";

      // 更新禁用状态
      prevBtn.disabled = pageIndex === 0;
      nextBtn.disabled = pageIndex === totalPages - 1;
    }
  }
}

// 修改导航初始化函数
function initializeShelfNavigation() {
  const shelf = document.querySelector(".shelf");
  if (!shelf) return;

  // 创建导航按钮
  const prevBtn = document.createElement("button");
  const nextBtn = document.createElement("button");

  prevBtn.className = "shelf-nav prev";
  nextBtn.className = "shelf-nav next";

  prevBtn.innerHTML = '<span class="material-icons">chevron_left</span>';
  nextBtn.innerHTML = '<span class="material-icons">chevron_right</span>';

  shelf.appendChild(prevBtn);
  shelf.appendChild(nextBtn);

  let currentPage = 0;
  const totalPages = Math.ceil(booksData.course.length / 21);

  // 添加点击事件
  prevBtn.addEventListener("click", () => {
    if (currentPage > 0) {
      currentPage--;
      renderBookshelf(currentPage);
    }
  });

  nextBtn.addEventListener("click", () => {
    if (currentPage < totalPages - 1) {
      currentPage++;
      renderBookshelf(currentPage);
    }
  });

  // 初始渲染
  renderBookshelf(currentPage);
}
