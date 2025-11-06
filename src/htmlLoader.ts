// HTML Loader - reads HTML files from public/pages at build time

import landingHTML from '../public/pages/landing.html?raw';
import loginHTML from '../public/pages/login.html?raw';
import registerHTML from '../public/pages/register.html?raw';
import dashboardHTML from '../public/pages/dashboard.html?raw';

export function getHTML(page: string): string {
  switch (page) {
    case 'landing':
      return landingHTML;
    case 'login':
      return loginHTML;
    case 'register':
      return registerHTML;
    case 'dashboard':
      return dashboardHTML;
    default:
      return '<!DOCTYPE html><html><body><h1>404 - Not Found</h1></body></html>';
  }
}
