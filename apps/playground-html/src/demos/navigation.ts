import {
  AppShell,
  Menu,
  Breadcrumb,
  Tabs,
  Login,
  StatCard,
  Result,
  Transfer,
  TreeSelect,
  Dropdown,
  Tree,
} from '@argon-kit/html';
import type { TreeNode as DropdownTreeNode, MenuItem as DropdownMenuItem } from '@argon-kit/html';

/**
 * TreeSelect's own `TreeNode` shape (key/title/children/disabled) is not
 * exported from `@argon-kit/html` - only Dropdown/Tree's differently-shaped
 * `TreeNode` (label/value/children) is. Declared locally to type the
 * `treeData` option passed to `TreeSelect` below.
 */
interface TreeSelectNode {
  key: string;
  title?: string;
  children?: TreeSelectNode[];
  disabled?: boolean;
}

interface Destroyable {
  destroy?: () => void;
}

/**
 * Mounts every "navigation" component demo into `container`.
 *
 * All DOM for this section is built programmatically (no pre-existing
 * markup is relied upon). Each demo is a real, interactive component
 * instance wired to its own real API so a human tester can see the
 * behavior without opening devtools. No network requests are made -
 * all data is inline/local.
 *
 * Returns every created component instance that exposes a `destroy`
 * method, so the caller can clean everything up (e.g. on HMR). This
 * function only builds and collects instances - it never calls destroy.
 */
