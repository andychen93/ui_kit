import { mountGeneralDemos } from './demos/general';
import { mountFormsDemos } from './demos/forms';
import { mountDataDisplayDemos } from './demos/dataDisplay';
import { mountNavigationDemos } from './demos/navigation';
import { mountFeedbackDemos } from './demos/feedback';
import { mountProDemos } from './demos/pro';
import { renderCoveragePanel } from './coverage';

/** All instances collected from every demo module, so HMR can clean them up. */
let allInstances: Array<{ destroy?: () => void }> = [];
let chartsInstance: Record<string, { destroy?: () => void }> | null = null;
let editorInstance: { destroy?: () => void } | null = null;
let calendarInstance: { destroy?: () => void } | null = null;

function mountSection(
  sectionId: string,
  mountFn: (container: HTMLElement) => Array<{ destroy?: () => void }>
): void {
  const section = document.getElementById(sectionId);
  if (!section) {
    console.error(`[playground] missing section container: #${sectionId}`);
    return;
  }
  try {
    const instances = mountFn(section);
    allInstances.push(...instances);
  } catch (err) {
    console.error(`[playground] failed to mount ${sectionId}:`, err);
  }
}

// Coverage panel first, so it's visible above every demo section.
const coverageContainer = document.getElementById('coverage-panel');
if (coverageContainer) {
  renderCoveragePanel(coverageContainer);
}

mountSection('section-general', mountGeneralDemos);
mountSection('section-forms', mountFormsDemos);
mountSection('section-data-display', mountDataDisplayDemos);
mountSection('section-navigation', mountNavigationDemos);
mountSection('section-feedback', mountFeedbackDemos);
mountSection('section-pro', mountProDemos);

// --- HTML-only plugin packages: charts, editor, calendar ---

async function initCharts(): Promise<void> {
  try {
    const charts = await import('@argon-kit/html-charts');

    const lineChart = charts.createLineChart('#lineChart', {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
      datasets: [
        {
          label: 'Sales',
          data: [10, 20, 15, 25, 30],
          borderColor: '#FF6384',
          backgroundColor: 'rgba(255, 99, 132, 0.1)',
        },
      ],
    });

    const barChart = charts.createBarChart('#barChart', {
      labels: ['A', 'B', 'C', 'D'],
      datasets: [
        {
          label: 'Values',
          data: [12, 19, 3, 5],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
        },
      ],
    });

    const pieChart = charts.createPieChart('#pieChart', {
      labels: ['Red', 'Blue', 'Yellow'],
      datasets: [
        {
          label: 'Distribution',
          data: [30, 20, 50],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        },
      ],
    });

    const doughnutChart = charts.createDoughnutChart('#doughnutChart', {
      labels: ['Small', 'Medium', 'Large'],
      datasets: [
        {
          label: 'Sizes',
          data: [25, 35, 40],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        },
      ],
    });

    chartsInstance = { lineChart, barChart, pieChart, doughnutChart };
    console.log('[playground] charts initialized');
  } catch (err) {
    console.warn('[playground] @argon-kit/html-charts not available:', err);
  }
}

async function initEditor(): Promise<void> {
  const editorContainer = document.getElementById('editor1');
  if (!editorContainer) return;

  try {
    const { RichText } = await import('@argon-kit/html-editor');
    editorInstance = new RichText(editorContainer, {
      placeholder: 'Type something...',
    });
    console.log('[playground] editor initialized');
  } catch (err) {
    console.warn('[playground] @argon-kit/html-editor not available:', err);
  }
}

async function initCalendar(): Promise<void> {
  const calendarContainer = document.getElementById('calendar1');
  if (!calendarContainer) return;

  try {
    const { ArgonCalendar } = await import('@argon-kit/html-calendar');
    calendarInstance = new ArgonCalendar(calendarContainer, {
      events: [
        {
          title: 'Demo Event',
          start: new Date().toISOString().split('T')[0],
        },
      ],
    });
    console.log('[playground] calendar initialized');
  } catch (err) {
    console.warn('[playground] @argon-kit/html-calendar not available:', err);
  }
}

void initCharts();
void initEditor();
void initCalendar();

function cleanupAll(): void {
  allInstances.forEach((instance) => {
    try {
      instance.destroy?.();
    } catch (err) {
      console.warn('[playground] error during instance destroy:', err);
    }
  });
  allInstances = [];

  if (chartsInstance) {
    Object.values(chartsInstance).forEach((chart) => {
      try {
        chart.destroy?.();
      } catch (err) {
        console.warn('[playground] error destroying chart:', err);
      }
    });
    chartsInstance = null;
  }

  try {
    editorInstance?.destroy?.();
  } catch (err) {
    console.warn('[playground] error destroying editor:', err);
  }
  editorInstance = null;

  try {
    calendarInstance?.destroy?.();
  } catch (err) {
    console.warn('[playground] error destroying calendar:', err);
  }
  calendarInstance = null;
}

// Clean up all instances on HMR so re-mounting doesn't leak listeners/DOM,
// and on page unload as a final safety net.
if (import.meta.hot) {
  import.meta.hot.accept(() => {
    console.log('[playground] HMR detected, cleaning up instances...');
    cleanupAll();
    console.log('[playground] cleanup complete');
  });
}

window.addEventListener('beforeunload', cleanupAll);

console.log('[playground] initialized successfully');
