document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initChat();
  initImageGeneration();
  initVideoGeneration();
  initBatchOperations();
  initSidebarToggle();
});

function initNavigation() {
  const navLinks = document.querySelectorAll(".ai-nav a");
  const sections = document.querySelectorAll(".ai-section");
  const navGroups = document.querySelectorAll(".nav-group");

  // 设置一级菜单展开/折叠功能
  navGroups.forEach((group) => {
    const title = group.querySelector(".nav-group-title");
    
    title.addEventListener("click", () => {
      group.classList.toggle("collapsed");
    });
  });

  // 设置链接点击处理
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href").substring(1);

      navLinks.forEach((l) => l.classList.remove("active"));
      link.classList.add("active");

      sections.forEach((section) => {
        section.classList.remove("active");
        if (section.id === targetId) {
          section.classList.add("active");
        }
      });
    });
  });
}

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

  let chats = [];
  let currentChatId = null;

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

  function initHistoryToggle() {
    const historyToggleBtn = document.querySelector(".history-toggle-btn");
    const chatHistory = document.querySelector(".chat-history");

    if (!historyToggleBtn || !chatHistory) {
      console.warn("历史列表或切换按钮未找到");
      return;
    }

    historyToggleBtn.addEventListener("click", () => {
      chatSidebar.classList.toggle("collapsed");
      localStorage.setItem(
        "chatSidebarCollapsed",
        chatSidebar.classList.contains("collapsed"),
      );
    });

    const isCollapsed = localStorage.getItem("chatSidebarCollapsed") === "true";
    if (isCollapsed) {
      chatSidebar.classList.add("collapsed");
    }
  }

  function createNewChat() {
    const chatId = Date.now().toString();
    const chat = {
      id: chatId,
      title: "新对话",
      messages: [],
      createdAt: new Date(),
      isFavorite: false,
    };
    chats.unshift(chat);
    currentChatId = chatId;
    updateChatUI(chat);
    updateHistoryList();

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

  function updateChatUI(chat) {
    currentChatTitle.textContent = chat.title || "新对话";
    chatMessages.innerHTML = "";
    chat.messages.forEach((message) => {
      addMessage(message.type, message.content, message.timestamp);
    });
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function updateHistoryList() {
    const historyList = document.getElementById("chatHistoryList");
    if (!historyList) return;

    historyList.innerHTML = "";
    const groups = getChatGroups();

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

          historyItem.addEventListener("click", (e) => {
            if (!e.target.closest(".chat-actions") && 
                !e.target.closest(".chat-action-btn")) {
              currentChatId = chat.id;
              updateChatUI(chat);
              updateHistoryList();
            }
          });

          const favoriteBtn = historyItem.querySelector(".favorite-btn");
          favoriteBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            chat.isFavorite = !chat.isFavorite;
            updateHistoryList();
          });

          groupDiv.appendChild(historyItem);
        });

        historyList.appendChild(groupDiv);
      }
    });
  }

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

  async function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    if (!currentChatId) {
      createNewChat();
    }

    const currentChat = chats.find((chat) => chat.id === currentChatId);

    const userMessage = {
      type: "user",
      content: message,
      timestamp: new Date(),
    };
    currentChat.messages.push(userMessage);
    addMessage("user", message);

    if (!currentChat.title || currentChat.title === "新对话") {
      currentChat.title =
        message.length > 20 ? message.slice(0, 20) + "..." : message;
      currentChatTitle.textContent = currentChat.title;
      updateHistoryList();
    }

    chatInput.value = "";
    chatInput.style.height = "auto";

    try {
      const response = await mockAIResponse(message);

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

  function applySuggestion(question) {
    chatInput.value = question;
    chatInput.style.height = "auto";
    chatInput.style.height = chatInput.scrollHeight + "px";
    chatInput.focus();
  }

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

  function initEvents() {
    newChatBtn.addEventListener("click", createNewChat);
    sendButton.addEventListener("click", sendMessage);
    clearChatBtn.addEventListener("click", clearCurrentChat);
    exportChatBtn.addEventListener("click", exportChat);

    if (renameChatBtn) {
      renameChatBtn.addEventListener("click", () => {
        if (currentChatId) {
          renameChat(currentChatId);
        }
      });
    }

    chatInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    chatInput.addEventListener("input", () => {
      chatInput.style.height = "auto";
      chatInput.style.height = chatInput.scrollHeight + "px";
    });
  }

  function init() {
    generateMockData();
    initHistoryToggle();
    initEvents();
    updateHistoryList();
    if (!currentChatId && chats.length === 0) {
      createNewChat();
    } else if (chats.length > 0) {
      currentChatId = chats[0].id;
      updateChatUI(chats[0]);
    }
  }

  window.renameChat = renameChat;
  window.deleteChat = deleteChat;
  window.applySuggestion = applySuggestion;

  init();
}

