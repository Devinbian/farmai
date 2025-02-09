// 导入GSAP
import { gsap } from "https://cdn.skypack.dev/gsap";

export function initializeCardInteractions(containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  const cards = container.querySelectorAll(".sub-card");
  const cardsContainer = container.querySelector(".feature-cards");

  function isMobile() {
    return window.innerWidth <= 768;
  }

  // 初始化按钮hover动画
  function initializeButtonHoverAnimations() {
    if (isMobile()) return;

    const buttons = container.querySelectorAll(".try-btn");
    buttons.forEach((btn) => {
      const btnIcon = btn.querySelector(".btn-icon");
      if (!btnIcon) return;

      btn.addEventListener("mouseenter", () => {
        gsap.to(btnIcon, {
          x: 4,
          duration: 0.3,
          ease: "power2.out",
          onComplete: () => {
            // 动画完成后重置transform
            gsap.set(btnIcon, {
              clearProps: "all",
            });
            // 立即设置新位置
            gsap.set(btnIcon, {
              x: 4,
            });
          },
        });
      });

      btn.addEventListener("mouseleave", () => {
        gsap.to(btnIcon, {
          x: 0,
          duration: 0.3,
          ease: "power2.in",
          onComplete: () => {
            // 动画完成后重置所有属性
            gsap.set(btnIcon, {
              clearProps: "all",
            });
          },
        });
      });
    });
  }

  // 初始化按钮动画
  initializeButtonHoverAnimations();

  cards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      if (!isMobile()) {
        // 移除其他卡片的激活状态
        cards.forEach((c) => {
          if (c !== this) {
            c.classList.remove("active");
            // 恢复其他卡片的按钮状态和图标状态
            const otherBtn = c.querySelector(".try-btn");
            const otherIcon = c.querySelector(".card-icon");
            if (otherBtn) {
              gsap.to(otherBtn, {
                width: "48px",
                duration: 0.3,
                ease: "power2.in",
              });
            }
            if (otherIcon) {
              gsap.to(otherIcon, {
                scale: 1,
                bottom: "-6px",
                right: "-21px",
                duration: 0.3,
                ease: "power2.in",
              });
            }
          }
        });

        // 激活当前卡片
        this.classList.add("active");
        cardsContainer.classList.add("has-active");

        // 添加图标和按钮动画
        const icon = this.querySelector(".card-icon");
        const btn = this.querySelector(".try-btn");
        if (icon) {
          gsap.to(icon, {
            scale: 1.8,
            bottom: "35%",
            right: "48px",
            duration: 0.3,
            ease: "power2.out",
          });
        }
        if (btn) {
          gsap.to(btn, {
            width: "160px",
            duration: 0.3,
            ease: "power2.out",
          });
        }
      }
    });

    card.addEventListener("mouseleave", function () {
      if (!isMobile()) {
        // 只恢复图标动画，不恢复按钮状态
        const icon = this.querySelector(".card-icon");
        if (icon && !this.classList.contains("active")) {
          gsap.to(icon, {
            scale: 1,
            bottom: "-6px",
            right: "-21px",
            duration: 0.3,
            ease: "power2.in",
          });
        }
      }
    });

    card.addEventListener("dblclick", function (e) {
      if (!isMobile()) {
        e.preventDefault();
        // 移除所有卡片的激活状态
        cards.forEach((c) => {
          c.classList.remove("active");
          // 恢复所有按钮状态和图标状态
          const btn = c.querySelector(".try-btn");
          const icon = c.querySelector(".card-icon");
          if (btn) {
            gsap.to(btn, {
              width: "24px",
              duration: 0.3,
              ease: "power2.in",
            });
          }
          if (icon) {
            gsap.to(icon, {
              scale: 1,
              bottom: "-6px",
              right: "-21px",
              duration: 0.3,
              ease: "power2.in",
            });
          }
        });
        cardsContainer.classList.remove("has-active");
      }
    });
  });

  // 监听窗口大小变化
  window.addEventListener("resize", function () {
    if (isMobile()) {
      cards.forEach((c) => {
        c.classList.remove("active");
        const icon = c.querySelector(".card-icon");
        const btn = c.querySelector(".try-btn");
        if (icon) {
          gsap.set(icon, { scale: 1 });
        }
        if (btn) {
          gsap.set(btn, { width: "24px" });
        }
      });
      cardsContainer.classList.remove("has-active");
    }
  });

  // 默认激活第一个卡片（在PC端）
  if (!isMobile() && cards.length > 0) {
    const firstCard = cards[0];
    firstCard.classList.add("active");
    cardsContainer.classList.add("has-active");
    const icon = firstCard.querySelector(".card-icon");
    const btn = firstCard.querySelector(".try-btn");
    if (icon) {
      gsap.set(icon, { scale: 1.8 });
    }
    if (btn) {
      gsap.set(btn, { width: "160px" });
    }
  } else if (isMobile()) {
    // 在移动端初始化时设置按钮宽度
    cards.forEach((c) => {
      const btn = c.querySelector(".try-btn");
      if (btn) {
        gsap.set(btn, { width: "24px" });
      }
    });
  }
}
