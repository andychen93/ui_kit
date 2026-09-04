import {
  createAlert,
  createBadge,
  createTag,
  Tag,
  Avatar,
  AvatarGroup,
  createCard,
  createProgress,
  createTimeline,
  Collapse,
  CollapsePanel,
  createSteps,
  createSlider,
  createSpin,
  createDescriptions,
  createList,
  createEmpty,
  createTable,
  createPagination,
} from '@argon-kit/html';

interface Destroyable {
  destroy?: () => void;
}

interface MockUser {
  name: string;
  role: string;
  status: 'Active' | 'Pending' | 'Disabled';
}

/**
 * A tiny inline (data-URI) avatar image so the Avatar "image" rendering
 * path can be demonstrated without making any network request.
 */
const INLINE_AVATAR_SRC =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64">' +
      '<rect width="64" height="64" fill="#6366f1"/>' +
      '<text x="50%" y="55%" font-size="24" fill="#fff" font-family="sans-serif" text-anchor="middle" dominant-baseline="middle">JD</text>' +
      '</svg>'
  );

/**
 * Mounts every "data display" component demo into `container`.
 *
 * All DOM for this section is built programmatically (no pre-existing
 * markup is relied upon). Each demo is a real, interactive component
 * instance wired to its own real API (setPercent, setCurrent, onChange,
 * etc.) so a human tester can see the behavior without opening devtools.
 * No network requests are made - avatar "images" use inline data URIs.
 *
 * Returns every created component instance that exposes a `destroy`
 * method, so the caller can clean everything up (e.g. on HMR). This
 * function only builds and collects instances - it never calls destroy.
 */