export function mountNavigationDemos(container: HTMLElement): Array<{ destroy?: () => void }> {
  const destroyables: Destroyable[] = [];

  function createSection(title: string, description: string): HTMLElement {
    const section = document.createElement('section');
    section.style.marginBottom = '32px';

    const heading = document.createElement('h3');
    heading.textContent = title;
    section.appendChild(heading);

    const desc = document.createElement('p');
    desc.textContent = description;
    desc.style.color = '#666';
    desc.style.marginTop = '0';
    section.appendChild(desc);

    const content = document.createElement('div');
    content.style.display = 'flex';
    content.style.flexDirection = 'column';
    content.style.gap = '12px';
    section.appendChild(content);

    container.appendChild(section);
    return content;
  }

  // --- AppShell ---
  // NOTE: AppShell renders header/sidebar/content/footer regions meant for
  // a full page layout. The classes it applies (ag-app-shell, ag-app-header,
  // ag-app-sidebar, ag-app-content, ag-app-footer) have no matching rules in
  // @argon-kit/styles/layout.css (that stylesheet uses an unrelated BEM
  // naming scheme, e.g. .ag-app, .ag-sidenav, .ag-header), so AppShell does
  // not itself apply any fixed/absolute positioning or min-height: 100vh.
  // Even so, we keep it inside a bounded, scrollable preview box below so
  // it can never visually take over the rest of the playground page. This
  // is a best-effort demo of a component whose real intended use is a
  // full page shell.
  const appShellContent = createSection(
    'AppShell',
    'Header / sidebar / content / footer layout regions. Shown in a bounded preview box since AppShell is designed for full-page layouts. setContent() below swaps the content region dynamically.'
  );

  const appShellPreviewBox = document.createElement('div');
  appShellPreviewBox.style.position = 'relative';
  appShellPreviewBox.style.height = '300px';
  appShellPreviewBox.style.width = '100%';
  appShellPreviewBox.style.maxWidth = '480px';
  appShellPreviewBox.style.overflow = 'auto';
  appShellPreviewBox.style.border = '1px solid #ddd';
  appShellPreviewBox.style.borderRadius = '4px';

  const appShellContainer = document.createElement('div');
  appShellPreviewBox.appendChild(appShellContainer);

  const appShell = new AppShell(appShellContainer, {
    header: 'App Header',
    sidebar: 'App Sidebar',
    footer: 'App Footer',
  });
  appShell.setContent('Dynamic content set via setContent()');
  appShellContent.appendChild(appShellPreviewBox);
  destroyables.push(appShell);

  // --- Menu ---
  const menuContent = createSection(
    'Menu',
    'A vertical menu with a submenu item. Click any leaf item to update the readout below via onClick.'
  );

  const menuSelectedReadout = document.createElement('p');
  menuSelectedReadout.style.margin = '0';
  menuSelectedReadout.textContent = 'Selected: (none)';

  const menuContainer = document.createElement('div');
  const menu = new Menu(menuContainer, {
    mode: 'vertical',
    selectedKeys: ['dashboard'],
    onClick: (key) => {
      menuSelectedReadout.textContent = `Selected: ${key}`;
    },
  });
  menu.addItem({ key: 'dashboard', title: 'Dashboard' });
  menu.addItem({
    key: 'settings',
    title: 'Settings',
    children: [
      { key: 'settings-profile', title: 'Profile' },
      { key: 'settings-billing', title: 'Billing' },
    ],
  });
  menu.addItem({ key: 'logout', title: 'Logout' });

  menuContent.appendChild(menuContainer);
  menuContent.appendChild(menuSelectedReadout);
  destroyables.push(menu);

  // --- Breadcrumb ---
  const breadcrumbContent = createSection(
    'Breadcrumb',
    'A breadcrumb trail with a linked first item and a plain-text current page.'
  );
  const breadcrumbContainer = document.createElement('div');
  const breadcrumb = new Breadcrumb(breadcrumbContainer, {
    items: [
      { title: 'Home', href: '#home' },
      { title: 'Settings', href: '#settings' },
      { title: 'Profile' },
    ],
  });
  breadcrumbContent.appendChild(breadcrumbContainer);
  destroyables.push(breadcrumb);

  // --- Tabs ---
  const tabsContent = createSection(
    'Tabs',
    'Three tabs with real content panes. The third tab is disabled and cannot be activated.'
  );
  const tabsContainer = document.createElement('div');
  const tabs = new Tabs(tabsContainer, {
    tabs: [
      { key: 'overview', title: 'Overview', content: 'Overview content goes here.' },
      { key: 'details', title: 'Details', content: 'Details content goes here.' },
      { key: 'archived', title: 'Archived (disabled)', content: 'You should never see this.', disabled: true },
    ],
    activeKey: 'overview',
  });
  tabsContent.appendChild(tabsContainer);
  destroyables.push(tabs);

  // --- Login ---
  const loginContent = createSection(
    'Login',
    'A real login form. Submitting shows the username in the readout below (the password value is never logged or displayed).'
  );
  const loginSubmitReadout = document.createElement('p');
  loginSubmitReadout.style.margin = '0';
  loginSubmitReadout.textContent = 'Submitted username: (none)';

  const loginContainer = document.createElement('div');
  loginContainer.style.maxWidth = '360px';
  const login = new Login(loginContainer, {
    title: 'Sign in',
    subtitle: 'Welcome back, please enter your details.',
  });
  const loginForm = login.getForm();
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const usernameInput = loginForm.querySelector<HTMLInputElement>('input[name="username"]');
    loginSubmitReadout.textContent = `Submitted username: ${usernameInput?.value || '(empty)'}`;
  });
  loginContent.appendChild(loginContainer);
  loginContent.appendChild(loginSubmitReadout);
  destroyables.push(login);

  // --- StatCard ---
  const statCardContent = createSection(
    'StatCard',
    'Three stat cards with different trends.'
  );
  const statCardRow = document.createElement('div');
  statCardRow.style.display = 'flex';
  statCardRow.style.gap = '16px';
  statCardRow.style.flexWrap = 'wrap';

  const statCardDefs: Array<{
    title: string;
    value: string | number;
    description: string;
    trend: 'up' | 'down' | 'neutral';
    trendText: string;
  }> = [
    { title: 'Revenue', value: '$12,450', description: 'This month', trend: 'up', trendText: '+8.2% vs last month' },
    { title: 'Churn', value: '2.4%', description: 'This month', trend: 'down', trendText: '-0.5% vs last month' },
    { title: 'Active Users', value: 8421, description: 'Right now', trend: 'neutral', trendText: 'No change' },
  ];
  statCardDefs.forEach(({ title, value, description, trend, trendText }) => {
    const cardEl = document.createElement('div');
    cardEl.style.minWidth = '180px';
    const statCard = new StatCard(cardEl, { title, value, description, trend, trendText });
    statCardRow.appendChild(cardEl);
    destroyables.push(statCard);
  });
  statCardContent.appendChild(statCardRow);

  // --- Result ---
  const resultContent = createSection(
    'Result',
    'A success result and an error result.'
  );
  const resultRow = document.createElement('div');
  resultRow.style.display = 'flex';
  resultRow.style.gap = '16px';
  resultRow.style.flexWrap = 'wrap';

  const successResultEl = document.createElement('div');
  successResultEl.style.flex = '1';
  successResultEl.style.minWidth = '240px';
  const successResult = new Result(successResultEl, {
    icon: 'success',
    title: 'Payment successful',
    description: 'Your transaction has been completed.',
    extra: 'Order #A1029384',
  });
  resultRow.appendChild(successResultEl);
  destroyables.push(successResult);

  const errorResultEl = document.createElement('div');
  errorResultEl.style.flex = '1';
  errorResultEl.style.minWidth = '240px';
  const errorResult = new Result(errorResultEl, {
    icon: 'error',
    title: 'Payment failed',
    description: 'Your card was declined. Please try another payment method.',
    extra: 'Error code: 402',
  });
  resultRow.appendChild(errorResultEl);
  destroyables.push(errorResult);

  resultContent.appendChild(resultRow);

  // --- Transfer ---
  const transferContent = createSection(
    'Transfer',
    'Six items, two of which start on the target side. Check items and use the arrow buttons to move them; the readout below tracks target keys via onChange.'
  );
  const transferReadout = document.createElement('p');
  transferReadout.style.margin = '0';

  const transferItems = [
    { key: 'apple', title: 'Apple' },
    { key: 'banana', title: 'Banana' },
    { key: 'cherry', title: 'Cherry' },
    { key: 'date', title: 'Date' },
    { key: 'elderberry', title: 'Elderberry' },
    { key: 'fig', title: 'Fig' },
  ];
  const initialTargetKeys = ['banana', 'date'];

  const transferContainer = document.createElement('div');
  const transfer = new Transfer(transferContainer, {
    dataSource: transferItems,
    targetKeys: initialTargetKeys,
    onChange: (targetKeys) => {
      transferReadout.textContent = `Target keys: [${targetKeys.join(', ')}]`;
    },
  });
  transferReadout.textContent = `Target keys: [${initialTargetKeys.join(', ')}]`;
  transferContent.appendChild(transferContainer);
  transferContent.appendChild(transferReadout);
  destroyables.push(transfer);

  // --- TreeSelect ---
  const treeSelectContent = createSection(
    'TreeSelect',
    'A select backed by a two-level tree. Click to open, expand a branch, then pick a leaf; the readout below tracks the selected value via onChange.'
  );
  const treeSelectReadout = document.createElement('p');
  treeSelectReadout.style.margin = '0';
  treeSelectReadout.textContent = 'Value: (none)';

  const treeSelectData: TreeSelectNode[] = [
    {
      key: 'fruits',
      title: 'Fruits',
      children: [
        { key: 'fruits-apple', title: 'Apple' },
        { key: 'fruits-banana', title: 'Banana' },
      ],
    },
    {
      key: 'vegetables',
      title: 'Vegetables',
      children: [
        { key: 'vegetables-carrot', title: 'Carrot' },
        { key: 'vegetables-potato', title: 'Potato', disabled: true },
      ],
    },
  ];

  const treeSelectContainer = document.createElement('div');
  treeSelectContainer.style.maxWidth = '280px';
  const treeSelect = new TreeSelect(treeSelectContainer, {
    placeholder: 'Select a food item...',
    treeData: treeSelectData,
    onChange: (value) => {
      treeSelectReadout.textContent = `Value: ${value}`;
    },
  });
  treeSelectContent.appendChild(treeSelectContainer);
  treeSelectContent.appendChild(treeSelectReadout);
  destroyables.push(treeSelect);

  // --- Dropdown ---
  const dropdownContent = createSection(
    'Dropdown',
    'Click the trigger button to open a menu with a disabled item and a submenu.'
  );
  const dropdownTriggerBtn = document.createElement('button');
  dropdownTriggerBtn.type = 'button';
  dropdownTriggerBtn.textContent = 'Open dropdown';
  dropdownContent.appendChild(dropdownTriggerBtn);

  const dropdownReadout = document.createElement('p');
  dropdownReadout.style.margin = '8px 0 0';
  dropdownReadout.textContent = 'Last clicked: (none)';
  dropdownContent.appendChild(dropdownReadout);

  const dropdownItems: DropdownMenuItem[] = [
    { label: 'Edit', value: 'edit', onClick: () => (dropdownReadout.textContent = 'Last clicked: Edit') },
    { label: 'Duplicate', value: 'duplicate', onClick: () => (dropdownReadout.textContent = 'Last clicked: Duplicate') },
    {
      label: 'Share',
      value: 'share',
      children: [
        { label: 'Email', value: 'share-email', onClick: () => (dropdownReadout.textContent = 'Last clicked: Share > Email') },
        { label: 'Link', value: 'share-link', onClick: () => (dropdownReadout.textContent = 'Last clicked: Share > Link') },
      ],
    },
    { label: 'Delete (disabled)', value: 'delete', disabled: true },
  ];
  const dropdown = new Dropdown(dropdownTriggerBtn, {
    items: dropdownItems,
    trigger: 'click',
  });
  destroyables.push(dropdown);

  // --- Tree ---
  const treeContent = createSection(
    'Tree',
    'A two-level tree. Click the arrow to expand/collapse, and click a label to select it; the readout below tracks the selection via onChange.'
  );
  const treeReadout = document.createElement('p');
  treeReadout.style.margin = '0 0 8px';
  treeReadout.textContent = 'Selected: (none)';
  treeContent.appendChild(treeReadout);

  const treeData: DropdownTreeNode[] = [
    {
      label: 'Documents',
      value: 'documents',
      expanded: true,
      children: [
        { label: 'Resume.pdf', value: 'documents-resume' },
        { label: 'CoverLetter.docx', value: 'documents-cover-letter' },
      ],
    },
    {
      label: 'Photos',
      value: 'photos',
      children: [
        { label: 'Vacation', value: 'photos-vacation' },
        { label: 'Family', value: 'photos-family', disabled: true },
      ],
    },
  ];

  const treeContainer = document.createElement('ul');
  const tree = new Tree(treeContainer, {
    data: treeData,
    onChange: (value) => {
      treeReadout.textContent = `Selected: ${value}`;
    },
  });
  treeContent.appendChild(treeContainer);
  destroyables.push(tree);

  return destroyables;
}