function initImageGeneration() {
  const imagePrompt = document.getElementById("imagePrompt");
  const generateButton = document.getElementById("generateImage");
  const suggestionTags = document.querySelectorAll(".tag");

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

  generateButton.addEventListener("click", async () => {
    const prompt = imagePrompt.value.trim();

    if (!prompt) {
      alert("请输入创作描述");
      return;
    }

    generateButton.disabled = true;
    generateButton.innerHTML = '<i class="ri-loader-4-line"></i>创作中...';

    try {
      const imageUrl = await mockImageGeneration(prompt, "");

      const imageCard = document.createElement("div");
      imageCard.className = "image-card";
    } catch (error) {
      alert("创作失败，请稍后重试");
    } finally {
      generateButton.disabled = false;
      generateButton.innerHTML = '<i class="ri-magic-line"></i>开始创作';
    }
  });

  async function mockImageGeneration(prompt, style) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return "https://imgapi.cn/api.php?zd=mobile&fl=meizi&gs=images";
  }
}

function initVideoGeneration() {
  const videoPrompt = document.getElementById("videoPrompt");
  const videoStyle = document.getElementById("videoStyle");
  const generateButton = document.getElementById("generateVideo");
  const videoPreview = document.getElementById("videoPreview");

  generateButton.addEventListener("click", async () => {
    const prompt = videoPrompt.value.trim();

    if (!prompt) {
      alert("请输入视频描述");
      return;
    }

    generateButton.disabled = true;
    generateButton.textContent = "生成中...";

    try {
      const videoUrl = await mockVideoGeneration(prompt);

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

  async function mockVideoGeneration(prompt) {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    return "https://example.com/sample-video.mp4";
  }
}

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

    // 初始化历史区域为空状态
    const treeViewList = document.getElementById("treeViewList");
    const gridViewList = document.getElementById("gridViewList");

    if (treeViewList) {
      treeViewList.innerHTML = `
        <div class="history-empty-state">
          <div class="empty-icon">
            <i class="ri-image-2-line"></i>
          </div>
          <p class="empty-text">暂无生成记录</p>
        </div>
      `;
    }

    if (gridViewList) {
      gridViewList.innerHTML = `
        <div class="history-empty-state">
          <div class="empty-icon">
            <i class="ri-image-2-line"></i>
          </div>
          <p class="empty-text">暂无生成记录</p>
        </div>
      `;
    }
  }

  initElements() {
    this.prompt = document.querySelector(".prompt-input textarea");
    this.generateBtn = document.querySelector(".primary-btn");
    this.previewArea = document.querySelector(".preview-area");
    this.emptyPreview = document.querySelector(".empty-preview");
    this.previewGrid = document.querySelector(".preview-grid");
    this.generateCount = document.querySelector(".number-input input");
    this.uploadArea = document.querySelector(".upload-area");
    this.imageHistory = document.querySelector(".image-history");
    this.historyToggleBtn = document.querySelector(".toggle-btn");

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
    const elements = {
      prompt: this.prompt,
      generateBtn: this.generateBtn,
      previewArea: this.previewArea,
      previewGrid: this.previewGrid,
      generateCount: this.generateCount,
      imageHistory: this.imageHistory,
      historyToggleBtn: this.historyToggleBtn,
    };

    Object.entries(elements).forEach(([name, element]) => {
      if (!element) {
        console.warn(`Missing element: ${name}`);
      }
    });

    return Object.values(elements).every((element) => element !== null);
  }

  bindEvents() {
    this.generateBtn.addEventListener("click", () => this.handleGenerate());

    const minusBtn = document.querySelector(".number-btn.minus");
    const plusBtn = document.querySelector(".number-btn.plus");
    if (minusBtn && plusBtn) {
      minusBtn.addEventListener("click", () => this.updateCount(-1));
      plusBtn.addEventListener("click", () => this.updateCount(1));
    }
    if (this.generateCount) {
      this.generateCount.addEventListener("change", () => this.validateCount());
    }

    const ratioButtons = document.querySelectorAll(".ratio-btn");
    ratioButtons.forEach((btn) => {
      btn.addEventListener("click", () => this.handleRatioChange(btn));
    });

    if (this.historyToggleBtn) {
      this.historyToggleBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.toggleHistory();
      });
    }

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

    this.emptyPreview.style.display = "none";
    this.previewGrid.style.display = "grid";
    this.previewGrid.setAttribute("data-count", this.currentCount);

    this.previewGrid.innerHTML = "";

    for (let i = 0; i < this.currentCount; i++) {
      this.previewGrid.appendChild(this.createGeneratingItem());
    }

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

    this.previewGrid.innerHTML = "";

    const demoImages = [
      "https://imgapi.cn/api.php?zd=mobile&fl=meizi&gs=images",
      "https://imgapi.cn/api.php?zd=mobile&fl=meizi&gs=images",
      "https://imgapi.cn/api.php?zd=mobile&fl=meizi&gs=images",
      "https://imgapi.cn/api.php?zd=mobile&fl=meizi&gs=images",
    ];

    const now = new Date();
    const timeString = `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;

    // 生成所有图片URL
    const generatedImages = [];
    for (let i = 0; i < this.currentCount; i++) {
      const imageUrl =
        demoImages[i] ||
        `https://imgapi.cn/api.php?zd=mobile&fl=meizi&gs=images`;
      generatedImages.push(imageUrl);

      // 添加到预览区
      this.previewGrid.appendChild(this.createImageItem(imageUrl));
    }

    // 创建层级视图的图片组
    const historyGroup = document.createElement("div");
    historyGroup.className = "history-group";
    historyGroup.innerHTML = `
      <img src="${generatedImages[0]}" alt="组预览图片">
      <div class="image-actions">
        <button class="image-action-btn" title="收藏" onclick="handleFavorite(this)">
          <i class="ri-heart-line"></i>
        </button>
      </div>
      <div class="group-count">${this.currentCount}张</div>
    `;

    // 添加到层级视图
    const treeViewList = document.getElementById("treeViewList");
    const emptyState = treeViewList.querySelector(".history-empty-state");
    if (emptyState) {
      emptyState.remove();
    }
    treeViewList.insertBefore(historyGroup, treeViewList.firstChild);

    // 添加到平铺视图
    const gridViewList = document.getElementById("gridViewList");
    generatedImages.forEach((imageUrl) => {
      const historyItem = document.createElement("div");
      historyItem.className = "history-item";
      historyItem.innerHTML = `
        <img src="${imageUrl}" alt="生成图片">
        <div class="image-actions">
          <button class="image-action-btn" title="收藏" onclick="handleFavorite(this)">
            <i class="ri-heart-line"></i>
          </button>
        </div>
      `;
      const gridEmptyState = gridViewList.querySelector(".history-empty-state");
      if (gridEmptyState) {
        gridEmptyState.remove();
      }
      gridViewList.insertBefore(historyItem, gridViewList.firstChild);
    });
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

