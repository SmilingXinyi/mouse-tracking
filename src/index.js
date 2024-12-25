// src/index.js

class UserActionTracker {
    /**
     * 构造函数
     * @param {Object} options - 配置选项
     * @param {HTMLElement | HTMLElement[]} options.target - 需要监听的 DOM 元素或元素数组
     * @param {number} options.throttleInterval - 鼠标移动事件的节流间隔（毫秒）
     */
    constructor(options = {}) {
        this.events = [];
        this.isTracking = false;
        this.lastTime = null;

        // 绑定方法以确保正确的 'this' 上下文
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleClick = this.handleClick.bind(this);

        // 管理监听目标节点
        this.targets = Array.isArray(options.target) ? options.target : [options.target];
        this.throttleInterval = options.throttleInterval || 100; // 默认节流间隔为100ms
        this.lastMoveTime = 0;
    }

    /**
     * 开始跟踪
     */
    start() {
        if (this.isTracking) return;

        this.isTracking = true;
        this.events = [];
        this.lastTime = Date.now();

        // 添加事件监听器到所有目标节点
        this.targets.forEach(target => {
            target.addEventListener('mousemove', this.handleMouseMove);
            target.addEventListener('click', this.handleClick);
        });
    }

    /**
     * 停止跟踪
     */
    stop() {
        if (!this.isTracking) return;

        this.isTracking = false;

        // 移除事件监听器从所有目标节点
        this.targets.forEach(target => {
            target.removeEventListener('mousemove', this.handleMouseMove);
            target.removeEventListener('click', this.handleClick);
        });
    }

    /**
     * 销毁追踪器，彻底移除所有事件监听器
     */
    destroy() {
        this.stop();
        this.targets = [];
    }

    /**
     * 节流函数
     * @param {Function} func - 需要节流的函数
     * @param {number} limit - 节流间隔（毫秒）
     * @returns {Function}
     */
    throttle(func, limit) {
        return (...args) => {
            const now = Date.now();
            if (now - this.lastMoveTime >= limit) {
                this.lastMoveTime = now;
                func.apply(this, args);
            }
        };
    }

    /**
     * 处理鼠标移动事件
     * @param {MouseEvent} event
     */
    handleMouseMove(event) {
        console.log('鼠标移动:', event.clientX, event.clientY);
        const throttledHandle = this.throttle(() => {
            const currentTime = Date.now();
            const timeGap = currentTime - this.lastTime;
            this.lastTime = currentTime;

            const record = `${event.clientX},${event.clientY},${timeGap},`;
            this.events.push(record);
            console.log('记录事件:', record);
        }, this.throttleInterval);

        throttledHandle();
    }

    /**
     * 处理鼠标点击事件
     * @param {MouseEvent} event
     */
    handleClick(event) {
        console.log('鼠标点击:', event.clientX, event.clientY);
        // 仅跟踪左键点击 (button === 0)
        if (event.button !== 0) return;

        const currentTime = Date.now();
        const timeGap = currentTime - this.lastTime;
        this.lastTime = currentTime;

        const record = `${event.clientX},${event.clientY},${timeGap},c`;
        this.events.push(record);
        console.log('记录点击事件:', record);
    }

    /**
     * 获取记录的事件
     * @returns {string[]}
     */
    getEvents() {
        return this.events;
    }

    /**
     * 清除记录的事件
     */
    clearEvents() {
        this.events = [];
    }
}

export default UserActionTracker;
