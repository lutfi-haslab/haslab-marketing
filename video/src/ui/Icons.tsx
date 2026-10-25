import React from 'react';
import type {IconName} from '../brand';

// Stroke glyphs matched to the real app chrome (forge-ade / kendali-ai):
// plus/search/calendar/board/git sidebar, funnel/trash/pin filters, and the
// composer chips: shield · spark · target · arrow-up send · chevron.
const PATHS: Record<IconName, React.ReactNode> = {
  bolt: <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z" />,
  shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
  layers: <><path d="m12 2 9 5-9 5-9-5 9-5z" /><path d="m3 12 9 5 9-5" /><path d="m3 17 9 5 9-5" /></>,
  code: <path d="m16 18 6-6-6-6M8 6l-6 6 6 6" />,
  chart: <><path d="M3 3v18h18" /><path d="m7 14 4-5 4 3 5-7" /></>,
  compass: <><circle cx="12" cy="12" r="10" /><path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z" /></>,
  clock: <><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></>,
  chat: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />,
  check: <path d="M20 6 9 17l-5-5" />,
  bell: <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />,
  coins: <><circle cx="8" cy="8" r="6" /><path d="M18.09 10.37A6 6 0 1 1 10.34 18" /><path d="M7 6h1v4" /></>,
  cpu: <><rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" /><path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3" /></>,
  git: <><circle cx="18" cy="18" r="3" /><circle cx="6" cy="6" r="3" /><path d="M6 21V9a9 9 0 0 0 9 9" /></>,
  terminal: <><path d="m4 17 6-6-6-6" /><path d="M12 19h8" /></>,
  globe: <><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></>,
  users: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
  zap: <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z" />,
  box: <><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><path d="m3.3 7 8.7 5 8.7-5M12 22V12" /></>,
  // ── app chrome glyphs (matched to screenshots) ──
  plus: <path d="M12 5v14M5 12h14" />,
  search: <><circle cx="11" cy="11" r="7" /><path d="m21 21-4.35-4.35" /></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 11h18" /><path d="m9 15 2 2 4-4" /></>,
  board: <><path d="M4 4h4v16H4zM10 4h4v10h-4zM16 4h4v13h-4z" /></>,
  funnel: <path d="M22 4H2l8 9.2V19l4 2.4v-8.2L22 4z" />,
  trash: <><path d="M3 6h18" /><path d="M8 6V4h8v2" /><path d="m19 6-1 15H6L5 6" /><path d="M10 10.5v6M14 10.5v6" /></>,
  pin: <><path d="M12 17v5" /><path d="M9 3h6l.8 6.2L18 11v2H6v-2l2.2-1.8L9 3z" /></>,
  moon: <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z" />,
  gear: <><circle cx="12" cy="12" r="3.2" /><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M18.7 5.3l-2.1 2.1M7.4 16.6l-2.1 2.1" /></>,
  newspaper: <><path d="M4 22h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-8c0-1.1.9-2 2-2h2" /><path d="M18 14h-8M15 18h-5M10 6h8v4h-8V6z" /></>,
  wrench: <path d="M14.7 6.3a4.8 4.8 0 0 1 6-6l-3.3 3.3 2.7 2.7L23.4 3a4.8 4.8 0 0 1-6 6L7 19.4a2.1 2.1 0 0 1-3-3L14.7 6.3z" />,
  chevron: <path d="m6 9 6 6 6-6" />,
  target: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4.5" /><circle cx="12" cy="12" r="0.8" fill="currentColor" stroke="none" /></>,
  arrowup: <path d="M12 19V5M5 12l7-7 7 7" />,
  folder: <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2v11z" />,
  image: <><rect x="3" y="3" width="18" height="18" rx="2.5" /><circle cx="9" cy="9" r="2" /><path d="m21 15-4.5-4.5L6 21" /></>,
  panel: <><rect x="3" y="4" width="18" height="16" rx="2.5" /><path d="M9.5 4v16" /></>,
  dots: <><circle cx="5" cy="12" r="1.4" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" /><circle cx="19" cy="12" r="1.4" fill="currentColor" stroke="none" /></>,
  burger: <path d="M4 7h16M4 12h16M4 17h16" />,
  sidebarToggle: <><rect x="3" y="4" width="18" height="16" rx="2.5" /><path d="M14.5 4v16" /><path d="m10 10-2 2 2 2" /></>,
  sparkle: <><path d="M12 4c.7 4.6 2.7 6.6 7.3 7.3-4.6.7-6.6 2.7-7.3 7.3-.7-4.6-2.7-6.6-7.3-7.3C9.3 10.6 11.3 8.6 12 4z" /></>,
};

export const Icon: React.FC<{name: IconName; size?: number; color: string; stroke?: number}> = ({
  name, size = 24, color, stroke = 2,
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
    strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
    {PATHS[name]}
  </svg>
);