// 收藏操作函数
function handleFavorite(btn) {
  const iconEl = btn.querySelector('i');
  if (iconEl.classList.contains('ri-heart-line')) {
    iconEl.classList.remove('ri-heart-line');
    iconEl.classList.add('ri-heart-fill');
    btn.setAttribute('data-favorited', 'true');
  } else {
    iconEl.classList.remove('ri-heart-fill');
    iconEl.classList.add('ri-heart-line');
    btn.setAttribute('data-favorited', 'false');
  }
}

function handleDownload(imageUrl) {
  const link = document.createElement("a");
  link.href = imageUrl;
  link.download = `generated-image-${Date.now()}.jpg`;
  link.click();
}

document.addEventListener("DOMContentLoaded", () => {
  const controller = new ImageGenerationController();
});

// 视图切换功能
document.addEventListener('DOMContentLoaded', function() {
    const viewButtons = document.querySelectorAll('.view-btn');
    const treeView = document.getElementById('treeViewList');
    const gridView = document.getElementById('gridViewList');

    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 移除所有按钮的active类
            viewButtons.forEach(btn => btn.classList.remove('active'));
            // 给当前点击的按钮添加active类
            this.classList.add('active');

            // 根据按钮的data-view属性切换视图
            const viewType = this.getAttribute('data-view');
            if (viewType === 'tree') {
                treeView.style.display = 'flex';
                gridView.style.display = 'none';
            } else {
                treeView.style.display = 'none';
                gridView.style.display = 'flex';
            }
        });
    });
});

