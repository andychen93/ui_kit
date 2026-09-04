import {
  QueryForm,
  ProTable,
  RowActions,
  PageSelect,
  CrudFormModal,
} from '@argon-kit/html';
import type {
  QueryFormItem,
  ProTableOptions,
  TableColumn,
  RowAction,
  PageSelectOptions,
} from '@argon-kit/html';

interface Destroyable {
  destroy?: () => void;
}

interface MockUser {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive';
}

// ---------------------------------------------------------------------------
// Shared in-memory mock dataset (~25 fake users) + a shared mock "service"
// layer. Two request/response shapes are implemented against the SAME
// underlying array so ProTable and PageSelect stay consistent with each
// other: ProTable's `request` returns `{ data, total }`, PageSelect's
// `service` returns `{ list, total }` (see pro-table.ts / page-select.ts).
// Every call goes through a real Promise + setTimeout delay - no network
// requests are made anywhere in this module.
// ---------------------------------------------------------------------------

const FIRST_NAMES = [
  'Alice', 'Bob', 'Cara', 'Derek', 'Ella', 'Farid', 'Grace', 'Hassan',
  'Ivy', 'Jamal', 'Kira', 'Leo', 'Mona', 'Noah', 'Olga', 'Priya',
  'Quinn', 'Rosa', 'Sami', 'Tara', 'Uma', 'Victor', 'Wendy', 'Xavier', 'Yara',
];
const LAST_NAMES = [
  'Johnson', 'Martinez', 'Chen', 'Osei', 'Fischer', 'Khan', 'Lopez', 'Ahmed',
  'Nguyen', 'Silva', 'Novak', 'Park', 'Rossi', 'Kim', 'Ivanova', 'Sharma',
  'Bell', 'Diaz', 'Haddad', 'Fontaine', 'Berg', 'Reyes', 'Zhou', 'Adler', 'Costa',
];
const ROLES = ['Admin', 'Editor', 'Viewer'];

let nextUserId = 1;

function makeUser(index: number): MockUser {
  const id = nextUserId++;
  const first = FIRST_NAMES[index % FIRST_NAMES.length];
  const last = LAST_NAMES[index % LAST_NAMES.length];
  const name = `${first} ${last}`;
  return {
    id,
    name,
    email: `${first.toLowerCase()}.${last.toLowerCase()}@example.com`,
    role: ROLES[index % ROLES.length],
    status: index % 3 === 0 ? 'Inactive' : 'Active',
  };
}

/** The single shared in-memory "table" every demo in this module reads/writes. */
let users: MockUser[] = Array.from({ length: 25 }, (_, i) => makeUser(i));

function delay(ms = 250 + Math.random() * 150): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function matchesKeyword(user: MockUser, keyword: string): boolean {
  const k = keyword.trim().toLowerCase();
  if (!k) return true;
  return user.name.toLowerCase().includes(k) || user.email.toLowerCase().includes(k);
}

function compareValues(a: unknown, b: unknown): number {
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  return String(a).localeCompare(String(b));
}

/** Local mirror of pro-table.ts's `ProTableRequestParams` (that type isn't re-exported). */
interface MockTableRequestParams {
  current: number;
  pageSize: number;
  sortKey?: string | null;
  sortOrder?: 'asc' | 'desc' | null;
  [key: string]: any;
}

/** Local mirror of pro-table.ts's `ProTableRequestResult`. */
interface MockTableRequestResult {
  data: MockUser[];
  total: number;
}

/**
 * Mock service matching ProTable's `request` shape: honors pagination
 * (current/pageSize), an extra `keyword` param (from QueryForm), an extra
 * `status` param (from QueryForm), and sortKey/sortOrder (from clicking a
 * sortable column header).
 */
