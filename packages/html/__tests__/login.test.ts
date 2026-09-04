import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Login, createLogin } from '../src/components/login';

describe('Login Component', () => {
  let container: HTMLDivElement;
  let loginEl: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    loginEl = document.createElement('div');
    container.appendChild(loginEl);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('constructor', () => {
    it('should initialize with element reference', () => {
      const login = new Login(loginEl);
      expect(login.getElement()).toBe(loginEl);
    });

    it('should initialize with selector', () => {
      loginEl.id = 'test-login';
      const login = new Login('#test-login');
      expect(login.getElement()).toBe(loginEl);
    });

    it('should throw error if selector not found', () => {
      expect(() => new Login('#non-existent')).toThrow(
        'Element not found for selector: #non-existent'
      );
    });
  });

  describe('initial render', () => {
    it('should render title and subtitle when provided', () => {
      new Login(loginEl, { title: 'Welcome Back', subtitle: 'Sign in to continue' });
      expect(loginEl.querySelector('.ag-login-title')?.textContent).toBe('Welcome Back');
      expect(loginEl.querySelector('.ag-login-subtitle')?.textContent).toBe('Sign in to continue');
    });

    it('should not render title/subtitle when omitted', () => {
      new Login(loginEl);
      expect(loginEl.querySelector('.ag-login-title')).toBeNull();
      expect(loginEl.querySelector('.ag-login-subtitle')).toBeNull();
    });

    it('should render username and password inputs', () => {
      new Login(loginEl);
      const usernameInput = loginEl.querySelector('input[name="username"]') as HTMLInputElement;
      const passwordInput = loginEl.querySelector('input[name="password"]') as HTMLInputElement;
      expect(usernameInput).not.toBeNull();
      expect(usernameInput.type).toBe('text');
      expect(passwordInput).not.toBeNull();
      expect(passwordInput.type).toBe('password');
    });

    it('should render default texts for submit/remember/forgot/register', () => {
      new Login(loginEl);
      const submitBtn = loginEl.querySelector('button[type="submit"]');
      expect(submitBtn?.textContent).toBe('Login');
      expect(loginEl.querySelector('.ag-checkbox-label')?.textContent).toBe('Remember me');
      expect(loginEl.querySelector('.ag-login-form-forgot')?.textContent).toBe('Forgot password?');
      expect(loginEl.querySelector('.ag-login-register')?.textContent).toBe('Register now');
    });

    it('should render custom texts when provided via options', () => {
      new Login(loginEl, {
        submitText: 'Sign In',
        rememberText: 'Keep me logged in',
        forgotText: 'Reset password',
        registerText: 'Create account',
      });
      expect(loginEl.querySelector('button[type="submit"]')?.textContent).toBe('Sign In');
      expect(loginEl.querySelector('.ag-checkbox-label')?.textContent).toBe('Keep me logged in');
      expect(loginEl.querySelector('.ag-login-form-forgot')?.textContent).toBe('Reset password');
      expect(loginEl.querySelector('.ag-login-register')?.textContent).toBe('Create account');
    });

    it('should not render forgot link when forgotText is explicitly empty', () => {
      new Login(loginEl, { forgotText: '' });
      expect(loginEl.querySelector('.ag-login-form-forgot')).toBeNull();
    });

    it('should not render register link when registerText is explicitly empty', () => {
      new Login(loginEl, { registerText: '' });
      expect(loginEl.querySelector('.ag-login-register')).toBeNull();
    });
  });

  describe('setTitle', () => {
    it('should update title text when title was initially provided', () => {
      const login = new Login(loginEl, { title: 'Initial' });
      login.setTitle('Updated');
      expect(loginEl.querySelector('.ag-login-title')?.textContent).toBe('Updated');
    });

    it('should not create a title element if none existed initially', () => {
      const login = new Login(loginEl);
      login.setTitle('Too Late');
      expect(loginEl.querySelector('.ag-login-title')).toBeNull();
    });
  });

  describe('setSubtitle', () => {
    it('should update subtitle text when subtitle was initially provided', () => {
      const login = new Login(loginEl, { subtitle: 'Initial' });
      login.setSubtitle('Updated Subtitle');
      expect(loginEl.querySelector('.ag-login-subtitle')?.textContent).toBe('Updated Subtitle');
    });

    it('should not create a subtitle element if none existed initially', () => {
      const login = new Login(loginEl);
      login.setSubtitle('Too Late');
      expect(loginEl.querySelector('.ag-login-subtitle')).toBeNull();
    });
  });

  describe('getForm', () => {
    it('should return the underlying form element', () => {
      const login = new Login(loginEl);
      const form = login.getForm();
      expect(form).toBeInstanceOf(HTMLFormElement);
      expect(form.className).toContain('ag-login-form');
      expect(loginEl.contains(form)).toBe(true);
    });
  });

  describe('form submission', () => {
    it('should allow typing into username/password and dispatch a real submit event', () => {
      const login = new Login(loginEl);
      const form = login.getForm();
      const usernameInput = form.querySelector('input[name="username"]') as HTMLInputElement;
      const passwordInput = form.querySelector('input[name="password"]') as HTMLInputElement;

      usernameInput.value = 'alice';
      passwordInput.value = 'secret';

      let submitted = false;
      let capturedUsername = '';
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        submitted = true;
        capturedUsername = (form.querySelector('input[name="username"]') as HTMLInputElement).value;
      });

      const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement;
      submitBtn.click();

      expect(submitted).toBe(true);
      expect(capturedUsername).toBe('alice');
    });
  });

  describe('createLogin', () => {
    it('should create a login component from scratch with rendered options', () => {
      const login = createLogin({ title: 'New Session' });
      const el = login.getElement();
      expect(el.className).toContain('ag-login');
      expect(el.querySelector('.ag-login-title')?.textContent).toBe('New Session');
      expect(el.querySelector('.ag-login-form')).not.toBeNull();
    });
  });

  describe('destroy', () => {
    it('should remove the form element from the DOM', () => {
      const login = new Login(loginEl);
      expect(loginEl.querySelector('.ag-login-form')).not.toBeNull();
      login.destroy();
      expect(loginEl.querySelector('.ag-login-form')).toBeNull();
    });

    it('should not throw when destroy is called', () => {
      const login = new Login(loginEl);
      expect(() => login.destroy()).not.toThrow();
    });
  });
});
