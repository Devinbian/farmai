// AI对话模块 - 包含聊天功能

export function initChat() {
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
            if (
              !e.target.closest(".chat-actions") &&
              !e.target.closest(".chat-action-btn")
            ) {
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
