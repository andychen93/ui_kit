import {
  message,
  showNotification,
  showModal,
  showDrawer,
  createTooltip,
  createPopover,
  createPopconfirm,
  createSweetAlert,
  fireSweetAlert,
  createStatusSwitch,
} from '@argon-kit/html';

interface Destroyable {
  destroy?: () => void;
}

/**
 * Mounts feedback-oriented component demos (Message, Notification, Modal,
 * Drawer, Tooltip, Popover, Popconfirm, SweetAlert, StatusSwitch) into
 * `container`.
 *
 * All DOM for this section is built programmatically. Ephemeral toasts
 * (Message/Notification) clean themselves up and aren't collected, but
 * long-lived instances (Tooltip/Popover/Popconfirm/SweetAlert/StatusSwitch)
 * are collected and returned so the caller can destroy them later.
 */
export function mountFeedbackDemos(container: HTMLElement): Array<{ destroy?: () => void }> {
  const destroyables: Destroyable[] = [];

  function createSection(title: string, description: string): HTMLElement {
    const section = document.createElement('section');
    section.style.marginBottom = '24px';

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
    content.style.flexWrap = 'wrap';
    content.style.gap = '12px';
    content.style.alignItems = 'center';
    section.appendChild(content);

    container.appendChild(section);
    return content;
  }

  function createReadout(initialText: string): HTMLParagraphElement {
    const readout = document.createElement('p');
    readout.style.width = '100%';
    readout.style.margin = '4px 0 0';
    readout.style.fontFamily = 'monospace';
    readout.style.fontSize = '13px';
    readout.textContent = initialText;
    return readout;
  }

  function makeButton(label: string): HTMLButtonElement {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = label;
    btn.className = 'ag-btn ag-btn--secondary';
    return btn;
  }

  // --- Message ---
  const messageContent = createSection(
    'Message',
    'Toast-style messages that auto-dismiss. Click any button to fire one.'
  );
  const messageKinds: Array<{ kind: 'success' | 'error' | 'warning' | 'info'; label: string }> = [
    { kind: 'success', label: 'Success' },
    { kind: 'error', label: 'Error' },
    { kind: 'warning', label: 'Warning' },
    { kind: 'info', label: 'Info' },
  ];
  messageKinds.forEach(({ kind, label }) => {
    const btn = makeButton(`Message: ${label}`);
    btn.addEventListener('click', () => {
      message[kind](`This is a ${label.toLowerCase()} message`);
    });
    messageContent.appendChild(btn);
  });

  // --- Notification ---
  const notificationContent = createSection(
    'Notification',
    'Persistent notifications with a title and description. Auto-dismiss after 5s or close manually.'
  );
  const successNotificationBtn = makeButton('Notify: Success');
  successNotificationBtn.addEventListener('click', () => {
    showNotification({
      type: 'success',
      title: 'Saved successfully',
      description: 'Your changes have been saved.',
    });
  });
  notificationContent.appendChild(successNotificationBtn);

  const errorNotificationBtn = makeButton('Notify: Error');
  errorNotificationBtn.addEventListener('click', () => {
    showNotification({
      type: 'danger',
      title: 'Save failed',
      description: 'Something went wrong while saving.',
    });
  });
  notificationContent.appendChild(errorNotificationBtn);

  // --- Modal ---
  const modalContent = createSection(
    'Modal',
    'A centered overlay dialog with OK/Cancel actions.'
  );
  const modalReadout = createReadout('Modal result: (none yet)');
  const openModalBtn = makeButton('Open Modal');
  openModalBtn.addEventListener('click', () => {
    showModal({
      title: 'Confirm action',
      content: 'Are you sure you want to proceed with this action?',
      onOk: () => {
        modalReadout.textContent = 'Modal result: OK clicked';
      },
      onCancel: () => {
        modalReadout.textContent = 'Modal result: Cancel clicked';
      },
    });
  });
  modalContent.appendChild(openModalBtn);
  modalContent.appendChild(modalReadout);

  // --- Drawer ---
  const drawerContent = createSection(
    'Drawer',
    'A side panel that slides in, closable via the mask or close button.'
  );
  const drawerReadout = createReadout('Drawer result: (none yet)');
  const openDrawerBtn = makeButton('Open Drawer');
  openDrawerBtn.addEventListener('click', () => {
    showDrawer({
      title: 'Details',
      content: 'Extra information shown in a drawer panel.',
      onClose: () => {
        drawerReadout.textContent = 'Drawer result: closed';
      },
    });
  });
  drawerContent.appendChild(openDrawerBtn);
  drawerContent.appendChild(drawerReadout);

  // --- Tooltip ---
  const tooltipContent = createSection(
    'Tooltip',
    'Hover over the button below to see a tooltip.'
  );
  const tooltipTarget = makeButton('Hover me');
  tooltipContent.appendChild(tooltipTarget);
  const tooltip = createTooltip(tooltipTarget, {
    title: 'This is a helpful tooltip',
    trigger: 'hover',
    position: 'top',
  });
  destroyables.push(tooltip);

  // --- Popover ---
  const popoverContent = createSection(
    'Popover',
    'Click the button below to toggle a popover with a title and content.'
  );
  const popoverTarget = makeButton('Click for popover');
  popoverContent.appendChild(popoverTarget);
  const popover = createPopover(popoverTarget, {
    title: 'Popover title',
    content: 'This is the popover content, shown on click.',
    trigger: 'click',
  });
  destroyables.push(popover);

  // --- Popconfirm ---
  const popconfirmContent = createSection(
    'Popconfirm',
    'Click Delete to see a confirmation popup before the action proceeds.'
  );
  const popconfirmReadout = createReadout('Popconfirm result: (none yet)');
  const deleteTarget = makeButton('Delete');
  popconfirmContent.appendChild(deleteTarget);
  popconfirmContent.appendChild(popconfirmReadout);
  const popconfirm = createPopconfirm(deleteTarget, {
    title: 'Delete this item?',
    description: 'This action cannot be undone.',
    okText: 'Delete',
    cancelText: 'Cancel',
    trigger: 'click',
    onConfirm: () => {
      popconfirmReadout.textContent = 'Popconfirm result: confirmed (item deleted)';
    },
    onCancel: () => {
      popconfirmReadout.textContent = 'Popconfirm result: cancelled';
    },
  });
  destroyables.push(popconfirm);

  // --- SweetAlert ---
  const sweetAlertContent = createSection(
    'SweetAlert',
    'A large modal alert. One button uses createSweetAlert() + show() directly, ' +
      'the other uses the Promise-based fireSweetAlert() API.'
  );
  const sweetAlertReadout = createReadout('SweetAlert result: (none yet)');

  const directSweetAlertBtn = makeButton('SweetAlert: direct API');
  directSweetAlertBtn.addEventListener('click', () => {
    const mask = document.createElement('div');
    mask.className = 'ag-sweet-alert-mask';
    mask.style.position = 'fixed';
    mask.style.inset = '0';
    mask.style.display = 'flex';
    mask.style.alignItems = 'center';
    mask.style.justifyContent = 'center';
    mask.style.background = 'rgba(0, 0, 0, 0.45)';
    mask.style.zIndex = '1000';

    const alert = createSweetAlert({
      type: 'success',
      title: 'Direct API',
      description: 'Created via createSweetAlert() and shown manually.',
      showConfirm: true,
      showCancel: true,
      onConfirm: () => {
        sweetAlertReadout.textContent = 'SweetAlert result: direct API confirmed';
        mask.remove();
      },
      onCancel: () => {
        sweetAlertReadout.textContent = 'SweetAlert result: direct API cancelled';
        mask.remove();
      },
    });

    mask.appendChild(alert.getElement());
    document.body.appendChild(mask);
    alert.show();
  });
  sweetAlertContent.appendChild(directSweetAlertBtn);

  const fireSweetAlertBtn = makeButton('SweetAlert: fireSweetAlert()');
  fireSweetAlertBtn.addEventListener('click', () => {
    void fireSweetAlert({
      type: 'question',
      title: 'Promise-based API',
      description: 'This alert resolves a Promise once you confirm or cancel.',
      showConfirm: true,
      showCancel: true,
    }).then((result) => {
      sweetAlertReadout.textContent = `SweetAlert result: { confirmed: ${result.confirmed} }`;
    });
  });
  sweetAlertContent.appendChild(fireSweetAlertBtn);
  sweetAlertContent.appendChild(sweetAlertReadout);

  // --- StatusSwitch ---
  const statusSwitchContent = createSection(
    'StatusSwitch',
    'An async-aware switch. The first instance always succeeds after a short delay; ' +
      'the second instance rejects on every other change to demonstrate rollback.'
  );

  // Instance 1: always confirms, always succeeds after a fake delay.
  const successSwitchWrapper = document.createElement('div');
  successSwitchWrapper.style.display = 'flex';
  successSwitchWrapper.style.flexDirection = 'column';
  successSwitchWrapper.style.gap = '4px';

  const successSwitchReadout = createReadout('Success switch: value=false, pending=false');
  const successSwitch = createStatusSwitch({
    checked: false,
    confirm: () => true,
    onChange: (value) =>
      new Promise<void>((resolve) => {
        successSwitchReadout.textContent = `Success switch: value=${value} (pending...)`;
        setTimeout(() => {
          successSwitchReadout.textContent = `Success switch: value=${value}, pending=false`;
          resolve();
        }, 800);
      }),
  });
  successSwitchWrapper.appendChild(successSwitch.getElement());
  successSwitchWrapper.appendChild(successSwitchReadout);
  statusSwitchContent.appendChild(successSwitchWrapper);
  destroyables.push(successSwitch);

  // Instance 2: rejects every other change, to demonstrate rollback.
  const rollbackSwitchWrapper = document.createElement('div');
  rollbackSwitchWrapper.style.display = 'flex';
  rollbackSwitchWrapper.style.flexDirection = 'column';
  rollbackSwitchWrapper.style.gap = '4px';

  const rollbackSwitchReadout = createReadout('Rollback switch: value=false, pending=false');
  let toggleCount = 0;
  const rollbackSwitch = createStatusSwitch({
    checked: false,
    confirm: () => true,
    onChange: (value) =>
      new Promise<void>((resolve, reject) => {
        toggleCount += 1;
        const shouldFail = toggleCount % 2 === 0;
        rollbackSwitchReadout.textContent = `Rollback switch: value=${value} (pending...)`;
        setTimeout(() => {
          if (shouldFail) {
            reject(new Error('Simulated server rejection'));
          } else {
            resolve();
          }
        }, 800);
      }).then(
        () => {
          rollbackSwitchReadout.textContent = `Rollback switch: value=${value}, pending=false`;
        },
        (err: unknown) => {
          const err0 = err instanceof Error ? err.message : String(err);
          rollbackSwitchReadout.textContent = `Rollback switch: rolled back (error: ${err0})`;
          throw err;
        }
      ),
  });
  rollbackSwitchWrapper.appendChild(rollbackSwitch.getElement());
  rollbackSwitchWrapper.appendChild(rollbackSwitchReadout);
  statusSwitchContent.appendChild(rollbackSwitchWrapper);
  destroyables.push(rollbackSwitch);

  return destroyables;
}
