// 모달 컴포넌트
export class Modal {
  constructor(config = {}) {
    this.config = {
      size: 'medium', // small, medium, large
      closable: true,
      ...config
    };
    this.isOpen = false;
    this.createModal();
  }

  createModal() {
    this.overlay = document.createElement('div');
    this.overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      display: none;
      z-index: 1000;
      align-items: center;
      justify-content: center;
    `;

    this.modal = document.createElement('div');
    this.modal.style.cssText = `
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      max-width: ${this.getSizeWidth()};
      width: 90%;
      max-height: 90vh;
      overflow-y: auto;
      position: relative;
    `;

    this.header = document.createElement('div');
    this.header.style.cssText = `
      padding: 1.5rem;
      border-bottom: 1px solid #e0e0e0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    `;

    this.title = document.createElement('h3');
    this.title.style.margin = '0';

    this.closeBtn = document.createElement('button');
    this.closeBtn.innerHTML = '×';
    this.closeBtn.style.cssText = `
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: #666;
      padding: 0;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
    `;
    this.closeBtn.onclick = () => this.close();

    this.body = document.createElement('div');
    this.body.style.padding = '1.5rem';

    this.footer = document.createElement('div');
    this.footer.style.cssText = `
      padding: 1rem 1.5rem;
      border-top: 1px solid #e0e0e0;
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
    `;

    this.header.appendChild(this.title);
    if (this.config.closable) {
      this.header.appendChild(this.closeBtn);
    }

    this.modal.appendChild(this.header);
    this.modal.appendChild(this.body);
    this.modal.appendChild(this.footer);
    this.overlay.appendChild(this.modal);

    document.body.appendChild(this.overlay);

    // 오버레이 클릭으로 닫기
    this.overlay.onclick = (e) => {
      if (e.target === this.overlay && this.config.closable) {
        this.close();
      }
    };
  }

  getSizeWidth() {
    switch (this.config.size) {
      case 'small': return '400px';
      case 'large': return '800px';
      default: return '600px';
    }
  }

  setTitle(title) {
    this.title.textContent = title;
    return this;
  }

  setContent(content) {
    if (typeof content === 'string') {
      this.body.innerHTML = content;
    } else {
      this.body.innerHTML = '';
      this.body.appendChild(content);
    }
    return this;
  }

  setFooter(buttons) {
    this.footer.innerHTML = '';
    buttons.forEach(btn => {
      const button = document.createElement('button');
      button.textContent = btn.label;
      button.style.cssText = `
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        ${btn.primary ? 'background: #005EB8; color: #fff;' : 'background: #f8f9fa; color: #333; border: 1px solid #e0e0e0;'}
      `;
      button.onclick = () => {
        if (btn.handler) btn.handler();
        if (btn.close !== false) this.close();
      };
      this.footer.appendChild(button);
    });
    return this;
  }

  open() {
    this.overlay.style.display = 'flex';
    this.isOpen = true;
    return this;
  }

  close() {
    this.overlay.style.display = 'none';
    this.isOpen = false;
    return this;
  }

  destroy() {
    if (this.overlay && this.overlay.parentNode) {
      this.overlay.parentNode.removeChild(this.overlay);
    }
  }
}

// 확인/취소 모달 헬퍼
export function showConfirm(message, onConfirm, onCancel) {
  const modal = new Modal({ size: 'small' })
    .setTitle('확인')
    .setContent(`<p style="margin: 0; color: #666;">${message}</p>`)
    .setFooter([
      { label: '취소', handler: onCancel },
      { label: '확인', handler: onConfirm, primary: true }
    ])
    .open();

  return modal;
}

// 알림 모달 헬퍼
export function showAlert(message, onClose) {
  const modal = new Modal({ size: 'small' })
    .setTitle('알림')
    .setContent(`<p style="margin: 0; color: #666;">${message}</p>`)
    .setFooter([
      { label: '확인', handler: onClose, primary: true }
    ])
    .open();

  return modal;
}