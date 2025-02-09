import { config } from '../../js/config.js';

export function createBanner() {
    return `
        <div class="banner">
            <div class="leftbanner">
                <img src="${config.BASE_URL}/images/DM_20250206145800_004.png" alt="banner" class="banner-img">
                <img src="${config.BASE_URL}/images/DM_20250206145800_007.svg" alt="banner" class="banner-overlay">
            </div>
            <div class="rightbanner">
                <img src="${config.BASE_URL}/images/DM_20250206145800_005.png" alt="banner" class="banner-img">
                <a href="${config.BASE_URL}/cases.html" class="banner-btn">
                    <img src="${config.BASE_URL}/images/fire.svg" alt="fire" class="fire-icon">
                    智慧微农场出镜回顾 <span class="material-icons">arrow_forward</span>
                </a>
            </div>
        </div>
    `;
} 