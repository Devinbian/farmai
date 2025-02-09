// 移除 GSAP 的导入，使用全局的 GSAP
// import { gsap } from "https://cdn.skypack.dev/gsap";
// import { ScrollTrigger } from "https://cdn.skypack.dev/gsap/ScrollTrigger";

export function initializeScrollAnimations() {
  // 确保使用全局的 GSAP
  gsap.registerPlugin(ScrollTrigger);

  // 初始化所有section的动画
  const sections = document.querySelectorAll(".camp-section");
  sections.forEach((section) => {
    // 标题和描述的动画
    const header = section.querySelector(".feature-header");
    if (header) {
      gsap.from(header, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        scrollTrigger: {
          trigger: header,
          start: "top bottom-=100",
          toggleActions: "play none none reverse",
        },
      });
    }

    // 卡片的动画 - 只使用淡入效果，最后一个卡片除外
    const cards = section.querySelectorAll(".sub-card");
    cards.forEach((card, index) => {
      // 跳过最后一个卡片的动画
      if (index === cards.length - 1) return;

      gsap.from(card, {
        opacity: 0,
        duration: 0.8,
        delay: index * 0.1,
        scrollTrigger: {
          trigger: card,
          start: "top bottom-=50",
          toggleActions: "play none none reverse",
        },
      });
    });
  });
}

export function initializeBannerAnimations() {
  // Banner图片动画
  const bannerImages = document.querySelectorAll(".banner img");
  bannerImages.forEach((img) => {
    gsap.from(img, {
      opacity: 0,
      scale: 1.1,
      duration: 1,
      ease: "power2.out",
    });
  });

  // Banner按钮动画
  const bannerBtn = document.querySelector(".banner-btn");
  if (bannerBtn) {
    gsap.from(bannerBtn, {
      y: 20,
      duration: 0.8,
      delay: 0.5,
      ease: "back.out(1.7)",
    });

    // 添加hover动画
    bannerBtn.addEventListener("mouseenter", () => {
      gsap.to(bannerBtn, {
        rotation: -20,
        x: -2,
        y: -2,
        backgroundColor: "rgba(0, 0, 0, 1)",
        boxShadow: "2px 4px 16px rgba(0, 0, 0, 0.25)",
        duration: 0.3,
        ease: "power2.out",
      });

      // 箭头动画
      const arrow = bannerBtn.querySelector(".material-icons");
      if (arrow) {
        gsap.to(arrow, {
          x: 4,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    });

    bannerBtn.addEventListener("mouseleave", () => {
      gsap.to(bannerBtn, {
        rotation: 0,
        x: 0,
        y: 0,
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
        duration: 0.3,
        ease: "power2.in",
      });

      // 箭头动画
      const arrow = bannerBtn.querySelector(".material-icons");
      if (arrow) {
        gsap.to(arrow, {
          x: 0,
          duration: 0.3,
          ease: "power2.in",
        });
      }
    });
  }
}

export function initializeHoverAnimations() {
  // 卡片悬停动画
  const cards = document.querySelectorAll(".sub-card");
  cards.forEach((card) => {
    const icon = card.querySelector(".card-icon");
    const btn = card.querySelector(".try-btn");

    card.addEventListener("mouseenter", () => {
      if (icon) {
        gsap.to(icon, {
          scale: 1.8,
          duration: 0.3,
          ease: "power2.out",
        });
      }
      if (btn) {
        gsap.to(btn, {
          x: 5,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    });

    card.addEventListener("mouseleave", () => {
      if (icon) {
        gsap.to(icon, {
          scale: 1.8,
          duration: 0.3,
          ease: "power2.in",
        });
      }
      if (btn) {
        gsap.to(btn, {
          x: 0,
          duration: 0.3,
          ease: "power2.in",
        });
      }
    });
  });
}
