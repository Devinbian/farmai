// 书本数据源
const booksData = {
  course: [
    {
      id: 1,
      title: "2024年春季课程安排",
      subtitle: "课程时间表与教学大纲",
      spine: "2024春季课程",
      cover: "images/cases/video-thumbnail.jpg",
      date: "2024-03-15",
      size: "2.5 MB",
      pdfUrl: "assets/pdf/spring2024.pdf",
    },
    {
      id: 2,
      title: "2025年夏季课程安排",
      subtitle: "暑期课程时间表",
      spine: "2024夏季课程",
      cover: "images/cases/video-thumbnail.jpg",
      date: "2024-03-20",
      size: "2.8 MB",
      pdfUrl: "assets/pdf/summer2024.pdf",
    },
    {
      id: 3,
      title: "2026年夏季课程安排",
      subtitle: "暑期课程时间表",
      spine: "2024夏季课程",
      cover: "images/cases/video-thumbnail.jpg",
      date: "2024-03-20",
      size: "2.8 MB",
      pdfUrl: "assets/pdf/summer2024.pdf",
    },
    {
      id: 4,
      title: "2027年夏季课程安排",
      subtitle: "暑期课程时间表",
      spine: "2024夏季课程",
      cover: "images/cases/video-thumbnail.jpg",
      date: "2024-03-20",
      size: "2.8 MB",
      pdfUrl: "assets/pdf/summer2024.pdf",
    },
    {
      id: 5,
      title: "2028年夏季课程安排",
      subtitle: "暑期课程时间表",
      spine: "2024夏季课程",
      cover: "images/cases/video-thumbnail.jpg",
      date: "2024-03-20",
      size: "2.8 MB",
      pdfUrl: "assets/pdf/summer2024.pdf",
    },
    {
      id: 6,
      title: "2029年夏季课程安排",
      subtitle: "暑期课程时间表",
      spine: "2024夏季课程",
      cover: "images/cases/video-thumbnail.jpg",
      date: "2024-03-20",
      size: "2.8 MB",
      pdfUrl: "assets/pdf/summer2024.pdf",
    },
    {
      id: 7,
      title: "2030年夏季课程安排",
      subtitle: "暑期课程时间表",
      spine: "2024夏季课程",
      cover: "images/cases/video-thumbnail.jpg",
      date: "2024-03-20",
      size: "2.8 MB",
      pdfUrl: "assets/pdf/summer2024.pdf",
    },
    {
      id: 8,
      title: "2024年夏季课程安排",
      subtitle: "暑期课程时间表",
      spine: "2024夏季课程",
      cover: "images/cases/video-thumbnail.jpg",
      date: "2024-03-20",
      size: "2.8 MB",
      pdfUrl: "assets/pdf/summer2024.pdf",
    },
    {
      id: 9,
      title: "2024年夏季课程安排",
      subtitle: "暑期课程时间表",
      spine: "2024夏季课程",
      cover: "images/cases/video-thumbnail.jpg",
      date: "2024-03-20",
      size: "2.8 MB",
      pdfUrl: "assets/pdf/summer2024.pdf",
    },
    {
      id: 10,
      title: "2024年夏季课程安排",
      subtitle: "暑期课程时间表",
      spine: "2024夏季课程",
      cover: "images/cases/video-thumbnail.jpg",
      date: "2024-03-20",
      size: "2.8 MB",
      pdfUrl: "assets/pdf/summer2024.pdf",
    },
    {
      id: 11,
      title: "2024年春季课程安排",
      subtitle: "课程时间表与教学大纲",
      spine: "2024春季课程",
      cover: "images/cases/video-thumbnail.jpg",
      date: "2024-03-15",
      size: "2.5 MB",
      pdfUrl: "assets/pdf/spring2024.pdf",
    },
    {
      id: 12,
      title: "2025年夏季课程安排",
      subtitle: "暑期课程时间表",
      spine: "2024夏季课程",
      cover: "images/cases/video-thumbnail.jpg",
      date: "2024-03-20",
      size: "2.8 MB",
      pdfUrl: "assets/pdf/summer2024.pdf",
    },
    {
      id: 13,
      title: "2026年夏季课程安排",
      subtitle: "暑期课程时间表",
      spine: "2024夏季课程",
      cover: "images/cases/video-thumbnail.jpg",
      date: "2024-03-20",
      size: "2.8 MB",
      pdfUrl: "assets/pdf/summer2024.pdf",
    },
    {
      id: 14,
      title: "2027年夏季课程安排",
      subtitle: "暑期课程时间表",
      spine: "2024夏季课程",
      cover: "images/cases/video-thumbnail.jpg",
      date: "2024-03-20",
      size: "2.8 MB",
      pdfUrl: "assets/pdf/summer2024.pdf",
    },
    {
      id: 15,
      title: "2028年夏季课程安排",
      subtitle: "暑期课程时间表",
      spine: "2024夏季课程",
      cover: "images/cases/video-thumbnail.jpg",
      date: "2024-03-20",
      size: "2.8 MB",
      pdfUrl: "assets/pdf/summer2024.pdf",
    },
    {
      id: 16,
      title: "2029年夏季课程安排",
      subtitle: "暑期课程时间表",
      spine: "2024夏季课程",
      cover: "images/cases/video-thumbnail.jpg",
      date: "2024-03-20",
      size: "2.8 MB",
      pdfUrl: "assets/pdf/summer2024.pdf",
    },
    {
      id: 17,
      title: "2030年夏季课程安排",
      subtitle: "暑期课程时间表",
      spine: "2024夏季课程",
      cover: "images/cases/video-thumbnail.jpg",
      date: "2024-03-20",
      size: "2.8 MB",
      pdfUrl: "assets/pdf/summer2024.pdf",
    },
    {
      id: 18,
      title: "2024年夏季课程安排",
      subtitle: "暑期课程时间表",
      spine: "2024夏季课程",
      cover: "images/cases/video-thumbnail.jpg",
      date: "2024-03-20",
      size: "2.8 MB",
      pdfUrl: "assets/pdf/summer2024.pdf",
    },
    {
      id: 19,
      title: "2024年夏季课程安排",
      subtitle: "暑期课程时间表",
      spine: "2024夏季课程",
      cover: "images/cases/video-thumbnail.jpg",
      date: "2024-03-20",
      size: "2.8 MB",
      pdfUrl: "assets/pdf/summer2024.pdf",
    },
    {
      id: 20,
      title: "2024年夏季课程安排",
      subtitle: "暑期课程时间表",
      spine: "2024夏季课程",
      cover: "images/cases/video-thumbnail.jpg",
      date: "2024-03-20",
      size: "2.8 MB",
      pdfUrl: "assets/pdf/summer2024.pdf",
    },
    {
      id: 21,
      title: "2024年夏季课程安排",
      subtitle: "暑期课程时间表",
      spine: "2024夏季课程",
      cover: "images/cases/video-thumbnail.jpg",
      date: "2024-03-20",
      size: "2.8 MB",
      pdfUrl: "assets/pdf/summer2024.pdf",
    },
    {
      id: 22,
      title: "2024年夏季课程安排",
      subtitle: "暑期课程时间表",
      spine: "2024夏季课程",
      cover: "images/cases/video-thumbnail.jpg",
      date: "2024-03-20",
      size: "2.8 MB",
      pdfUrl: "assets/pdf/summer2024.pdf",
    },
    {
      id: 23,
      title: "2024年夏季课程安排",
      subtitle: "暑期课程时间表",
      spine: "2024夏季课程",
      cover: "images/cases/video-thumbnail.jpg",
      date: "2024-03-20",
      size: "2.8 MB",
      pdfUrl: "assets/pdf/summer2024.pdf",
    },
    {
      id: 1,
      title: "2024年春季课程安排",
      subtitle: "课程时间表与教学大纲",
      spine: "2024春季课程",
      cover: "images/cases/video-thumbnail.jpg",
      date: "2024-03-15",
      size: "2.5 MB",
      pdfUrl: "assets/pdf/spring2024.pdf",
    },
    {
      id: 2,
      title: "2025年夏季课程安排",
      subtitle: "暑期课程时间表",
      spine: "2024夏季课程",
      cover: "images/cases/video-thumbnail.jpg",
      date: "2024-03-20",
      size: "2.8 MB",
      pdfUrl: "assets/pdf/summer2024.pdf",
    },
    {
      id: 3,
      title: "2026年夏季课程安排",
      subtitle: "暑期课程时间表",
      spine: "2024夏季课程",
      cover: "images/cases/video-thumbnail.jpg",
      date: "2024-03-20",
      size: "2.8 MB",
      pdfUrl: "assets/pdf/summer2024.pdf",
    },
    {
      id: 4,
      title: "2027年夏季课程安排",
      subtitle: "暑期课程时间表",
      spine: "2024夏季课程",
      cover: "images/cases/video-thumbnail.jpg",
      date: "2024-03-20",
      size: "2.8 MB",
      pdfUrl: "assets/pdf/summer2024.pdf",
    },
    {
      id: 5,
      title: "2028年夏季课程安排",
      subtitle: "暑期课程时间表",
      spine: "2024夏季课程",
      cover: "images/cases/video-thumbnail.jpg",
      date: "2024-03-20",
      size: "2.8 MB",
      pdfUrl: "assets/pdf/summer2024.pdf",
    },
    {
      id: 6,
      title: "2029年夏季课程安排",
      subtitle: "暑期课程时间表",
      spine: "2024夏季课程",
      cover: "images/cases/video-thumbnail.jpg",
      date: "2024-03-20",
      size: "2.8 MB",
      pdfUrl: "assets/pdf/summer2024.pdf",
    },
    {
      id: 7,
      title: "2030年夏季课程安排",
      subtitle: "暑期课程时间表",
      spine: "2024夏季课程",
      cover: "images/cases/video-thumbnail.jpg",
      date: "2024-03-20",
      size: "2.8 MB",
      pdfUrl: "assets/pdf/summer2024.pdf",
    },
    {
      id: 8,
      title: "2024年夏季课程安排",
      subtitle: "暑期课程时间表",
      spine: "2024夏季课程",
      cover: "images/cases/video-thumbnail.jpg",
      date: "2024-03-20",
      size: "2.8 MB",
      pdfUrl: "assets/pdf/summer2024.pdf",
    },
    {
      id: 9,
      title: "2024年夏季课程安排",
      subtitle: "暑期课程时间表",
      spine: "2024夏季课程",
      cover: "images/cases/video-thumbnail.jpg",
      date: "2024-03-20",
      size: "2.8 MB",
      pdfUrl: "assets/pdf/summer2024.pdf",
    },
    {
      id: 10,
      title: "2024年夏季课程安排",
      subtitle: "暑期课程时间表",
      spine: "2024夏季课程",
      cover: "images/cases/video-thumbnail.jpg",
      date: "2024-03-20",
      size: "2.8 MB",
      pdfUrl: "assets/pdf/summer2024.pdf",
    },
    {
      id: 11,
      title: "2024年春季课程安排",
      subtitle: "课程时间表与教学大纲",
      spine: "2024春季课程",
      cover: "images/cases/video-thumbnail.jpg",
      date: "2024-03-15",
      size: "2.5 MB",
      pdfUrl: "assets/pdf/spring2024.pdf",
    },
    {
      id: 12,
      title: "2025年夏季课程安排",
      subtitle: "暑期课程时间表",
      spine: "2024夏季课程",
      cover: "images/cases/video-thumbnail.jpg",
      date: "2024-03-20",
      size: "2.8 MB",
      pdfUrl: "assets/pdf/summer2024.pdf",
    },
    {
      id: 13,
      title: "2026年夏季课程安排",
      subtitle: "暑期课程时间表",
      spine: "2024夏季课程",
      cover: "images/cases/video-thumbnail.jpg",
      date: "2024-03-20",
      size: "2.8 MB",
      pdfUrl: "assets/pdf/summer2024.pdf",
    },
    {
      id: 14,
      title: "2027年夏季课程安排",
      subtitle: "暑期课程时间表",
      spine: "2024夏季课程",
      cover: "images/cases/video-thumbnail.jpg",
      date: "2024-03-20",
      size: "2.8 MB",
      pdfUrl: "assets/pdf/summer2024.pdf",
    },
    {
      id: 15,
      title: "2028年夏季课程安排",
      subtitle: "暑期课程时间表",
      spine: "2024夏季课程",
      cover: "images/cases/video-thumbnail.jpg",
      date: "2024-03-20",
      size: "2.8 MB",
      pdfUrl: "assets/pdf/summer2024.pdf",
    },
    {
      id: 16,
      title: "2029年夏季课程安排",
      subtitle: "暑期课程时间表",
      spine: "2024夏季课程",
      cover: "images/cases/video-thumbnail.jpg",
      date: "2024-03-20",
      size: "2.8 MB",
      pdfUrl: "assets/pdf/summer2024.pdf",
    },
    {
      id: 17,
      title: "2030年夏季课程安排",
      subtitle: "暑期课程时间表",
      spine: "2024夏季课程",
      cover: "images/cases/video-thumbnail.jpg",
      date: "2024-03-20",
      size: "2.8 MB",
      pdfUrl: "assets/pdf/summer2024.pdf",
    },
    {
      id: 18,
      title: "2024年夏季课程安排",
      subtitle: "暑期课程时间表",
      spine: "2024夏季课程",
      cover: "images/cases/video-thumbnail.jpg",
      date: "2024-03-20",
      size: "2.8 MB",
      pdfUrl: "assets/pdf/summer2024.pdf",
    },
    {
      id: 19,
      title: "2024年夏季课程安排",
      subtitle: "暑期课程时间表",
      spine: "2024夏季课程",
      cover: "images/cases/video-thumbnail.jpg",
      date: "2024-03-20",
      size: "2.8 MB",
      pdfUrl: "assets/pdf/summer2024.pdf",
    },
    {
      id: 20,
      title: "2024年夏季课程安排",
      subtitle: "暑期课程时间表",
      spine: "2024夏季课程",
      cover: "images/cases/video-thumbnail.jpg",
      date: "2024-03-20",
      size: "2.8 MB",
      pdfUrl: "assets/pdf/summer2024.pdf",
    },
    {
      id: 21,
      title: "2024年夏季课程安排",
      subtitle: "暑期课程时间表",
      spine: "2024夏季课程",
      cover: "images/cases/video-thumbnail.jpg",
      date: "2024-03-20",
      size: "2.8 MB",
      pdfUrl: "assets/pdf/summer2024.pdf",
    },
    {
      id: 22,
      title: "2024年夏季课程安排",
      subtitle: "暑期课程时间表",
      spine: "2024夏季课程",
      cover: "images/cases/video-thumbnail.jpg",
      date: "2024-03-20",
      size: "2.8 MB",
      pdfUrl: "assets/pdf/summer2024.pdf",
    },
    {
      id: 23,
      title: "2024年夏季课程安排",
      subtitle: "暑期课程时间表",
      spine: "2024夏季课程",
      cover: "images/cases/video-thumbnail.jpg",
      date: "2024-03-20",
      size: "2.8 MB",
      pdfUrl: "assets/pdf/summer2024.pdf",
    },
  ],

  // ... 添加更多课程资料
};

