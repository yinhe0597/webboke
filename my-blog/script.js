// 导入权限管理模块
import { ROLES, currentUser, checkPermission, initPagePermissions, initVisitorCount } from './auth.js';

// 初始化页面
function initPage() {
  // 初始化权限和访客统计
  initPagePermissions();
  initVisitorCount();
  
  // 加载文章数据
  loadArticles();
  
  // 设置事件监听
  setupEventListeners();
  
  // 根据权限调整界面
  adjustUIForPermissions();
  
  // 初始化主题选择器
  initThemePicker();
}

// 初始化主题选择器
function initThemePicker() {
  const colorPicker = document.getElementById('color-picker');
  const gradientPicker = document.getElementById('gradient-picker');
  const themePreview = document.getElementById('theme-preview');
  
  // 初始化色盘
  const pickr = Pickr.create({
    el: colorPicker,
    theme: 'classic',
    default: '#4a90e2',
    swatches: [
      '#4a90e2', '#50e3c2', '#b8e986', '#f8e71c',
      '#f5a623', '#d0021b', '#bd10e0', '#9013fe'
    ],
    components: {
      preview: true,
      opacity: true,
      hue: true,
      interaction: {
        hex: true,
        rgba: true,
        hsla: true,
        input: true,
        save: true
      }
    }
  });

  // 颜色选择事件
  pickr.on('save', (color) => {
    const hexColor = color.toHEXA().toString();
    applyCustomTheme(hexColor);
  });

  // 渐变选择事件
  gradientPicker.addEventListener('change', function() {
    const gradient = this.value;
    applyGradientTheme(gradient);
  });

  // 高级灰选项
  const grayScaleBtn = document.getElementById('gray-scale');
  grayScaleBtn.addEventListener('click', () => {
    applyGrayScaleTheme();
  });
}

// 应用自定义主题
function applyCustomTheme(color) {
  document.documentElement.style.setProperty('--primary-color', color);
  document.documentElement.style.setProperty('--secondary-color', lightenDarkenColor(color, 20));
  document.documentElement.style.setProperty('--accent-color', lightenDarkenColor(color, -20));
}

// 应用渐变主题
function applyGradientTheme(gradient) {
  const gradients = {
    'sunset': 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)',
    'ocean': 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
    'forest': 'linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)',
    'lavender': 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)'
  };
  document.body.style.backgroundImage = gradients[gradient];
}

// 应用高级灰主题
function applyGrayScaleTheme() {
  const grayColors = generateGrayScale();
  document.documentElement.style.setProperty('--primary-color', grayColors.primary);
  document.documentElement.style.setProperty('--secondary-color', grayColors.secondary);
  document.documentElement.style.setProperty('--accent-color', grayColors.accent);
}

// 生成高级灰配色
function generateGrayScale() {
  const baseGray = Math.floor(Math.random() * 155) + 100;
  return {
    primary: `rgb(${baseGray}, ${baseGray}, ${baseGray})`,
    secondary: `rgb(${baseGray - 20}, ${baseGray - 20}, ${baseGray - 20})`,
    accent: `rgb(${baseGray + 20}, ${baseGray + 20}, ${baseGray + 20})`
  };
}

// 颜色亮度调整
function lightenDarkenColor(col, amt) {
  let usePound = false;
  if (col[0] === "#") {
    col = col.slice(1);
    usePound = true;
  }
  const num = parseInt(col, 16);
  let r = (num >> 16) + amt;
  if (r > 255) r = 255;
  else if (r < 0) r = 0;
  let b = ((num >> 8) & 0x00FF) + amt;
  if (b > 255) b = 255;
  else if (b < 0) b = 0;
  let g = (num & 0x0000FF) + amt;
  if (g > 255) g = 255;
  else if (g < 0) g = 0;
  return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
}

// 加载文章数据
function loadArticles() {
  fetch('data.json')
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById('article-container');
      data.articles.forEach(article => {
        const articleElement = document.createElement('article');
        articleElement.innerHTML = `
          <h3>${article.title}</h3>
          <p class="meta">${article.date} | ${article.tags.join(', ')}</p>
          <p>${article.content}</p>
          ${checkPermission(ROLES.ADMIN) ? 
            `<button class="edit-btn" onclick="editArticle(${article.id})">编辑</button>` : ''}
        `;
        container.appendChild(articleElement);
      });
    });
}

// 设置事件监听
function setupEventListeners() {
  // 回到顶部按钮
  const backToTopBtn = document.getElementById('back-to-top');
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // 主题切换
  const themeToggleBtn = document.getElementById('theme-toggle');
  themeToggleBtn.addEventListener('click', toggleTheme);

  // 管理员编辑功能
  const editContentBtn = document.getElementById('edit-content');
  if (editContentBtn) {
    editContentBtn.addEventListener('click', showEditPanel);
  }
}

// 根据权限调整界面
function adjustUIForPermissions() {
  // 显示/隐藏管理员功能
  if (checkPermission(ROLES.ADMIN)) {
    document.getElementById('admin-panel').style.display = 'block';
  }

  // 更新登录链接状态
  const loginLink = document.getElementById('login-link');
  if (currentUser.role !== ROLES.GUEST) {
    loginLink.textContent = '登出';
    loginLink.href = '#'; 
    loginLink.onclick = logout;
  }
}

// 主题切换功能
function toggleTheme() {
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  const currentTheme = localStorage.getItem('theme');
  
  if (document.body.classList.contains('dark-theme')) {
    document.body.classList.remove('dark-theme');
    document.body.classList.add('light-theme');
    localStorage.setItem('theme', 'light');
  } else {
    document.body.classList.remove('light-theme');
    document.body.classList.add('dark-theme');
    localStorage.setItem('theme', 'dark');
  }
}

// 初始化页面
initPage();
