// 用户角色定义
const ROLES = {
  GUEST: 'guest',
  ADMIN: 'admin',
  VISITOR: 'visitor'
};

// 从localStorage加载用户状态
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || {
  role: ROLES.GUEST,
  username: null
};

// 访客统计
let visitorCount = 0;

// 初始化访客统计
function initVisitorCount() {
  visitorCount = parseInt(localStorage.getItem('visitorCount')) || 0;
  updateVisitorCount();
}

// 更新访客统计
function updateVisitorCount() {
  if (currentUser.role === ROLES.ADMIN) {
    document.getElementById('visitor-count').textContent = `访客数: ${visitorCount}`;
  }
}

// 处理登录
document.getElementById('login-form')?.addEventListener('submit', function(e) {
  e.preventDefault();
  
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  // 简单模拟登录验证
  if (username === 'admin' && password === 'admin123') {
    currentUser = {
      role: ROLES.ADMIN,
      username: username
    };
    // 保存用户状态到localStorage
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    window.location.href = 'index.html';
  } else {
    alert('用户名或密码错误');
  }
});

// 检查用户权限
function checkPermission(requiredRole) {
  return currentUser.role === requiredRole;
}

// 登出功能
function logout() {
  localStorage.removeItem('currentUser');
  currentUser = {
    role: ROLES.GUEST,
    username: null
  };
  window.location.href = 'index.html';
}

// 初始化页面权限
function initPagePermissions() {
  // 游客模式
  if (currentUser.role === ROLES.GUEST) {
    visitorCount++;
    localStorage.setItem('visitorCount', visitorCount);
    updateVisitorCount();
  }

  // 管理员功能
  if (checkPermission(ROLES.ADMIN)) {
    document.getElementById('admin-panel').style.display = 'block';
  }
}

// 导出功能
export { ROLES, currentUser, checkPermission, initPagePermissions, initVisitorCount };