async function mockTableRequest(params: MockTableRequestParams): Promise<MockTableRequestResult> {
  await delay();

  let filtered = users.slice();

  const keyword = typeof params.keyword === 'string' ? params.keyword : '';
  if (keyword) {
    filtered = filtered.filter((u) => matchesKeyword(u, keyword));
  }

  const status = typeof params.status === 'string' ? params.status : '';
  if (status) {
    filtered = filtered.filter((u) => u.status === status);
  }

  if (params.sortKey && params.sortOrder) {
    const key = params.sortKey;
    const order = params.sortOrder;
    filtered = filtered.slice().sort((a, b) => {
      const cmp = compareValues((a as any)[key], (b as any)[key]);
      return order === 'asc' ? cmp : -cmp;
    });
  }

  const total = filtered.length;
  const start = (params.current - 1) * params.pageSize;
  const data = filtered.slice(start, start + params.pageSize);
  return { data, total };
}

/** Local mirror of page-select.ts's `PageSelectRequestParams`. */
interface MockPageSelectParams {
  pageNum: number;
  pageSize: number;
  keyword?: string;
}

/** Local mirror of page-select.ts's `PageSelectRequestResult<MockUser>`. */
interface MockPageSelectResult {
  list: MockUser[];
  total: number;
}

/**
 * Mock service matching PageSelect's `service` shape: honors pagination
 * (pageNum/pageSize) and an optional keyword filter against name/email.
 */
async function mockPageSelectService(params: MockPageSelectParams): Promise<MockPageSelectResult> {
  await delay();

  let filtered = users.slice();
  if (params.keyword) {
    filtered = filtered.filter((u) => matchesKeyword(u, params.keyword as string));
  }

  const total = filtered.length;
  const start = (params.pageNum - 1) * params.pageSize;
  const list = filtered.slice(start, start + params.pageSize);
  return { list, total };
}

const STATUS_COLORS: Record<MockUser['status'], string> = {
  Active: '#2e7d32',
  Inactive: '#c62828',
};

/**
 * Mounts every "Pro" component demo (QueryForm, ProTable, RowActions,
 * CrudFormModal, PageSelect) into `container`, wired together into one
 * cohesive CRUD flow backed by a shared in-memory mock dataset and a real
 * async (Promise + setTimeout) mock service layer. No network requests are
 * made. All DOM for this section is built programmatically.
 *
 * Returns every created long-lived component instance that exposes a
 * `destroy` method (QueryForm, ProTable, CrudFormModal, PageSelect).
 * RowActions instances are created per-row inside ProTable's column
 * `render` callback and are re-created on every render/reload; since
 * ProTable fully rebuilds its `<tbody>` on each render, the old row's
 * DOM (and the plain click listeners RowActions attached to it) is
 * discarded together, so those transient instances don't need tracking.
 */
