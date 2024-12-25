import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'
import UserActionTracker from './index.js'

document.querySelector('#app').innerHTML = `
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
      <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
    </a>
    <h1>Hello Vite!</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite logo to learn more
    </p>
  </div>
`

setupCounter(document.querySelector('#counter'))

// 添加控制按钮
const controlsHtml = `
  <div class="controls">
    <button id="startTracking">开始跟踪</button>
    <button id="stopTracking">停止跟踪</button>
    <button id="showResults">显示结果</button>
    <div id="output"></div>
  </div>
`
document.body.insertAdjacentHTML('beforeend', controlsHtml)

// 初始化 UserActionTracker
const tracker = new UserActionTracker({
  target: document.querySelector('#app > div'),  // 监听最外层 div
  throttleInterval: 100
})

// 手动绑定按钮事件
document.querySelector('#startTracking').addEventListener('click', () => {
  tracker.start();
  document.querySelector('#output').textContent = '开始跟踪...';
});

document.querySelector('#stopTracking').addEventListener('click', () => {
  tracker.stop();
  const events = tracker.getEvents();
  document.querySelector('#output').textContent = '停止跟踪. 记录了 ' + events.length + ' 个事件';
});

document.querySelector('#showResults').addEventListener('click', () => {
  const events = tracker.getEvents();
  console.log('--- 行为记录信息 ---');
  events.forEach((event, index) => {
    const [x, y, timeGap, type] = event.split(',');
    console.log(`${index + 1}. ${type === 'c' ? '点击' : '移动'} - 坐标(${x}, ${y}), 时间间隔: ${timeGap}ms`);
    // 以原始格式输出 CSV
    console.log('\n--- CSV 格式输出 ---');
    console.log(events.join('\n'));
  });
});
