document.addEventListener('DOMContentLoaded', function () {
    // 确保在使用前注册插件
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }
    
    // 添加触摸事件处理
    document.querySelectorAll('.sub-card').forEach(card => {
        // 获取卡片的目标链接
        const url = card.getAttribute('onclick')?.match(/'([^']+)'/)?.[1];
        if (!url) return;
        
        // 移除 onclick 属性，改用事件监听
        card.removeAttribute('onclick');
        
        // 创建统一的点击处理函数
        const handleClick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            window.open(url, '_blank');
        };

        // 添加点击和触摸事件监听
        card.addEventListener('click', handleClick);
        
        // 处理移动端触摸
        let touchStartTime;
        let touchStartY;
        let isTouchMoved = false;

        card.addEventListener('touchstart', (e) => {
            touchStartTime = Date.now();
            touchStartY = e.touches[0].clientY;
            isTouchMoved = false;
        });

        card.addEventListener('touchmove', () => {
            isTouchMoved = true;
        });

        card.addEventListener('touchend', (e) => {
            const touchEndY = e.changedTouches[0].clientY;
            const touchDuration = Date.now() - touchStartTime;
            const yDiff = Math.abs(touchEndY - touchStartY);

            // 如果触摸时间短，移动距离小，则认为是点击
            if (!isTouchMoved && touchDuration < 300 && yDiff < 10) {
                handleClick(e);
            }
        });
    });
}); 