export function mountProDemos(container: HTMLElement): Array<{ destroy?: () => void }> {
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

    container.appendChild(section);
    return section;
  }

  // -------------------------------------------------------------------
  // CRUD demo area: QueryForm -> ProTable (with RowActions + sorting +
  // pagination) -> CrudFormModal for create/edit.
  // -------------------------------------------------------------------

  const crudSection = document.createElement('section');
  crudSection.style.marginBottom = '32px';
  crudSection.style.border = '1px solid #e0e0e0';
  crudSection.style.borderRadius = '8px';
  crudSection.style.padding = '16px';
  container.appendChild(crudSection);

  const crudHeading = document.createElement('h2');
  crudHeading.textContent = 'CRUD Demo: QueryForm + ProTable + RowActions + CrudFormModal';
  crudHeading.style.marginTop = '0';
  crudSection.appendChild(crudHeading);

  const crudIntro = document.createElement('p');
  crudIntro.style.color = '#666';
  crudIntro.textContent =
    'A single cohesive flow backed by a 25-record in-memory mock dataset and a real ' +
    'Promise-based mock service (200-400ms artificial delay). Search/filter, sort, ' +
    'paginate, create, edit, and delete all exercise the async request/response cycle.';
  crudSection.appendChild(crudIntro);

  // --- QueryForm ---
  const queryFormHeading = document.createElement('h3');
  queryFormHeading.textContent = 'QueryForm';
  crudSection.appendChild(queryFormHeading);

  const queryFormDesc = document.createElement('p');
  queryFormDesc.style.color = '#666';
  queryFormDesc.style.marginTop = '0';
  queryFormDesc.textContent =
    'Search by keyword (matches name/email) and filter by status. Search triggers ' +
    "ProTable's search() (resets to page 1); Reset clears both fields and reloads the unfiltered view.";
  crudSection.appendChild(queryFormDesc);

  const queryFormItems: QueryFormItem[] = [
    { name: 'keyword', label: 'Keyword', type: 'input', placeholder: 'Search name or email' },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { label: 'All', value: '' },
        { label: 'Active', value: 'Active' },
        { label: 'Inactive', value: 'Inactive' },
      ],
    },
  ];

  const queryFormContainer = document.createElement('div');
  crudSection.appendChild(queryFormContainer);

  const queryForm = new QueryForm(queryFormContainer, {
    items: queryFormItems,
    initialValues: { keyword: '', status: '' },
    onSearch: (values) => {
      void proTable.search(values);
    },
    onReset: (values) => {
      void proTable.search(values);
    },
  });
  destroyables.push(queryForm);

  // --- ProTable (+ RowActions column) ---
  const proTableHeading = document.createElement('h3');
  proTableHeading.textContent = 'ProTable';
  crudSection.appendChild(proTableHeading);

  const proTableDesc = document.createElement('p');
  proTableDesc.style.color = '#666';
  proTableDesc.style.marginTop = '0';
  proTableDesc.textContent =
    'Click "ID" or "Name" headers to sort (handled by the mock service). Pagination is ' +
    'set to 6 rows/page across 25 records so Previous/Next controls are exercised.';
  crudSection.appendChild(proTableDesc);

  const createButton = document.createElement('button');
  createButton.type = 'button';
  createButton.textContent = 'Create user';
  createButton.style.marginBottom = '12px';
  crudSection.appendChild(createButton);

  const proTableContainer = document.createElement('div');
  crudSection.appendChild(proTableContainer);

  const columns: TableColumn[] = [
    { key: 'id', title: 'ID', dataIndex: 'id', sortable: true, width: '60px' },
    { key: 'name', title: 'Name', dataIndex: 'name', sortable: true },
    { key: 'email', title: 'Email', dataIndex: 'email' },
    { key: 'role', title: 'Role', dataIndex: 'role' },
    {
      key: 'status',
      title: 'Status',
      dataIndex: 'status',
      render: (value) => {
        const status = value as MockUser['status'];
        const badge = document.createElement('span');
        badge.textContent = status;
        badge.style.color = STATUS_COLORS[status];
        badge.style.fontWeight = 'bold';
        return badge;
      },
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (_value, record, index) => {
        const wrapper = document.createElement('div');
        const actions: RowAction[] = [
          {
            key: 'edit',
            text: 'Edit',
            onClick: (rec: MockUser) => openEditModal(rec),
          },
          {
            key: 'delete',
            text: 'Delete',
            danger: true,
            onClick: (rec: MockUser) => handleDelete(rec),
          },
        ];
        // Transient per-row instance: intentionally not tracked for
        // destroy(). See the JSDoc on mountProDemos for why this is safe.
        const rowActions = new RowActions(wrapper, { record, index, actions });
        return rowActions.getElement();
      },
    },
  ];

  const proTableOptions: ProTableOptions = {
    columns,
    request: mockTableRequest,
    pagination: { current: 1, pageSize: 6 },
    emptyText: 'No users match your search',
  };

  const proTable = new ProTable(proTableContainer, proTableOptions);
  destroyables.push(proTable);

  // --- RowActions (documented here; actual instances live inside the
  // ProTable "Actions" column render() above) ---
  const rowActionsHeading = document.createElement('h3');
  rowActionsHeading.textContent = 'RowActions';
  crudSection.appendChild(rowActionsHeading);

  const rowActionsDesc = document.createElement('p');
  rowActionsDesc.style.color = '#666';
  rowActionsDesc.style.marginTop = '0';
  rowActionsDesc.textContent =
    'Rendered per row inside the ProTable "Actions" column above. "Edit" opens the ' +
    'CrudFormModal below pre-filled with that row; "Delete" removes the record and reloads the table.';
  crudSection.appendChild(rowActionsDesc);

  // --- CrudFormModal (single reused instance for both create and edit) ---
  const crudModalHeading = document.createElement('h3');
  crudModalHeading.textContent = 'CrudFormModal';
  crudSection.appendChild(crudModalHeading);

  const crudModalDesc = document.createElement('p');
  crudModalDesc.style.color = '#666';
  crudModalDesc.style.marginTop = '0';
  crudModalDesc.textContent =
    'One modal instance is reused for both "Create user" (above) and "Edit" (in the Actions ' +
    'column). Submitting simulates an async save, then reloads the ProTable on success.';
  crudSection.appendChild(crudModalDesc);

  const crudModalContainer = document.createElement('div');
  crudSection.appendChild(crudModalContainer);

  // Reassigned per-open so the single modal instance can drive either the
  // "create" or "edit" flow without needing to be recreated each time.
  let submitHandler: (values: Record<string, any>) => Promise<void> = async () => {};

  const crudModal = new CrudFormModal(crudModalContainer, {
    mode: 'create',
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'role', label: 'Role', type: 'text', required: true, placeholder: 'Admin, Editor, or Viewer' },
      { name: 'status', label: 'Status', type: 'text', required: true, placeholder: 'Active or Inactive' },
    ],
    onOk: (values) => submitHandler(values),
  });
  destroyables.push(crudModal);

  function openCreateModal(): void {
    crudModal.setMode('create');
    crudModal.setTitle('Create user');
    crudModal.setValues({ name: '', email: '', role: '', status: '' });
    submitHandler = async (values) => {
      await delay();
      const status: MockUser['status'] = values.status === 'Inactive' ? 'Inactive' : 'Active';
      users = [...users, { id: nextUserId++, name: values.name, email: values.email, role: values.role, status }];
      await proTable.reload();
    };
    crudModal.show();
  }

  function openEditModal(record: MockUser): void {
    crudModal.setMode('edit');
    crudModal.setTitle(`Edit user #${record.id}`);
    crudModal.setValues({
      name: record.name,
      email: record.email,
      role: record.role,
      status: record.status,
    });
    submitHandler = async (values) => {
      await delay();
      const status: MockUser['status'] = values.status === 'Inactive' ? 'Inactive' : 'Active';
      users = users.map((u) =>
        u.id === record.id ? { ...u, name: values.name, email: values.email, role: values.role, status } : u
      );
      await proTable.reload();
    };
    crudModal.show();
  }

  function handleDelete(record: MockUser): void {
    void (async () => {
      await delay(200);
      users = users.filter((u) => u.id !== record.id);
      await proTable.reload();
    })();
  }

  createButton.addEventListener('click', () => openCreateModal());

  // -------------------------------------------------------------------
  // Standalone PageSelect demo (separate from the CRUD area above).
  // -------------------------------------------------------------------

  const pageSelectSection = createSection(
    'PageSelect',
    'A standalone searchable, paginated single-record picker over the same mock dataset. ' +
      'Type to debounce-search by name/email, page through results, and select a full record.'
  );

  const pageSelectContainer = document.createElement('div');
  pageSelectSection.appendChild(pageSelectContainer);

  const selectedReadout = document.createElement('p');
  selectedReadout.style.marginTop = '8px';
  selectedReadout.style.color = '#333';
  selectedReadout.textContent = 'Selected record: (none)';
  pageSelectSection.appendChild(selectedReadout);

  const pageSelectOptions: PageSelectOptions<MockUser> = {
    service: mockPageSelectService,
    columns: [
      { key: 'name', title: 'Name', dataIndex: 'name' },
      { key: 'email', title: 'Email', dataIndex: 'email' },
    ],
    rowKey: 'id',
    labelField: 'name',
    placeholder: 'Search a user by name or email...',
    searchField: 'name',
    pageSize: 5,
    searchDebounce: 300,
    allowClear: true,
    onChange: (record) => {
      selectedReadout.textContent = record
        ? `Selected record: #${record.id} ${record.name} <${record.email}> (${record.role}, ${record.status})`
        : 'Selected record: (none)';
    },
  };

  const pageSelect = new PageSelect<MockUser>(pageSelectContainer, pageSelectOptions);
  destroyables.push(pageSelect);

  return destroyables;
}
