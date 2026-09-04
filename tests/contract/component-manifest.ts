/**
 * Component Manifest - Common Components Across React/Vue/Svelte/HTML
 * 
 * This file defines the set of components that must be implemented across all
 * framework implementations (React, Vue, Svelte, HTML) for consistent API coverage.
 */

export const commonComponents = [
  // Form components
  'Button',
  'Input',
  'Password',
  'Textarea',
  'InputNumber',
  'Select',
  'Checkbox',
  'Radio',
  'RadioGroup',
  'Switch',
  'Upload',
  
  // Overlay components
  'Tooltip',
  'Popover',
  'Dropdown',
  'Modal',
  'Drawer',
  'Popconfirm',
  
  // Date components
  'DatePicker',
  'RangePicker',
  
  // Table components
  'Table',
  'Pagination',
  
  // Pro components
  'PageSelect',
  'QueryForm',
  'ProTable',
  'RowActions',
  'StatusSwitch',
  'TreeSelect',
  'Tree',
  
  // Layout components
  'AppShell',
  'Menu',
  'Breadcrumb',
  'Tabs',
  'Login',
  'StatCard',
  'Result',
  'Transfer',
  
  // Data display components
  'Alert',
  'Badge',
  'Tag',
  'Avatar',
  'AvatarGroup',
  'Card',
  'Progress',
  'Timeline',
  'Collapse',
  'CollapsePanel',
  'Steps',
  'Slider',
  'Spin',
  'Descriptions',
  'List',
  'Empty',
  'SweetAlert',
  
  // Form components
  'Form',
  'FormItem',
  
  // Pro components
  'CrudFormModal',
] as const;

export type CommonComponent = typeof commonComponents[number];

/**
 * Check if HTML package exports all common components
 */
export function validateHtmlCoverage(htmlExports: Record<string, any>): {
  missing: string[];
  coverage: number;
} {
  const missing: string[] = [];
  
  for (const component of commonComponents) {
    if (!htmlExports[component]) {
      missing.push(component);
    }
  }
  
  const total = commonComponents.length;
  const present = total - missing.length;
  const coverage = (present / total) * 100;
  
  return { missing, coverage };
}

/**
 * Generate coverage report
 */
export function generateCoverageReport(htmlExports: Record<string, any>): string {
  const { missing, coverage } = validateHtmlCoverage(htmlExports);
  
  let report = `Component Coverage Report\n`;
  report += `========================\n`;
  report += `Total common components: ${commonComponents.length}\n`;
  report += `HTML exported: ${commonComponents.length - missing.length}\n`;
  report += `Missing: ${missing.length}\n`;
  report += `Coverage: ${coverage.toFixed(1)}%\n`;
  
  if (missing.length > 0) {
    report += `\nMissing Components:\n`;
    for (const comp of missing) {
      report += `  - ${comp}\n`;
    }
  }
  
  return report;
}
