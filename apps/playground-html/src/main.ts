// Import styles from @argon-kit/styles
import '@argon-kit/styles';
import '@argon-kit/styles/button.css';
import '@argon-kit/styles/form.css';
import '@argon-kit/styles/overlay.css';
import '@argon-kit/styles/table.css';
import '@argon-kit/styles/layout.css';
import '@argon-kit/styles/display.css';
import '@argon-kit/styles/feedback.css';
import '@argon-kit/styles/vendors.css';

// Import the playground
import './playground';

// Ensure styles are loaded before mounting
document.addEventListener('DOMContentLoaded', () => {
    console.log('Playground styles loaded');
});
