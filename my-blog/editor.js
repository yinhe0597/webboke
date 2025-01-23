// 初始化Markdown编辑器
const editor = new EasyMDE({
  element: document.getElementById('markdown-editor'),
  autoDownloadFontAwesome: false,
  spellChecker: false,
  placeholder: '开始写作...',
  toolbar: [
    {
      name: "emoji",
      action: function(editor) {
        const emojiList = [
          "😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇",
          "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚",
          "😋", "😛", "😝", "😜", "🤪", "🤨", "🧐", "🤓", "😎", "🤩",
          "🥳", "😏", "😒", "😞", "😔", "😟", "😕", "🙁", "☹️", "😣",
          "😖", "😫", "😩", "🥺", "😢", "😭", "😤", "😠", "😡", "🤬",
          "🤯", "😳", "🥵", "🥶", "😱", "😨", "😰", "😥", "😓", "🤗",
          "🤔", "🤭", "🤫", "🤥", "😶", "😐", "😑", "😬", "🙄", "😯",
          "😦", "😧", "😮", "😲", "🥱", "😴", "🤤", "😪", "😵", "🤐",
          "🥴", "🤢", "🤮", "🤧", "😷", "🤒", "🤕", "🤑", "🤠", "😈",
          "👿", "👹", "👺", "🤡", "💩", "👻", "💀", "☠️", "👽", "👾",
          "🤖", "🎃", "😺", "😸", "😹", "😻", "😼", "😽", "🙀", "😿",
          "😾"
        ];
        
        const emojiPicker = document.createElement('div');
        emojiPicker.className = 'emoji-picker';
        emojiPicker.style.position = 'absolute';
        emojiPicker.style.zIndex = '1000';
        emojiPicker.style.backgroundColor = '#fff';
        emojiPicker.style.border = '1px solid #ddd';
        emojiPicker.style.padding = '10px';
        emojiPicker.style.display = 'grid';
        emojiPicker.style.gridTemplateColumns = 'repeat(10, 1fr)';
        emojiPicker.style.gap = '5px';
        
        emojiList.forEach(emoji => {
          const emojiButton = document.createElement('button');
          emojiButton.textContent = emoji;
          emojiButton.style.border = 'none';
          emojiButton.style.background = 'none';
          emojiButton.style.cursor = 'pointer';
          emojiButton.style.fontSize = '1.2em';
          emojiButton.addEventListener('click', () => {
            editor.codemirror.replaceSelection(emoji);
            emojiPicker.remove();
          });
          emojiPicker.appendChild(emojiButton);
        });
        
        const cursorPos = editor.codemirror.getCursor();
        const coords = editor.codemirror.cursorCoords(cursorPos);
        emojiPicker.style.left = `${coords.left}px`;
        emojiPicker.style.top = `${coords.bottom}px`;
        
        document.body.appendChild(emojiPicker);
      },
      className: "fa fa-smile-o",
      title: "插入表情"
    },
    'bold', 'italic', 'heading', '|',
    'quote', 'unordered-list', 'ordered-list', '|',
    'link', 'image', '|',
    'preview', 'side-by-side', 'fullscreen', '|',
    'guide'
  ],
  toolbarTips: {
    emoji: "插入表情"
  }
});

// 保存文章功能
document.getElementById('save-article').addEventListener('click', () => {
  const content = editor.value();
  const filename = prompt('请输入文章文件名（无需后缀）', 'new-article');
  
  if (filename) {
    const blob = new Blob([content], { type: 'text/markdown' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.md`;
    link.click();
    alert('文章已保存');
  }
});

// 预览功能
document.getElementById('preview-article').addEventListener('click', () => {
  const previewArea = document.getElementById('preview-area');
  previewArea.innerHTML = editor.markdown(editor.value());
  previewArea.classList.toggle('hidden');
});

// 管理员权限检查
if (!currentUser || currentUser.role !== ROLES.ADMIN) {
  document.querySelector('.editor-container').innerHTML = `
    <div class="alert">
      <p>您没有编辑权限</p>
      <a href="login.html">前往登录</a>
    </div>
  `;
}