// 生成书本HTML
function generateBookHTML(book) {
  return `
        <div class="book-wrapper">
            <div class="book">
                <div class="book-side">
                    <div class="book-logo"></div>
                    <div class="book-spine">
                        <span>${book.spine}</span>
                    </div>
                    <div class="book-pages"></div>
                </div>
                <div class="book-front" onclick="window.open('${book.pdfUrl}', '_blank')">
                    <div class="cover-content">
                        <div class="cover-title">
                            <h3>${book.title}</h3>
                            <p>${book.subtitle}</p>
                        </div>
                        <div class="cover-image">
                            <img src="${book.cover}" alt="${book.title}">
                        </div>
                        <div class="cover-footer">
                            <time>${book.date}</time>
                            <span>${book.size}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// 修改渲染书架函数
function renderBookshelf(pageIndex = 0) {
  const shelfLayers = document.querySelectorAll(".shelf-layer");
  const booksPerPage = 21; // 3行 × 7列
  const totalPages = Math.ceil(booksData.course.length / booksPerPage);

  if (shelfLayers[0]) {
    // 计算当前页的书本
    const startIndex = pageIndex * booksPerPage;
    const endIndex = Math.min(
      startIndex + booksPerPage,
      booksData.course.length,
    );
    const pageBooks = booksData.course.slice(startIndex, endIndex);

    // 生成当前页HTML
    const pageHtml = `
      <div class="page">
        ${pageBooks.map((book) => generateBookHTML(book)).join("")}
      </div>
    `;

    // 更新内容
    const layer = shelfLayers[0];
    layer.innerHTML = pageHtml;

    // 更新导航按钮状态
    const prevBtn = document.querySelector(".shelf-nav.prev");
    const nextBtn = document.querySelector(".shelf-nav.next");

    if (prevBtn && nextBtn) {
      prevBtn.style.display = pageIndex > 0 ? "flex" : "none";
      nextBtn.style.display = pageIndex < totalPages - 1 ? "flex" : "none";
    }
  }
}

// 修改书架层样式
function updateShelfStyles() {
  const style = document.createElement("style");
  style.textContent = `
        .bookshelf-unit {
            position: relative;
            width: 100%;
            max-width: 1600px;
            margin: 0 auto;
            padding: 0 60px;
            height: 100vh;
            overflow: auto;
        }

        .shelf {
            position: relative;
            width: 1400px; /* 固定最小宽度 */
            min-width: 1400px; /* 确保不会缩得太小 */
            min-height: 85vh;
            height: 800px;
            background: linear-gradient(to bottom, 
                rgba(0, 200, 83, 0.15),
                rgba(0, 230, 118, 0.1)
            );
            border-radius: 8px;
            border: 1px solid rgba(0, 200, 83, 0.1);
            padding: 60px 40px;
            box-sizing: border-box;
            margin: 40px auto;
            display: flex;
            align-items: center;
        }
        
        .page {
            flex: 0 0 100%;
            width: 100%;
            display: grid;
            grid-template-columns: repeat(7, minmax(160px, 1fr));
            grid-template-rows: repeat(3, 220px);
            gap: 25px;
            justify-content: center;
            align-items: center;
            margin: 0 auto;
        }

        /* 自定义滚动条样式 */
        .bookshelf-unit::-webkit-scrollbar {
            width: 8px;
            height: 8px; /* 添加水平滚动条高度 */
        }

        .bookshelf-unit::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.05);
            border-radius: 4px;
        }

        .bookshelf-unit::-webkit-scrollbar-thumb {
            background: rgba(0, 200, 83, 0.2);
            border-radius: 4px;
        }

        .bookshelf-unit::-webkit-scrollbar-thumb:hover {
            background: rgba(0, 200, 83, 0.3);
        }

        .bookshelf-unit::-webkit-scrollbar-corner {
            background: rgba(0, 0, 0, 0.05); /* 滚动条交汇处的样式 */
        }

        .book-wrapper {
            width: 100%;
            height: 220px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .book {
            width: 100%;
            height: 90%;
            max-width: 160px;
            position: relative;
            transform-style: preserve-3d;
            transition: all 0.3s ease;
            margin: 0 auto;
        }

        .shelf-nav {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 40px;
            height: 40px;
            background: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 10;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .shelf-nav.prev { left: 10px; }
        .shelf-nav.next { right: 10px; }

        .shelf-layer {
            position: relative;
            width: 100%;
            min-height: 90vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .book-side {
            position: absolute;
            left: 0;
            width: 30px;
            height: 95%;
            transform-origin: left;
            transform: rotateY(0deg);
            background: linear-gradient(to right, #00C853, #00E676);
            border-radius: 2px 0 0 2px;
            display: flex;
            flex-direction: column;
            padding: 6px 0;
        }

        .book-logo {
            width: 22px;
            height: 22px;
            margin: 4px auto;
            background: url('../images/logo-small.png') no-repeat center;
            background-size: 18px;
            flex-shrink: 0;
            position: relative;
            z-index: 2;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .book-spine {
            flex: 1;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            writing-mode: vertical-rl;
            text-orientation: mixed;
            color: white;
            font-size: 14px;
            padding: 10px 0;
            margin-top: 4px;
        }

        .book-front {
            position: absolute;
            left: 30px;
            height: 100%;
            background: white;
            border-radius: 0 2px 2px 0;
            box-sizing: border-box;
        }

        .cover-content {
            height: 100%;
            display: flex;
            flex-direction: column;
        }

        .cover-title {
            text-align: center;
            padding: 5px 0;
        }

        .cover-title h3 {
            font-size: 13px;
            margin-bottom: 2px;
        }

        .cover-title p {
            font-size: 10px;
            color: #666;
        }

        .cover-image {
            flex: 1;
            margin: 8px 0;
            overflow: hidden;
            border-radius: 2px;
        }

        .cover-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .cover-footer {
            display: flex;
            justify-content: space-between;
            font-size: 10px;
            color: #666;
            padding-top: 5px;
            border-top: 1px solid #eee;
        }
    `;
  document.head.appendChild(style);
}

// 修改导航函数
function initializeShelfNavigation() {
  const shelf = document.querySelector(".shelf");
  const prevBtn = shelf.querySelector(".shelf-nav.prev");
  const nextBtn = shelf.querySelector(".shelf-nav.next");
  let currentPage = 0;
  const totalPages = Math.ceil(booksData.course.length / 21);

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
}

// 修改初始化函数
document.addEventListener("DOMContentLoaded", () => {
  updateShelfStyles();
  renderBookshelf();
  initializeShelfNavigation();
});
