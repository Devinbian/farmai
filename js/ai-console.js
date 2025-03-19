// 页面加载完成后执行
document.addEventListener("DOMContentLoaded", () => {
  // 初始化导航切换
  initNavigation();
  // 初始化聊天功能
  initChat();
  // 初始化图片生成功能
  initImageGeneration();
  // 初始化视频生成功能
  initVideoGeneration();
});

// 导航切换功能
function initNavigation() {
  const navLinks = document.querySelectorAll(".ai-nav a");
  const sections = document.querySelectorAll(".ai-section");

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href").substring(1);

      // 更新导航状态
      navLinks.forEach((l) => l.classList.remove("active"));
      link.classList.add("active");

      // 更新内容区域显示
      sections.forEach((section) => {
        section.classList.remove("active");
        if (section.id === targetId) {
          section.classList.add("active");
        }
      });
    });
  });
}

// 聊天功能初始化
function initChat() {
  const chatInput = document.getElementById("chatInput");
  const sendButton = document.getElementById("sendMessage");
  const chatMessages = document.getElementById("chatMessages");
  const newChatBtn = document.querySelector(".new-chat-btn");
  const chatHistoryList = document.getElementById("chatHistoryList");
  const currentChatTitle = document.getElementById("currentChatTitle");
  const clearChatBtn = document.querySelector('.action-btn[title="清空对话"]');
  const exportChatBtn = document.querySelector('.action-btn[title="导出对话"]');
  const chatSidebar = document.querySelector(".chat-sidebar");
  const historyTitle = document.querySelector(".history-title");
  const renameChatBtn = document.querySelector(
    '.action-btn[title="重命名对话"]',
  );

  // 存储对话历史
  let chats = [];
  let currentChatId = null;

  // 生成mock数据
  function generateMockData() {
    const now = new Date();
    const mockChats = [
      {
        id: "1",
        title: "水稻种植技术咨询",
        messages: [
          {
            type: "user",
            content: "水稻秧苗期如何管理？",
            timestamp: new Date(now - 1000 * 60 * 30),
          },
          {
            type: "ai",
            content: "水稻秧苗期管理的关键点包括：1. 水分管理...",
            timestamp: new Date(now - 1000 * 60 * 29),
          },
        ],
        createdAt: new Date(now - 1000 * 60 * 30),
        isFavorite: true,
      },
      {
        id: "2",
        title: "农药使用指导",
        messages: [
          {
            type: "user",
            content: "玉米地发现了玉米螟，该如何防治？",
            timestamp: new Date(now - 1000 * 60 * 60 * 25),
          },
          {
            type: "ai",
            content: "针对玉米螟的防治，建议采取以下措施：...",
            timestamp: new Date(now - 1000 * 60 * 60 * 24),
          },
        ],
        createdAt: new Date(now - 1000 * 60 * 60 * 25),
        isFavorite: false,
      },
      {
        id: "3",
        title: "土壤改良方案",
        messages: [
          {
            type: "user",
            content: "土壤盐碱化严重，有什么改良方法？",
            timestamp: new Date(now - 1000 * 60 * 60 * 24 * 4),
          },
          {
            type: "ai",
            content: "针对盐碱地改良，可以采取以下措施：...",
            timestamp: new Date(now - 1000 * 60 * 60 * 24 * 4),
          },
        ],
        createdAt: new Date(now - 1000 * 60 * 60 * 24 * 4),
        isFavorite: true,
      },
      {
        id: "4",
        title: "果树修剪技术",
        messages: [
          {
            type: "user",
            content: "苹果树冬季修剪要注意什么？",
            timestamp: new Date(now - 1000 * 60 * 60 * 24 * 15),
          },
          {
            type: "ai",
            content: "苹果树冬季修剪的注意事项：...",
            timestamp: new Date(now - 1000 * 60 * 60 * 24 * 15),
          },
        ],
        createdAt: new Date(now - 1000 * 60 * 60 * 24 * 15),
        isFavorite: false,
      },
      {
        id: "5",
        title: "温室大棚管理",
        messages: [
          {
            type: "user",
            content: "夏季大棚温度过高怎么调节？",
            timestamp: new Date(now - 1000 * 60 * 60 * 24 * 35),
          },
          {
            type: "ai",
            content: "大棚降温可以采取以下措施：...",
            timestamp: new Date(now - 1000 * 60 * 60 * 24 * 35),
          },
        ],
        createdAt: new Date(now - 1000 * 60 * 60 * 24 * 35),
        isFavorite: true,
      },
    ];
    chats = mockChats;
  }

  // 获取对话分组
  function getChatGroups() {
    const now = new Date();
    const groups = {
      今天: [],
      本周: [],
      本月: [],
      更早: [],
    };

    chats.forEach((chat) => {
      const chatDate = new Date(chat.createdAt);
      const diffDays = Math.floor((now - chatDate) / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor((now - chatDate) / (1000 * 60 * 60));

      if (diffHours < 24) {
        groups["今天"].push(chat);
      } else if (diffDays <= 7) {
        groups["本周"].push(chat);
      } else if (diffDays <= 30) {
        groups["本月"].push(chat);
      } else {
        groups["更早"].push(chat);
      }
    });

    return groups;
  }

  // 初始化历史对话列表收缩功能
  function initHistoryToggle() {
    const historyToggleBtn = document.querySelector(".history-toggle-btn");
    const chatHistory = document.querySelector(".chat-history");

    if (!historyToggleBtn || !chatHistory) {
      console.warn("历史列表或切换按钮未找到");
      return;
    }

    historyToggleBtn.addEventListener("click", () => {
      chatSidebar.classList.toggle("collapsed");
      // 保存收缩状态到localStorage
      localStorage.setItem(
        "chatSidebarCollapsed",
        chatSidebar.classList.contains("collapsed"),
      );
    });

    // 从localStorage恢复收缩状态
    const isCollapsed = localStorage.getItem("chatSidebarCollapsed") === "true";
    if (isCollapsed) {
      chatSidebar.classList.add("collapsed");
    }
  }

  // 创建新对话
  function createNewChat() {
    const chatId = Date.now().toString();
    const chat = {
      id: chatId,
      title: "新对话",
      messages: [],
      createdAt: new Date(),
      isFavorite: false,
    };
    chats.unshift(chat); // 使用unshift将新对话添加到数组开头
    currentChatId = chatId;
    updateChatUI(chat);
    updateHistoryList();

    // 添加开场白和建议
    chatMessages.innerHTML = `
        <div class="welcome-message">
            <h2>欢迎使用 FarmAI 助手 👋</h2>
            <p>我是您的智能农业助手，可以为您提供专业的农业知识和建议。</p>
            <div class="suggestions">
                <h3>您可以问我：</h3>
                <div class="suggestion-items">
                    <div class="suggestion-item" onclick="applySuggestion('如何科学种植水稻？')">
                        <i class="ri-seedling-line"></i>
                        <span>如何科学种植水稻？</span>
                    </div>
                    <div class="suggestion-item" onclick="applySuggestion('常见农作物病虫害防治方法有哪些？')">
                        <i class="ri-bug-line"></i>
                        <span>常见农作物病虫害防治方法有哪些？</span>
                    </div>
                    <div class="suggestion-item" onclick="applySuggestion('如何进行土壤改良？')">
                        <i class="ri-landscape-line"></i>
                        <span>如何进行土壤改良？</span>
                    </div>
                    <div class="suggestion-item" onclick="applySuggestion('农业机械使用注意事项有哪些？')">
                        <i class="ri-truck-line"></i>
                        <span>农业机械使用注意事项有哪些？</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    return chat;
  }

  // 更新聊天界面
  function updateChatUI(chat) {
    currentChatTitle.textContent = chat.title || "新对话";
    chatMessages.innerHTML = "";
    chat.messages.forEach((message) => {
      addMessage(message.type, message.content, message.timestamp);
    });
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // 更新历史对话列表
  function updateHistoryList() {
    const historyList = document.getElementById("chatHistoryList");
    if (!historyList) return;

    historyList.innerHTML = "";
    const groups = getChatGroups();

    // 按固定顺序显示分组
    const groupOrder = ["今天", "本周", "本月", "更早"];

    groupOrder.forEach((groupName) => {
      const groupChats = groups[groupName];
      if (groupChats && groupChats.length > 0) {
        const groupDiv = document.createElement("div");
        groupDiv.className = "history-group";

        const groupTitle = document.createElement("div");
        groupTitle.className = "history-group-title";
        groupTitle.textContent = groupName;
        groupDiv.appendChild(groupTitle);

        groupChats.forEach((chat) => {
          const historyItem = document.createElement("div");
          historyItem.className = `history-item ${
            chat.id === currentChatId ? "active" : ""
          }`;
          historyItem.innerHTML = `
                    <i class="ri-chat-3-line"></i>
                    <span class="chat-title">${chat.title || "新对话"}</span>
                    <div class="chat-actions">
                        <button class="chat-action-btn favorite-btn ${
                          chat.isFavorite ? "active" : ""
                        }" title="${chat.isFavorite ? "取消收藏" : "收藏"}">
                            <i class="ri-star-${
                              chat.isFavorite ? "fill" : "line"
                            }"></i>
                        </button>
                        <button class="chat-action-btn rename-btn" title="重命名" onclick="renameChat('${
                          chat.id
                        }')">
                            <i class="ri-edit-line"></i>
                        </button>
                        <button class="chat-action-btn" title="删除" onclick="deleteChat('${
                          chat.id
                        }')">
                            <i class="ri-delete-bin-line"></i>
                        </button>
                    </div>
                `;

          // 点击切换对话
          historyItem.addEventListener("click", (e) => {
            if (
              !e.target.closest(".chat-actions") &&
              !e.target.closest(".chat-title")
            ) {
              currentChatId = chat.id;
              updateChatUI(chat);
              updateHistoryList();
            }
          });

          // 收藏按钮事件
          const favoriteBtn = historyItem.querySelector(".favorite-btn");
          favoriteBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            chat.isFavorite = !chat.isFavorite;
            updateHistoryList();
          });

          // 标题点击事件
          // const titleSpan = historyItem.querySelector(".chat-title");
          // titleSpan.addEventListener("click", (e) => {
          //   e.stopPropagation();
          //   renameChat(chat.id);
          // });

          groupDiv.appendChild(historyItem);
        });

        historyList.appendChild(groupDiv);
      }
    });
  }

  // 添加消息到聊天界面
  function addMessage(type, content, timestamp = new Date()) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${type}-message`;
    messageDiv.innerHTML = `
      <div class="message-content">
        <div class="message-text">${content}</div>
        <div class="message-time">${timestamp.toLocaleTimeString()}</div>
      </div>
    `;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // 发送消息
  async function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    // 如果没有当前对话，创建新对话
    if (!currentChatId) {
      createNewChat();
    }

    const currentChat = chats.find((chat) => chat.id === currentChatId);

    // 添加用户消息
    const userMessage = {
      type: "user",
      content: message,
      timestamp: new Date(),
    };
    currentChat.messages.push(userMessage);
    addMessage("user", message);

    // 更新对话标题（使用第一条消息的前20个字符）
    if (!currentChat.title || currentChat.title === "新对话") {
      currentChat.title =
        message.length > 20 ? message.slice(0, 20) + "..." : message;
      currentChatTitle.textContent = currentChat.title;
      updateHistoryList();
    }

    chatInput.value = "";
    chatInput.style.height = "auto";

    try {
      // 这里需要替换为实际的API调用
      const response = await mockAIResponse(message);

      // 添加AI回复
      const aiMessage = {
        type: "ai",
        content: response,
        timestamp: new Date(),
      };
      currentChat.messages.push(aiMessage);
      addMessage("ai", response);
    } catch (error) {
      const errorMessage = "抱歉，发生了一些错误，请稍后重试。";
      currentChat.messages.push({
        type: "ai",
        content: errorMessage,
        timestamp: new Date(),
      });
      addMessage("ai", errorMessage);
    }
  }

  // 清空当前对话
  function clearCurrentChat() {
    if (!currentChatId) return;

    if (confirm("确定要清空当前对话吗？")) {
      const currentChat = chats.find((chat) => chat.id === currentChatId);
      if (currentChat) {
        currentChat.messages = [];
        updateChatUI(currentChat);
      }
    }
  }

  // 导出对话
  function exportChat() {
    if (!currentChatId) return;

    const currentChat = chats.find((chat) => chat.id === currentChatId);
    if (currentChat) {
      const exportData = {
        title: currentChat.title,
        messages: currentChat.messages,
        createdAt: currentChat.createdAt,
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `chat-${currentChat.title}-${
        new Date().toISOString().split("T")[0]
      }.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }

  // 模拟AI响应
  async function mockAIResponse(message) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const responses = [
      "我理解您的问题，让我为您详细解答...",
      "这是一个很好的问题，根据我的分析...",
      "针对这个情况，我建议您可以...",
      "从农业专业的角度来看，我认为...",
      "结合最新的农业技术，我的建议是...",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // 应用建议问题
  function applySuggestion(question) {
    chatInput.value = question;
    chatInput.style.height = "auto";
    chatInput.style.height = chatInput.scrollHeight + "px";
    chatInput.focus();
  }

  // 删除对话
  function deleteChat(chatId) {
    if (!confirm("确定要删除这个对话吗？")) return;

    const index = chats.findIndex((c) => c.id === chatId);
    if (index !== -1) {
      chats.splice(index, 1);
      if (chatId === currentChatId) {
        if (chats.length > 0) {
          currentChatId = chats[0].id;
          updateChatUI(chats[0]);
        } else {
          currentChatId = null;
          createNewChat();
        }
      }
      updateHistoryList();
    }
  }

  // 重命名对话
  function renameChat(chatId) {
    const chat = chats.find((c) => c.id === chatId);
    if (!chat) return;

    const newTitle = prompt("请输入新的对话名称：", chat.title);
    if (newTitle !== null && newTitle.trim() !== "") {
      chat.title = newTitle.trim();
      if (chatId === currentChatId) {
        currentChatTitle.textContent = chat.title;
      }
      updateHistoryList();
    }
  }

  // 绑定事件
  function initEvents() {
    newChatBtn.addEventListener("click", createNewChat);
    sendButton.addEventListener("click", sendMessage);
    clearChatBtn.addEventListener("click", clearCurrentChat);
    exportChatBtn.addEventListener("click", exportChat);

    // 绑定右上角重命名按钮事件
    if (renameChatBtn) {
      renameChatBtn.addEventListener("click", () => {
        if (currentChatId) {
          renameChat(currentChatId);
        }
      });
    }

    // 绑定回车发送
    chatInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    // 自动调整输入框高度
    chatInput.addEventListener("input", () => {
      chatInput.style.height = "auto";
      chatInput.style.height = chatInput.scrollHeight + "px";
    });
  }

  // 初始化
  function init() {
    // 生成mock数据
    generateMockData();
    // 初始化历史对话列表收缩功能
    initHistoryToggle();
    // 初始化事件绑定
    initEvents();
    // 更新历史列表显示
    updateHistoryList();
    // 如果没有当前对话，创建新对话
    if (!currentChatId && chats.length === 0) {
      createNewChat();
    } else if (chats.length > 0) {
      // 显示第一个对话
      currentChatId = chats[0].id;
      updateChatUI(chats[0]);
    }
  }

  // 将函数暴露到全局作用域
  window.renameChat = renameChat;
  window.deleteChat = deleteChat;
  window.applySuggestion = applySuggestion;

  // 开始初始化
  init();
}

// 图片生成功能初始化
function initImageGeneration() {
  const imagePrompt = document.getElementById("imagePrompt");
  const imageStyle = document.getElementById("imageStyle");
  const generateButton = document.getElementById("generateImage");
  const imageGallery = document.getElementById("imageGallery");
  const clearGalleryBtn = document.querySelector(
    ".gallery-actions .action-btn",
  );
  const suggestionTags = document.querySelectorAll(".tag");

  // 添加标签点击事件
  suggestionTags.forEach((tag) => {
    tag.addEventListener("click", () => {
      const tagText = tag.textContent;
      const currentPrompt = imagePrompt.value.trim();
      imagePrompt.value = currentPrompt
        ? `${currentPrompt}, ${tagText}`
        : tagText;
      imagePrompt.focus();
    });
  });

  // 清空画廊
  clearGalleryBtn.addEventListener("click", () => {
    if (confirm("确定要清空所有创作记录吗？")) {
      imageGallery.innerHTML = `
        <div class="empty-gallery">
          <i class="ri-image-2-line"></i>
          <p>暂无创作记录</p>
        </div>
      `;
    }
  });

  generateButton.addEventListener("click", async () => {
    const prompt = imagePrompt.value.trim();
    const style = imageStyle.value;

    if (!prompt) {
      alert("请输入创作描述");
      return;
    }

    // 显示加载状态
    generateButton.disabled = true;
    generateButton.innerHTML = '<i class="ri-loader-4-line"></i>创作中...';

    try {
      // 移除空画廊提示
      const emptyGallery = imageGallery.querySelector(".empty-gallery");
      if (emptyGallery) {
        emptyGallery.remove();
      }

      // 这里需要替换为实际的API调用
      const imageUrl = await mockImageGeneration(prompt, style);

      // 添加生成的图片到画廊
      const imageCard = document.createElement("div");
      imageCard.className = "image-card";
      imageCard.innerHTML = `
        <img src="${imageUrl}" alt="${prompt}">
        <div class="image-info">
          <p>${prompt}</p>
          <p>风格: ${imageStyle.options[imageStyle.selectedIndex].text}</p>
        </div>
      `;
      imageGallery.insertBefore(imageCard, imageGallery.firstChild);
    } catch (error) {
      alert("创作失败，请稍后重试");
    } finally {
      generateButton.disabled = false;
      generateButton.innerHTML = '<i class="ri-magic-line"></i>开始创作';
    }
  });

  // 模拟图片生成
  async function mockImageGeneration(prompt, style) {
    // 这里需要替换为实际的API调用
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return "https://via.placeholder.com/400x400?text=AI+Generated+Image";
  }
}

// 视频生成功能初始化
function initVideoGeneration() {
  const videoPrompt = document.getElementById("videoPrompt");
  const videoStyle = document.getElementById("videoStyle");
  const generateButton = document.getElementById("generateVideo");
  const videoPreview = document.getElementById("videoPreview");

  generateButton.addEventListener("click", async () => {
    const prompt = videoPrompt.value.trim();
    const style = videoStyle.value;

    if (!prompt) {
      alert("请输入视频描述");
      return;
    }

    // 显示加载状态
    generateButton.disabled = true;
    generateButton.textContent = "生成中...";

    try {
      // 这里需要替换为实际的API调用
      const videoUrl = await mockVideoGeneration(prompt, style);

      // 更新视频预览
      videoPreview.innerHTML = `
                <video controls>
                    <source src="${videoUrl}" type="video/mp4">
                    您的浏览器不支持视频播放。
                </video>
            `;
    } catch (error) {
      alert("视频生成失败，请稍后重试");
    } finally {
      generateButton.disabled = false;
      generateButton.textContent = "生成视频";
    }
  });

  // 模拟视频生成
  async function mockVideoGeneration(prompt, style) {
    // 这里需要替换为实际的API调用
    await new Promise((resolve) => setTimeout(resolve, 3000));
    return "https://example.com/sample-video.mp4";
  }
}

// AI绘画部分的控制代码
class ImageGenerationController {
  constructor() {
    this.initElements();
    if (this.elementsExist()) {
      this.bindEvents();
    } else {
      console.warn("Some required elements are missing");
    }

    // 初始状态
    this.isGenerating = false;
    this.currentRatio = "1:1";
    this.currentCount = 1;
  }

  initElements() {
    // 初始化DOM元素
    this.prompt = document.querySelector(".prompt-input textarea");
    this.generateBtn = document.querySelector(".primary-btn");
    this.previewArea = document.querySelector(".preview-area");
    this.emptyPreview = document.querySelector(".empty-preview");
    this.previewGrid = document.querySelector(".preview-grid");
    this.generateCount = document.querySelector(".number-input input");
    this.uploadArea = document.querySelector(".upload-area");
    this.imageHistory = document.querySelector(".image-history");
    this.historyToggleBtn = document.querySelector(".toggle-btn");

    // 从localStorage恢复状态
    if (this.imageHistory) {
      const isCollapsed =
        localStorage.getItem("imageHistoryCollapsed") === "true";
      if (isCollapsed) {
        this.imageHistory.classList.add("collapsed");
        const icon = this.historyToggleBtn?.querySelector("i");
        if (icon) {
          icon.classList.replace(
            "ri-arrow-left-s-line",
            "ri-arrow-right-s-line",
          );
        }
      }
    }
  }

  elementsExist() {
    // 检查必要的元素是否存在
    const elements = {
      prompt: this.prompt,
      generateBtn: this.generateBtn,
      previewArea: this.previewArea,
      previewGrid: this.previewGrid,
      generateCount: this.generateCount,
      imageHistory: this.imageHistory,
      historyToggleBtn: this.historyToggleBtn,
    };

    // 输出缺失的元素
    Object.entries(elements).forEach(([name, element]) => {
      if (!element) {
        console.warn(`Missing element: ${name}`);
      }
    });

    return Object.values(elements).every((element) => element !== null);
  }

  bindEvents() {
    // 生成按钮点击事件
    this.generateBtn.addEventListener("click", () => this.handleGenerate());

    // 数量控制
    const minusBtn = document.querySelector(".number-btn.minus");
    const plusBtn = document.querySelector(".number-btn.plus");
    if (minusBtn && plusBtn) {
      minusBtn.addEventListener("click", () => this.updateCount(-1));
      plusBtn.addEventListener("click", () => this.updateCount(1));
    }
    if (this.generateCount) {
      this.generateCount.addEventListener("change", () => this.validateCount());
    }

    // 比例选择
    const ratioButtons = document.querySelectorAll(".ratio-btn");
    ratioButtons.forEach((btn) => {
      btn.addEventListener("click", () => this.handleRatioChange(btn));
    });

    // 历史记录展开/收起
    if (this.historyToggleBtn) {
      this.historyToggleBtn.addEventListener("click", (e) => {
        e.preventDefault(); // 阻止默认行为
        e.stopPropagation(); // 阻止事件冒泡
        this.toggleHistory();
      });
    }

    // 文件上传
    if (this.uploadArea) {
      this.uploadArea.addEventListener("click", () => this.handleUpload());
      this.uploadArea.addEventListener("dragover", (e) => e.preventDefault());
      this.uploadArea.addEventListener("drop", (e) => this.handleDrop(e));
    }
  }

  handleGenerate() {
    if (this.isGenerating) return;

    const prompt = this.prompt.value.trim();
    if (!prompt) {
      alert("请输入创意描述");
      return;
    }

    this.isGenerating = true;
    this.generateBtn.disabled = true;

    // 显示预览网格
    this.emptyPreview.style.display = "none";
    this.previewGrid.style.display = "grid";
    this.previewGrid.setAttribute("data-count", this.currentCount);

    // 清空现有内容
    this.previewGrid.innerHTML = "";

    // 添加生成中的占位符
    for (let i = 0; i < this.currentCount; i++) {
      this.previewGrid.appendChild(this.createGeneratingItem());
    }

    // 模拟生成过程
    setTimeout(() => {
      this.handleGenerateComplete();
    }, 3000);
  }

  createGeneratingItem() {
    const div = document.createElement("div");
    div.className = "preview-item generating";
    div.innerHTML = `
            <div class="loading-spinner"></div>
            <span class="generating-text">图像生成中...</span>
        `;
    return div;
  }

  createImageItem(imageUrl) {
    const div = document.createElement("div");
    div.className = "preview-item";
    div.innerHTML = `
            <img src="${imageUrl}" alt="生成的图片">
            <div class="image-actions">
                <button class="image-action-btn" title="收藏" onclick="handleFavorite(this)">
                    <i class="ri-heart-line"></i>
                </button>
                <button class="image-action-btn" title="下载" onclick="handleDownload('${imageUrl}')">
                    <i class="ri-download-line"></i>
                </button>
            </div>
        `;
    return div;
  }

  handleGenerateComplete() {
    this.isGenerating = false;
    this.generateBtn.disabled = false;

    // 清空预览网格
    this.previewGrid.innerHTML = "";

    // 使用本地示例图片（这里需要替换为实际的图片路径）
    const demoImages = [
      "/images/demo/image1.jpg",
      "/images/demo/image2.jpg",
      "/images/demo/image3.jpg",
      "/images/demo/image4.jpg",
    ];

    // 添加生成的图片
    for (let i = 0; i < this.currentCount; i++) {
      // 使用占位图片服务作为备选
      const imageUrl =
        demoImages[i] ||
        `https://via.placeholder.com/800x800.png?text=Generated+Image+${i + 1}`;
      this.previewGrid.appendChild(this.createImageItem(imageUrl));
    }
  }

  updateCount(delta) {
    let count = parseInt(this.generateCount.value) + delta;
    count = Math.max(1, Math.min(4, count));
    this.generateCount.value = count;
    this.currentCount = count;
  }

  validateCount() {
    let count = parseInt(this.generateCount.value);
    count = Math.max(1, Math.min(4, count));
    this.generateCount.value = count;
    this.currentCount = count;
  }

  handleRatioChange(btn) {
    document
      .querySelectorAll(".ratio-btn")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    this.currentRatio = btn.getAttribute("data-ratio");
  }

  toggleHistory() {
    if (this.imageHistory) {
      this.imageHistory.classList.toggle("collapsed");
      // 更新按钮图标
      const icon = this.historyToggleBtn.querySelector("i");
      if (icon) {
        if (this.imageHistory.classList.contains("collapsed")) {
          icon.classList.replace(
            "ri-arrow-left-s-line",
            "ri-arrow-right-s-line",
          );
        } else {
          icon.classList.replace(
            "ri-arrow-right-s-line",
            "ri-arrow-left-s-line",
          );
        }
      }
      // 保存状态到localStorage
      localStorage.setItem(
        "imageHistoryCollapsed",
        this.imageHistory.classList.contains("collapsed"),
      );
    }
  }

  handleUpload() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/jpeg,image/png";
    input.onchange = (e) => this.handleFile(e.target.files[0]);
    input.click();
  }

  handleDrop(e) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      this.handleFile(file);
    }
  }

  handleFile(file) {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      this.uploadArea.innerHTML = `
                <img src="${e.target.result}" alt="上传的图片" style="max-width: 100%; max-height: 100%; object-fit: contain;">
            `;
    };
    reader.readAsDataURL(file);
  }
}

// 收藏和下载功能
function handleFavorite(btn) {
  const icon = btn.querySelector("i");
  if (icon.classList.contains("ri-heart-line")) {
    icon.classList.replace("ri-heart-line", "ri-heart-fill");
    icon.style.color = "#ff4757";
  } else {
    icon.classList.replace("ri-heart-fill", "ri-heart-line");
    icon.style.color = "";
  }
}

function handleDownload(imageUrl) {
  const link = document.createElement("a");
  link.href = imageUrl;
  link.download = `generated-image-${Date.now()}.jpg`;
  link.click();
}

// 等待DOM加载完成后初始化
document.addEventListener("DOMContentLoaded", () => {
  const controller = new ImageGenerationController();
});
