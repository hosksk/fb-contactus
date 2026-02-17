
class InquiryForm extends HTMLElement {
  constructor() {
    super();
    this.formEndpoint = 'https://formspree.io/f/xzdavppl';
    const shadow = this.attachShadow({ mode: 'open' });

    const form = document.createElement('form');
    form.innerHTML = `
      <div class="form-group">
        <label for="name">Name</label>
        <input type="text" id="name" name="name" required>
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" name="email" required>
      </div>
      <div class="form-group">
        <label for="phone">Phone Number</label>
        <input type="tel" id="phone" name="phone">
      </div>
      <div class="form-group">
        <label for="message">Message</label>
        <textarea id="message" name="message" required></textarea>
      </div>
      <button type="submit">Submit</button>
    `;

    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: block;
        padding: 20px;
        background: var(--form-background);
        border-radius: 8px;
        box-shadow: var(--box-shadow);
      }
      .form-group {
        margin-bottom: 15px;
      }
      label {
        display: block;
        margin-bottom: 5px;
        color: var(--text-color);
      }
      input[type="text"],
      input[type="email"],
      input[type="tel"],
      textarea {
        box-sizing: border-box;
        width: 100%;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 4px;
        background-color: var(--background-color);
        color: var(--text-color);
      }
      textarea {
        height: 150px;
      }
      button {
        display: block;
        width: 100%;
        padding: 10px;
        background-color: var(--primary-color, #007bff);
        color: #fff;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }
      button:hover {
        background-color: var(--primary-color-hover, #0056b3);
      }
    `;

    shadow.appendChild(style);
    shadow.appendChild(form);

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitButton = form.querySelector('button[type="submit"]');
      const formData = new FormData(form);
      submitButton.disabled = true;

      try {
        const response = await fetch(this.formEndpoint, {
          method: 'POST',
          body: formData,
          headers: {
            Accept: 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Formspree request failed: ${response.status}`);
        }

        form.reset();
        alert('문의가 정상적으로 전송되었습니다.');
      } catch (error) {
        console.error('Inquiry submission failed:', error);
        alert('문의 전송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      } finally {
        submitButton.disabled = false;
      }
    });
  }
}

customElements.define('inquiry-form', InquiryForm);

// Dark Mode Toggle
const toggle = document.querySelector('.dark-mode-toggle');
const body = document.body;

const applyTheme = (theme) => {
  if (theme === 'dark') {
    body.classList.add('dark-mode');
    toggle.textContent = '☀️';
  } else {
    body.classList.remove('dark-mode');
    toggle.textContent = '🌙';
  }
};

toggle.addEventListener('click', () => {
  const isDarkMode = body.classList.contains('dark-mode');
  localStorage.setItem('theme', isDarkMode ? 'light' : 'dark');
  applyTheme(isDarkMode ? 'light' : 'dark');
});

// Apply saved theme on load
document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme') || 'light';
  applyTheme(savedTheme);
});