function initBatchOperations() {
  // 获取批量按钮和历史区域DOM元素
  const batchBtn = document.querySelector('.batch-btn');
  const imageHistory = document.querySelector('.image-history');
  const historyContent = document.querySelector('.history-content');
  
  // 检查批量按钮是否存在
  if (!batchBtn) return;
  
  // 初始化批量操作栏
  let batchActionsBar = document.createElement('div');
  batchActionsBar.className = 'batch-actions-bar';
  batchActionsBar.innerHTML = `
    <div class="batch-info">已选择 <span class="selected-count">0</span> 项</div>
    <div class="batch-buttons">
      <button class="batch-action-btn favorite-btn">
        <i class="ri-heart-line"></i>
        <span>收藏</span>
      </button>
      <button class="batch-action-btn download-btn">
        <i class="ri-download-line"></i>
        <span>下载</span>
      </button>
      <button class="batch-action-btn delete-btn">
        <i class="ri-delete-bin-line"></i>
        <span>删除</span>
      </button>
    </div>
  `;
  
  // 将批量操作栏添加到历史区域
  imageHistory.appendChild(batchActionsBar);
  
  // 为图片项添加复选框
  function addCheckboxesToItems() {
    // 处理层级视图中的图片组
    document.querySelectorAll('.history-group').forEach(group => {
      if (!group.querySelector('.checkbox-container')) {
        const checkboxContainer = document.createElement('div');
        checkboxContainer.className = 'checkbox-container';
        checkboxContainer.innerHTML = `
          <div class="custom-checkbox">
            <i class="ri-check-line"></i>
          </div>
        `;
        group.appendChild(checkboxContainer);
        
        // 添加点击事件
        checkboxContainer.addEventListener('click', (e) => {
          e.stopPropagation();
          toggleCheckbox(checkboxContainer.querySelector('.custom-checkbox'));
          updateSelectedCount();
        });
      }
    });
    
    // 处理平铺视图中的图片项
    document.querySelectorAll('.history-item').forEach(item => {
      if (!item.querySelector('.checkbox-container')) {
        const checkboxContainer = document.createElement('div');
        checkboxContainer.className = 'checkbox-container';
        checkboxContainer.innerHTML = `
          <div class="custom-checkbox">
            <i class="ri-check-line"></i>
          </div>
        `;
        item.appendChild(checkboxContainer);
        
        // 添加点击事件
        checkboxContainer.addEventListener('click', (e) => {
          e.stopPropagation();
          toggleCheckbox(checkboxContainer.querySelector('.custom-checkbox'));
          updateSelectedCount();
        });
      }
    });
  }
  
  // 切换复选框状态
  function toggleCheckbox(checkbox) {
    checkbox.classList.toggle('checked');
  }
  
  // 更新已选择项计数
  function updateSelectedCount() {
    const checkedBoxes = document.querySelectorAll('.custom-checkbox.checked');
    document.querySelector('.selected-count').textContent = checkedBoxes.length;
  }
  
  // 添加批量按钮点击事件
  batchBtn.addEventListener('click', () => {
    // 切换批量按钮激活状态
    batchBtn.classList.toggle('active');
    
    // 切换批量模式
    if (imageHistory.classList.toggle('batch-mode')) {
      // 进入批量模式
      addCheckboxesToItems();
      
      // 更新选中计数
      updateSelectedCount();
    } else {
      // 退出批量模式，清除所有选中状态
      document.querySelectorAll('.custom-checkbox').forEach(checkbox => {
        checkbox.classList.remove('checked');
      });
      updateSelectedCount();
    }
  });
  
  // 为批量操作按钮添加事件监听
  const favoriteBtn = batchActionsBar.querySelector('.favorite-btn');
  const downloadBtn = batchActionsBar.querySelector('.download-btn');
  const deleteBtn = batchActionsBar.querySelector('.delete-btn');
  
  favoriteBtn.addEventListener('click', () => {
    const selectedItems = getSelectedItems();
    // 添加收藏功能
    selectedItems.forEach(item => {
      const favoriteBtn = item.querySelector('.image-action-btn[title="收藏"]');
      if (favoriteBtn) {
        handleFavorite(favoriteBtn);
      }
    });
  });
  
  downloadBtn.addEventListener('click', () => {
    const selectedItems = getSelectedItems();
    // 下载选择的图片
    selectedItems.forEach(item => {
      const imgSrc = item.querySelector('img').src;
      const link = document.createElement('a');
      link.href = imgSrc;
      link.download = 'image-' + Date.now() + '.jpg';
      link.click();
    });
  });
  
  deleteBtn.addEventListener('click', () => {
    const selectedItems = getSelectedItems();
    // 删除选择的图片
    selectedItems.forEach(item => {
      item.remove();
    });
    // 更新计数
    updateSelectedCount();
    
    // 检查是否需要显示空状态
    const treeViewList = document.getElementById('treeViewList');
    const gridViewList = document.getElementById('gridViewList');
    
    if (treeViewList && treeViewList.querySelectorAll('.history-group').length === 0) {
      treeViewList.innerHTML = `
        <div class="history-empty-state">
          <div class="empty-icon">
            <i class="ri-image-2-line"></i>
          </div>
          <p class="empty-text">暂无生成记录</p>
        </div>
      `;
    }
    
    if (gridViewList && gridViewList.querySelectorAll('.history-item').length === 0) {
      gridViewList.innerHTML = `
        <div class="history-empty-state">
          <div class="empty-icon">
            <i class="ri-image-2-line"></i>
          </div>
          <p class="empty-text">暂无生成记录</p>
        </div>
      `;
    }
  });
  
  // 获取所有已选择的项
  function getSelectedItems() {
    const checkedBoxes = Array.from(document.querySelectorAll('.custom-checkbox.checked'));
    return checkedBoxes.map(checkbox => checkbox.closest('.history-group') || checkbox.closest('.history-item'));
  }
  
  // 当生成新图片时，为新元素添加复选框
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        if (imageHistory.classList.contains('batch-mode')) {
          addCheckboxesToItems();
        }
      }
    });
  });
  
  // 监视树形视图和网格视图的变化
  const treeViewList = document.getElementById('treeViewList');
  const gridViewList = document.getElementById('gridViewList');
  
  if (treeViewList) {
    observer.observe(treeViewList, { childList: true });
  }
  
  if (gridViewList) {
    observer.observe(gridViewList, { childList: true });
  }
}

function initSidebarToggle() {
  const sidebar = document.querySelector('.ai-sidebar');
  const toggleBtn = document.querySelector('.sidebar-toggle-btn');
  
  if (!sidebar || !toggleBtn) return;
  
  // 添加点击事件
  toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    
    // 切换图标
    const icon = toggleBtn.querySelector('i');
    if (icon) {
      if (sidebar.classList.contains('collapsed')) {
        icon.classList.replace('ri-menu-fold-line', 'ri-menu-unfold-line');
      } else {
        icon.classList.replace('ri-menu-unfold-line', 'ri-menu-fold-line');
      }
    }
    
    // 保存当前状态到localStorage
    localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
  });
  
  // 页面加载时恢复状态
  const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
  if (isCollapsed) {
    sidebar.classList.add('collapsed');
    // 恢复图标状态
    const icon = toggleBtn.querySelector('i');
    if (icon) {
      icon.classList.replace('ri-menu-fold-line', 'ri-menu-unfold-line');
    }
  }
}
