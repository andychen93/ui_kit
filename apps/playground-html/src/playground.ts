import {
    Button,
    Input,
    Checkbox,
    Radio,
    RadioGroup,
    Select,
    Form,
    Message,
    Notification,
    showMessage,
    showNotification,
    showModal,
    showDrawer,
    Table,
    createTable,
    Pagination,
    createPagination,
    Dropdown,
    Tree,
    createTree,
    Upload
} from '@argon-kit/html';

// IIFE to encapsulate playground code
(() => {
    // Try to import chart functions if available
    let chartsAvailable = false;
    async function initCharts() {
        try {
            const charts = await import('@argon-kit/html-charts');
            chartsAvailable = true;
            window.chartFunctions = charts;
            initChartsUI();
        } catch (e) {
            console.log('Charts not available:', e.message);
        }
    }

        function initChartsUI() {
            if (!chartsAvailable || !window.chartFunctions) return;

            try {
                const { createLineChart, createBarChart, createPieChart, createDoughnutChart } = window.chartFunctions;

                // Line Chart
                createLineChart('#lineChart', {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
                    datasets: [{
                        label: 'Sales',
                        data: [10, 20, 15, 25, 30],
                        borderColor: '#FF6384',
                        backgroundColor: 'rgba(255, 99, 132, 0.1)'
                    }]
                });

                // Bar Chart
                createBarChart('#barChart', {
                    labels: ['A', 'B', 'C', 'D'],
                    datasets: [{
                        label: 'Values',
                        data: [12, 19, 3, 5],
                        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
                    }]
                });

                // Pie Chart
                createPieChart('#pieChart', {
                    labels: ['Red', 'Blue', 'Yellow'],
                    datasets: [{
                        label: 'Distribution',
                        data: [30, 20, 50],
                        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
                    }]
                });

                // Doughnut Chart
                createDoughnutChart('#doughnutChart', {
                    labels: ['Small', 'Medium', 'Large'],
                    datasets: [{
                        label: 'Sizes',
                        data: [25, 35, 40],
                        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
                    }]
                });
            } catch (e) {
                console.log('Chart initialization error:', e.message);
            }
        }

        // Button examples
        new Button('#btn1', {
            variant: 'primary',
            onClick: () => showMessage('Primary button clicked!')
        });

        new Button('#btn2', {
            variant: 'secondary',
            onClick: () => showMessage('Secondary button clicked!')
        });

        new Button('#btn3', {
            variant: 'danger',
            onClick: () => showMessage('Danger button clicked!')
        });

        // Input examples
        new Input('#input1', {
            onChange: (value) => console.log('Input 1:', value)
        });

        new Input('#input2', {
            type: 'email',
            onChange: (value) => console.log('Input 2:', value)
        });

        new Input('#input3', {
            type: 'password',
            onChange: (value) => console.log('Input 3: password changed')
        });

        // Checkbox examples
        new Checkbox('#check1', {
            onChange: (checked) => console.log('Checkbox 1:', checked)
        });

        new Checkbox('#check2', {
            onChange: (checked) => console.log('Checkbox 2:', checked)
        });

        // Radio group example
        new RadioGroup('#radiogroup-color', {
            name: 'color',
            onChange: (value) => console.log('Selected color:', value)
        });

        // Select example
        new Select('#select1', {
            onChange: (value) => console.log('Selected:', value)
        });

        // Form example
        new Form('#form1', {
            fields: [
                { name: 'username', required: true, minLength: 3 },
                { name: 'email', required: true, pattern: '^[^@]+@[^@]+$' },
                { name: 'password', required: true, minLength: 6 }
            ],
            onSubmit: (data) => {
                console.log('Form submitted:', data);
                showMessage('Form submitted successfully!');
            }
        });

        // Table example
        const table = createTable({
            columns: [
                { key: 'name', title: 'Name' },
                { key: 'email', title: 'Email' },
                { key: 'status', title: 'Status' }
            ],
            data: [
                { name: 'John Doe', email: 'john@example.com', status: 'Active' },
                { name: 'Jane Smith', email: 'jane@example.com', status: 'Pending' },
                { name: 'Bob Wilson', email: 'bob@example.com', status: 'Active' }
            ]
        });
        document.getElementById('table1').replaceWith(table.getElement());

        // Pagination example
        const paginationContainer = document.createElement('div');
        document.getElementById('pagination1').appendChild(paginationContainer);
        const pagination = new Pagination(paginationContainer, {
            total: 100,
            pageSize: 10,
            onChange: (page) => console.log('Page changed to:', page)
        });

        // Dropdown example
        const dropdown = new Dropdown('#dropdown-trigger', {
            items: [
                { label: 'Menu Item 1', value: 'item1' },
                { label: 'Menu Item 2', value: 'item2' },
                {
                    label: 'Submenu',
                    value: 'submenu',
                    children: [
                        { label: 'Sub Item 1', value: 'sub1' },
                        { label: 'Sub Item 2', value: 'sub2' }
                    ]
                },
                { label: 'Menu Item 3 (Disabled)', value: 'item3', disabled: true }
            ],
            trigger: 'click'
        });

        // Tree example
        const tree = new Tree('#tree1', {
            data: [
                {
                    label: 'Node 1',
                    value: 'node1',
                    children: [
                        { label: 'Node 1.1', value: 'node1.1' },
                        { label: 'Node 1.2', value: 'node1.2' }
                    ]
                },
                {
                    label: 'Node 2',
                    value: 'node2',
                    children: [
                        { label: 'Node 2.1', value: 'node2.1' }
                    ]
                }
            ],
            onChange: (value) => console.log('Tree node selected:', value)
        });

        // Message shortcuts
        window.showMessageSuccess = () => {
            showMessage('Success message!', { type: 'success', duration: 3000 });
        };

        window.showMessageError = () => {
            showMessage('Error message!', { type: 'danger', duration: 3000 });
        };

        window.showMessageWarning = () => {
            showMessage('Warning message!', { type: 'warning', duration: 3000 });
        };

        window.showMessageInfo = () => {
            showMessage('Info message!', { type: 'info', duration: 3000 });
        };

        // Notification
        window.showNotificationSuccess = () => {
            showNotification({
                type: 'success',
                title: 'Success',
                description: 'Operation completed successfully!'
            });
        };

        window.showNotificationError = () => {
            showNotification({
                type: 'danger',
                title: 'Error',
                description: 'Something went wrong!'
            });
        };

        // Modal and Drawer
        window.showModalDemo = () => {
            showModal({
                title: 'Modal Demo',
                content: 'This is a modal dialog. Click OK or Cancel to close.',
                onOk: () => console.log('Modal OK clicked'),
                onCancel: () => console.log('Modal Cancel clicked')
            });
        };

        window.showDrawerDemo = () => {
            showDrawer({
                title: 'Drawer Demo',
                content: 'This is a drawer component. Click outside or the close button to close.',
                onClose: () => console.log('Drawer closed')
            });
        };

        // Charts (if available)
        initCharts().then(() => {
            console.log('Charts initialized');
        });

        // Upload
        const uploadInput = document.getElementById('upload1');
        const uploadInfo = document.getElementById('upload-info');
        if (uploadInput) {
            uploadInput.addEventListener('change', (e) => {
                const files = e.target.files;
                let info = `<p>Selected ${files.length} file(s):</p><ul>`;
                for (let file of files) {
                    info += `<li>${file.name} (${(file.size / 1024).toFixed(2)} KB)</li>`;
                }
                info += '</ul>';
                uploadInfo.innerHTML = info;
            });
        }

        // DatePicker
        const dateInput = document.getElementById('datepicker1');
        if (dateInput) {
            dateInput.addEventListener('change', (e) => {
                console.log('Date selected:', e.target.value);
            });
        }

        // DateRangePicker
        const startDate = document.getElementById('startDate');
        const endDate = document.getElementById('endDate');
        if (startDate && endDate) {
            startDate.addEventListener('change', () => {
                console.log('Date range selected:', startDate.value, 'to', endDate.value);
            });
            endDate.addEventListener('change', () => {
                console.log('Date range selected:', startDate.value, 'to', endDate.value);
            });
        }

        console.log('Playground initialized successfully!');
    })();

