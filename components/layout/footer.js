export function createFooter() {
  return `
    <footer class="footer">
        <div class="footer-container">
            <div class="footer-section">
                <h4>服务条款</h4>
                <ul>
                    <li><a href="#">用户协议</a></li>
                    <li><a href="#">隐私政策</a></li>
                </ul>
            </div>
            <div class="footer-section">
                <h4>支持与服务</h4>
                <ul>
                    <li><a href="#">反馈意见</a></li>
                    <li><a href="#">文档</a></li>
                </ul>
            </div>
            <div class="footer-section">
                <h4>关注我们</h4>
                <ul>
                    <li><a href="#">掘金社区</a></li>
                    <li class="wechat-item">
                        <a href="javascript:void(0);">
                            <span class="material-icons">wechat</span>
                            微信公众号
                        </a>
                        <div class="wechat-qr">
                            <img src="images/wechat/qrcode_for_tansensor.jpg" alt="微信公众号二维码">
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <div class="footer-bottom">
            <p>© 智慧微农场 Smart Mini-farm 版权所有 </p>
            <p>苏州碳感科技有限公司 | biz@datatellit.com</p>
        </div>
    </footer>
    `;
}
