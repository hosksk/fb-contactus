
class InquiryForm extends HTMLElement {
  constructor() {
    super();
    this.formEndpoint = 'https://formspree.io/f/xzdavppl';
    this.totalSteps = 3;
    this.currentStep = 0;
    const shadow = this.attachShadow({ mode: 'open' });

    const form = document.createElement('form');
    form.innerHTML = `
      <div class="step-indicator" aria-live="polite">Step 1 of 3</div>

      <div class="step active" data-step="0">
        <div class="form-group">
          <label for="name">Name</label>
          <input type="text" id="name" name="name" required>
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" name="email" required>
        </div>
      </div>

      <div class="step" data-step="1">
        <div class="form-group">
          <label for="phone">Phone Number</label>
          <input type="tel" id="phone" name="phone">
        </div>
      </div>

      <div class="step" data-step="2">
        <div class="form-group">
          <label for="message">Message</label>
          <textarea id="message" name="message" required></textarea>
        </div>
      </div>

      <div class="actions">
        <button type="button" class="secondary prev-btn" style="display: none;">Previous</button>
        <button type="button" class="next-btn">Next</button>
        <button type="submit" class="submit-btn" style="display: none;">Submit</button>
      </div>
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
      .step {
        display: none;
      }
      .step.active {
        display: block;
      }
      .step-indicator {
        margin-bottom: 12px;
        color: var(--text-color);
        font-size: 14px;
        opacity: 0.85;
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
      .actions {
        display: flex;
        gap: 10px;
      }
      button {
        flex: 1;
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
      button.secondary {
        background-color: #6c757d;
      }
      button.secondary:hover {
        background-color: #5a6268;
      }
      button:disabled {
        opacity: 0.7;
        cursor: not-allowed;
      }
    `;

    shadow.appendChild(style);
    shadow.appendChild(form);

    const steps = form.querySelectorAll('.step');
    const indicator = form.querySelector('.step-indicator');
    const prevButton = form.querySelector('.prev-btn');
    const nextButton = form.querySelector('.next-btn');
    const submitButton = form.querySelector('.submit-btn');

    const updateStepUI = () => {
      steps.forEach((step, index) => {
        step.classList.toggle('active', index === this.currentStep);
      });

      indicator.textContent = `Step ${this.currentStep + 1} of ${this.totalSteps}`;
      prevButton.style.display = this.currentStep === 0 ? 'none' : 'block';

      const isLastStep = this.currentStep === this.totalSteps - 1;
      nextButton.style.display = isLastStep ? 'none' : 'block';
      submitButton.style.display = isLastStep ? 'block' : 'none';
    };

    const validateCurrentStep = () => {
      const activeStep = form.querySelector(`.step[data-step="${this.currentStep}"]`);
      const fields = activeStep.querySelectorAll('input, textarea');
      for (const field of fields) {
        if (!field.checkValidity()) {
          field.reportValidity();
          return false;
        }
      }
      return true;
    };

    prevButton.addEventListener('click', () => {
      if (this.currentStep > 0) {
        this.currentStep -= 1;
        updateStepUI();
      }
    });

    nextButton.addEventListener('click', () => {
      if (!validateCurrentStep()) {
        return;
      }

      if (this.currentStep < this.totalSteps - 1) {
        this.currentStep += 1;
        updateStepUI();
      }
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!validateCurrentStep()) {
        return;
      }
      const formData = new FormData(form);
      submitButton.disabled = true;
      prevButton.disabled = true;

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
        this.currentStep = 0;
        updateStepUI();
        alert('문의가 정상적으로 전송되었습니다.');
      } catch (error) {
        console.error('Inquiry submission failed:', error);
        alert('문의 전송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      } finally {
        submitButton.disabled = false;
        prevButton.disabled = false;
      }
    });

    updateStepUI();
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
