// 下载页面交互脚本
document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('search-input');
  const downloadList = document.getElementById('download-list');
  const items = Array.from(downloadList.children);

  // 实时搜索功能
  searchInput.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    
    items.forEach(item => {
      const title = item.querySelector('h3').textContent.toLowerCase();
      const description = item.querySelector('p:last-child').textContent.toLowerCase();
      
      if (title.includes(searchTerm) || description.includes(searchTerm)) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });
  });

  // 下载按钮点击事件
  downloadList.addEventListener('click', function(e) {
    if (e.target.classList.contains('download-button')) {
      const item = e.target.closest('.download-item');
      const softwareName = item.querySelector('h3').textContent;
      const version = item.querySelector('p').textContent.split('|')[0].trim();
      
      // 模拟下载
      alert(`开始下载：${softwareName} ${version}`);
      
      // 这里可以添加实际的下载逻辑
      // 例如：window.location.href = '下载链接';
    }
  });

  // 初始化时显示所有项目
  items.forEach(item => item.style.display = 'flex');
});