export function mountDataDisplayDemos(container: HTMLElement): Array<{ destroy?: () => void }> {
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

  // --- Alert ---
  const alertContent = createSection(
    'Alert',
    'A closeable alert. Click the close button to dismiss it.'
  );
  const alert = createAlert({
    variant: 'warning',
    title: 'Heads up',
    description: 'This alert can be closed with the button on the right.',
    closeable: true,
    onClose: () => console.log('Alert closed'),
  });
  alertContent.appendChild(alert.getElement());
  destroyables.push(alert);

  // --- Badge + Tag ---
  const badgeTagContent = createSection(
    'Badge & Tag',
    'A few badge variants plus tags, including a closeable tag wired to a real close handler.'
  );

  const badgeRow = document.createElement('div');
  badgeRow.style.display = 'flex';
  badgeRow.style.gap = '16px';
  badgeRow.style.alignItems = 'center';

  const badgeVariants: Array<{ variant: 'primary' | 'success' | 'warning' | 'danger'; count: number }> = [
    { variant: 'primary', count: 5 },
    { variant: 'success', count: 12 },
    { variant: 'warning', count: 128 },
    { variant: 'danger', count: 3 },
  ];
  badgeVariants.forEach(({ variant, count }) => {
    const badge = createBadge({ variant, count, overflowCount: 99 });
    badgeRow.appendChild(badge.getElement());
    destroyables.push(badge);
  });

  const dotBadge = createBadge({ variant: 'info', dot: true });
  badgeRow.appendChild(dotBadge.getElement());
  destroyables.push(dotBadge);

  badgeTagContent.appendChild(badgeRow);

  const tagRow = document.createElement('div');
  tagRow.style.display = 'flex';
  tagRow.style.gap = '8px';
  tagRow.style.alignItems = 'center';

  const tagStatus = document.createElement('span');
  tagStatus.style.color = '#666';
  tagStatus.textContent = 'Closeable tag status: visible';

  // Built directly with `new Tag(...)` (instead of the `createTag`
  // helper) so a text label can be inserted before the close button
  // is appended during construction.
  const closeableTagContainer = document.createElement('span');
  closeableTagContainer.textContent = 'Closeable ';
  const closeableTag = new Tag(closeableTagContainer, {
    variant: 'danger',
    closeable: true,
    onClose: () => {
      tagStatus.textContent = 'Closeable tag status: closed';
    },
  });
  tagRow.appendChild(closeableTag.getElement());
  destroyables.push(closeableTag);

  const tagVariants: Array<'default' | 'primary' | 'info' | 'success'> = ['default', 'primary', 'info', 'success'];
  tagVariants.forEach((variant) => {
    const tag = createTag({ variant });
    tag.getElement().textContent = variant;
    tagRow.appendChild(tag.getElement());
    destroyables.push(tag);
  });

  badgeTagContent.appendChild(tagRow);
  badgeTagContent.appendChild(tagStatus);

  // --- Avatar + AvatarGroup ---
  const avatarContent = createSection(
    'Avatar & AvatarGroup',
    'Standalone avatars (image + initials fallback) and a group with overflow (max=3).'
  );

  const avatarRow = document.createElement('div');
  avatarRow.style.display = 'flex';
  avatarRow.style.gap = '12px';

  const imageAvatar = new Avatar(document.createElement('div'), {
    src: INLINE_AVATAR_SRC,
    alt: 'Jane Doe',
    shape: 'circle',
  });
  avatarRow.appendChild(imageAvatar.getElement());
  destroyables.push(imageAvatar);

  const initialsAvatar = new Avatar(document.createElement('div'), {
    alt: 'John Smith',
    shape: 'circle',
  });
  avatarRow.appendChild(initialsAvatar.getElement());
  destroyables.push(initialsAvatar);

  avatarContent.appendChild(avatarRow);

  const groupLabel = document.createElement('p');
  groupLabel.style.margin = '4px 0 0';
  groupLabel.style.color = '#666';
  groupLabel.textContent = 'Group of 5 avatars, max=3 visible with a "+2" overflow indicator:';
  avatarContent.appendChild(groupLabel);

  const groupContainer = document.createElement('div');
  const avatarGroupData: Array<{ alt: string; src?: string }> = [
    { alt: 'Alice Wu', src: INLINE_AVATAR_SRC },
    { alt: 'Bob Lee' },
    { alt: 'Cara Kim' },
    { alt: 'Derek Fox' },
    { alt: 'Ella Nguyen' },
  ];
  const groupAvatars: Avatar[] = avatarGroupData.map(({ alt, src }) => {
    const el = document.createElement('div');
    groupContainer.appendChild(el);
    return new Avatar(el, { alt, src, shape: 'circle' });
  });
  groupAvatars.forEach((a) => destroyables.push(a));

  // AvatarGroup scans the children already present in `groupContainer`
  // at construction time, so the avatars above must be appended first.
  const avatarGroup = new AvatarGroup(groupContainer, { max: 3, overlap: true });
  avatarContent.appendChild(groupContainer);
  destroyables.push(avatarGroup);

  // --- Card ---
  const cardContent = createSection(
    'Card',
    'A card with a button that toggles its own loading state via showLoading()/hideLoading().'
  );
  const cardWrapper = document.createElement('div');
  cardWrapper.style.maxWidth = '360px';
  const card = createCard({
    title: 'Card title',
    bordered: true,
  });
  const cardBody = card.getElement().querySelector('.ag-card-body');
  if (cardBody) {
    cardBody.textContent = 'Card body content goes here. Toggle loading with the button below.';
  }
  cardWrapper.appendChild(card.getElement());

  let cardLoading = false;
  const cardLoadingBtn = document.createElement('button');
  cardLoadingBtn.type = 'button';
  cardLoadingBtn.textContent = 'Toggle loading';
  cardLoadingBtn.style.marginTop = '8px';
  cardLoadingBtn.addEventListener('click', () => {
    cardLoading = !cardLoading;
    if (cardLoading) {
      card.showLoading();
    } else {
      card.hideLoading();
    }
  });
  cardWrapper.appendChild(cardLoadingBtn);
  cardContent.appendChild(cardWrapper);
  destroyables.push(card);

  // --- Progress ---
  const progressContent = createSection(
    'Progress',
    'A "line" type progress bar. Click the button to increment percent via setPercent().'
  );
  const progressWrapper = document.createElement('div');
  progressWrapper.style.maxWidth = '360px';
  const progress = createProgress({
    type: 'line',
    percent: 20,
    status: 'active',
    format: (percent) => `${percent}%`,
  });
  progressWrapper.appendChild(progress.getElement());

  const progressBtn = document.createElement('button');
  progressBtn.type = 'button';
  progressBtn.textContent = 'Increment +10%';
  progressBtn.style.marginTop = '8px';
  progressBtn.addEventListener('click', () => {
    const next = Math.min(100, progress.getPercent() + 10);
    progress.setPercent(next);
    if (next >= 100) {
      progress.setStatus('success');
    }
  });
  progressWrapper.appendChild(progressBtn);
  progressContent.appendChild(progressWrapper);
  destroyables.push(progress);

  // --- Timeline ---
  const timelineContent = createSection(
    'Timeline',
    'A timeline with several items and a pending final entry.'
  );
  const timeline = createTimeline({ mode: 'left', pending: true, pendingText: 'Recording...' });
  timeline.addItem('Created project', '#4caf50');
  timeline.addItem('Deployed to staging', '#2196f3');
  timeline.addItem('Ran integration tests', '#ff9800');
  timelineContent.appendChild(timeline.getElement());
  destroyables.push(timeline);

  // --- Collapse + CollapsePanel ---
  const collapseContent = createSection(
    'Collapse & CollapsePanel',
    'Click a panel header to expand/collapse its content.'
  );
  const collapseContainer = document.createElement('div');

  const panelDefs = [
    { title: 'What is Argon Kit?', body: 'A pure HTML/CSS/JS component library with zero framework dependencies.' },
    {
      title: 'How do I install it?',
      body: 'Add @argon-kit/html as a workspace dependency and import the components you need.',
    },
    {
      title: 'Is it accessible?',
      body: 'Components ship with sensible ARIA roles; manual verification with assistive tech is still recommended.',
    },
  ];
  // CollapsePanel builds its own header; the content div is added
  // afterward so Collapse (constructed below) can find and toggle it.
  const collapsePanels: CollapsePanel[] = panelDefs.map(({ title, body }) => {
    const panelEl = document.createElement('div');
    collapseContainer.appendChild(panelEl);
    const panel = new CollapsePanel(panelEl, { title });
    const contentDiv = document.createElement('div');
    contentDiv.className = 'ag-collapse-content';
    contentDiv.textContent = body;
    contentDiv.style.maxHeight = '0';
    contentDiv.style.overflow = 'hidden';
    panelEl.appendChild(contentDiv);
    return panel;
  });
  collapsePanels.forEach((p) => destroyables.push(p));

  const collapse = new Collapse(collapseContainer, { bordered: true });
  collapseContent.appendChild(collapseContainer);
  destroyables.push(collapse);

  // --- Steps ---
  const stepsContent = createSection(
    'Steps',
    'Use Previous/Next to move through steps via setCurrent().'
  );
  const steps = createSteps({ current: 0 });
  steps.addItem({ title: 'Account', description: 'Create your account' });
  steps.addItem({ title: 'Verify', description: 'Confirm your email' });
  steps.addItem({ title: 'Profile', description: 'Complete your profile' });
  stepsContent.appendChild(steps.getElement());

  const stepsControls = document.createElement('div');
  stepsControls.style.display = 'flex';
  stepsControls.style.gap = '8px';
  stepsControls.style.marginTop = '8px';

  const stepsPrevBtn = document.createElement('button');
  stepsPrevBtn.type = 'button';
  stepsPrevBtn.textContent = 'Previous';
  const stepsNextBtn = document.createElement('button');
  stepsNextBtn.type = 'button';
  stepsNextBtn.textContent = 'Next';

  let currentStep = 0;
  const totalSteps = steps.getItems().length;
  stepsPrevBtn.addEventListener('click', () => {
    currentStep = Math.max(0, currentStep - 1);
    steps.setCurrent(currentStep);
  });
  stepsNextBtn.addEventListener('click', () => {
    currentStep = Math.min(totalSteps - 1, currentStep + 1);
    steps.setCurrent(currentStep);
  });

  stepsControls.appendChild(stepsPrevBtn);
  stepsControls.appendChild(stepsNextBtn);
  stepsContent.appendChild(stepsControls);
  destroyables.push(steps);

  // --- Slider ---
  const sliderContent = createSection(
    'Slider',
    'Single-value and range (dual handle) sliders. Drag a handle or click the track; the readout below updates via onChange.'
  );

  const singleSliderWrapper = document.createElement('div');
  singleSliderWrapper.style.maxWidth = '360px';
  const singleSliderReadout = document.createElement('p');
  singleSliderReadout.style.margin = '8px 0 0';
  singleSliderReadout.textContent = 'Value: 30';
  const singleSlider = createSlider({
    min: 0,
    max: 100,
    step: 1,
    value: 30,
    onChange: (value) => {
      singleSliderReadout.textContent = `Value: ${String(value)}`;
    },
  });
  singleSliderWrapper.appendChild(singleSlider.getElement());
  singleSliderWrapper.appendChild(singleSliderReadout);
  sliderContent.appendChild(singleSliderWrapper);
  destroyables.push(singleSlider);

  const rangeSliderWrapper = document.createElement('div');
  rangeSliderWrapper.style.maxWidth = '360px';
  rangeSliderWrapper.style.marginTop = '16px';
  const rangeSliderReadout = document.createElement('p');
  rangeSliderReadout.style.margin = '8px 0 0';
  rangeSliderReadout.textContent = 'Range: [20, 70]';
  const rangeSlider = createSlider({
    min: 0,
    max: 100,
    step: 1,
    range: true,
    rangeValue: [20, 70],
    onChange: (value) => {
      if (Array.isArray(value)) {
        rangeSliderReadout.textContent = `Range: [${value[0]}, ${value[1]}]`;
      }
    },
  });
  rangeSliderWrapper.appendChild(rangeSlider.getElement());
  rangeSliderWrapper.appendChild(rangeSliderReadout);
  sliderContent.appendChild(rangeSliderWrapper);
  destroyables.push(rangeSlider);

  // --- Spin ---
  const spinContent = createSection(
    'Spin',
    'Toggle the spinner visibility via setSpinning().'
  );
  const spinWrapper = document.createElement('div');
  spinWrapper.style.display = 'flex';
  spinWrapper.style.alignItems = 'center';
  spinWrapper.style.gap = '12px';
  const spin = createSpin({ spinning: true, tip: 'Loading...' });
  spinWrapper.appendChild(spin.getElement());

  let spinning = true;
  const spinToggleBtn = document.createElement('button');
  spinToggleBtn.type = 'button';
  spinToggleBtn.textContent = 'Toggle spinning';
  spinToggleBtn.addEventListener('click', () => {
    spinning = !spinning;
    spin.setSpinning(spinning);
  });
  spinWrapper.appendChild(spinToggleBtn);
  spinContent.appendChild(spinWrapper);
  destroyables.push(spin);

  // --- Descriptions ---
  const descriptionsContent = createSection(
    'Descriptions',
    'A read-only key/value layout with several items.'
  );
  const descriptions = createDescriptions({ title: 'User Info', bordered: true, column: 2 });
  descriptions.addItem({ label: 'Name', content: 'Jane Doe' });
  descriptions.addItem({ label: 'Role', content: 'Administrator' });
  descriptions.addItem({ label: 'Email', content: 'jane.doe@example.com' });
  descriptions.addItem({ label: 'Status', content: 'Active' });
  descriptionsContent.appendChild(descriptions.getElement());
  destroyables.push(descriptions);

  // --- List ---
  const listContent = createSection('List', 'A simple list with several items.');
  const list = createList({ bordered: true, split: true });
  list.addItem({ title: 'Item one', description: 'First list item description.' });
  list.addItem({ title: 'Item two', description: 'Second list item description.' });
  list.addItem({ title: 'Item three', description: 'Third list item description.' });
  list.addItem({ title: 'Item four', description: 'Fourth list item description.' });
  listContent.appendChild(list.getElement());
  destroyables.push(list);

  // --- Empty ---
  const emptyContent = createSection('Empty', 'Shown when there is no data to display.');
  const empty = createEmpty({ image: 'noData', description: 'No records found' });
  emptyContent.appendChild(empty.getElement());
  destroyables.push(empty);

  // --- Table + Pagination ---
  const tableContent = createSection(
    'Table & Pagination',
    'A table with a custom-rendered "Status" column, plus a separate Pagination instance wired to a page readout.'
  );

  const mockUsers: MockUser[] = [
    { name: 'Alice Johnson', role: 'Admin', status: 'Active' },
    { name: 'Bob Martinez', role: 'Editor', status: 'Active' },
    { name: 'Cara Chen', role: 'Viewer', status: 'Pending' },
    { name: 'Derek Osei', role: 'Editor', status: 'Disabled' },
    { name: 'Ella Fischer', role: 'Admin', status: 'Active' },
    { name: 'Farid Khan', role: 'Viewer', status: 'Pending' },
  ];

  const statusColors: Record<MockUser['status'], string> = {
    Active: '#2e7d32',
    Pending: '#f9a825',
    Disabled: '#c62828',
  };

  const table = createTable({
    columns: [
      { key: 'name', title: 'Name' },
      { key: 'role', title: 'Role' },
      {
        key: 'status',
        title: 'Status',
        render: (value: unknown) => {
          const status = value as MockUser['status'];
          const badge = document.createElement('span');
          badge.textContent = status;
          badge.style.color = statusColors[status];
          badge.style.fontWeight = 'bold';
          return badge;
        },
      },
    ],
    data: mockUsers,
    striped: true,
    hover: true,
    bordered: true,
  });
  tableContent.appendChild(table.getWrapElement());
  destroyables.push(table);

  const paginationWrapper = document.createElement('div');
  paginationWrapper.style.marginTop = '12px';
  const paginationReadout = document.createElement('p');
  paginationReadout.style.margin = '8px 0 0';
  paginationReadout.textContent = 'Current page: 1';
  const pagination = createPagination({
    total: 45,
    pageSize: 10,
    current: 1,
    onChange: (page) => {
      paginationReadout.textContent = `Current page: ${page}`;
    },
  });
  paginationWrapper.appendChild(pagination.getElement());
  paginationWrapper.appendChild(paginationReadout);
  tableContent.appendChild(paginationWrapper);
  destroyables.push(pagination);

  return destroyables;
}
