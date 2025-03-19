// 创建层级视图的图片组
const historyGroup = document.createElement("div");
historyGroup.className = "history-group";
historyGroup.innerHTML = `
  <img src="${generatedImages[0]}" alt="组预览图片">
  <div class="image-actions">
    <button class="image-action-btn" title="收藏">
      <i class="ri-star-line"></i>
    </button>
  </div>
  <div class="image-count">${this.currentCount}张</div>
`;

// 添加到层级视图
const treeViewList = document.getElementById("treeViewList");
if (treeViewList) {
    const emptyState = treeViewList.querySelector(".history-empty-state");
    if (emptyState) {
        emptyState.remove();
    }
    treeViewList.insertBefore(historyGroup, treeViewList.firstChild);
}

// 页面加载后添加测试元素
document.addEventListener('DOMContentLoaded', function() {
    const treeViewList = document.getElementById("treeViewList");
    if (treeViewList) {
        const testGroup = document.createElement("div");
        testGroup.className = "history-group";
        testGroup.innerHTML = `
            <img src="https://imgapi.cn/api.php?zd=mobile&fl=meizi&gs=images" alt="测试图片">
            <div class="image-actions">
                <button class="image-action-btn" title="收藏">
                    <i class="ri-star-line"></i>
                </button>
            </div>
            <div class="image-count" style="position:absolute;bottom:8px;right:8px;background:red;color:white;padding:4px;">5张</div>
        `;
        treeViewList.insertBefore(testGroup, treeViewList.firstChild);
    }
}); 