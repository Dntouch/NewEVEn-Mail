import type { InstalledTheme } from './plugin-types';

// Native Bulwark tokens apply to navigation, lists, calendar, files, settings
// and dialogs. Message HTML remains in Bulwark's existing rendering pipeline.
export const newevenLight = {
  background: '#f3f7fc', foreground: '#10263d', card: '#ffffff', 'card-foreground': '#10263d',
  popover: '#ffffff', 'popover-foreground': '#10263d', secondary: '#e7eff8', 'secondary-foreground': '#10263d',
  muted: '#e7eff8', 'muted-foreground': '#4b6179', accent: '#d7eaff', 'accent-foreground': '#064f9c',
  sidebar: '#e9f1fa', 'sidebar-foreground': '#10263d', 'sidebar-border': '#bdcfe3',
  'sidebar-accent': '#d7eaff', 'sidebar-accent-foreground': '#064f9c', border: '#bdcfe3', input: '#748da8',
  ring: '#0068d9', primary: '#0068d9', 'primary-foreground': '#ffffff',
  selection: '#d7eaff', 'selection-foreground': '#064f9c', unread: '#0068d9',
  destructive: '#b42335', 'destructive-foreground': '#ffffff', success: '#14704b', 'success-foreground': '#ffffff',
  warning: '#865500', 'warning-foreground': '#ffffff', info: '#0062a8', 'info-foreground': '#ffffff',
} as const;
export const newevenDark = {
  background: '#06111f', foreground: '#eaf3fc', card: '#0b1c2e', 'card-foreground': '#eaf3fc',
  popover: '#10263b', 'popover-foreground': '#eaf3fc', secondary: '#0b1c2e', 'secondary-foreground': '#eaf3fc',
  muted: '#132b42', 'muted-foreground': '#adc2d6', accent: '#123b60', 'accent-foreground': '#d8efff',
  sidebar: '#071725', 'sidebar-foreground': '#dcebf8', 'sidebar-border': '#263f56',
  'sidebar-accent': '#123b60', 'sidebar-accent-foreground': '#d8efff', border: '#29455e', input: '#527590',
  ring: '#59c6ff', primary: '#0068d9', 'primary-foreground': '#ffffff',
  selection: '#123b60', 'selection-foreground': '#eaf3fc', unread: '#59c6ff',
  destructive: '#f58c96', 'destructive-foreground': '#26080e', success: '#7bd6ad', 'success-foreground': '#062318',
  warning: '#f5cb7a', 'warning-foreground': '#281c04', info: '#78caff', 'info-foreground': '#071e2f',
} as const;
const tokens = (values: Record<string,string>) => Object.entries(values).map(([key,value])=>`  --color-${key}: ${value};`).join('\n');

export const newevenTheme: InstalledTheme = {
  id: 'builtin-neweven', name: 'NewEVEn Mail', version: '1.0.0', author: 'Built-in',
  description: 'Deep navy surfaces, clear blue accents and calm, readable mail.',
  variants: ['light','dark'], enabled: true, builtIn: true,
  css: `:root {\n${tokens(newevenLight)}\n}\n.dark {\n${tokens(newevenDark)}\n}`,
  skin: `
body[data-theme-skin="builtin-neweven"] { --radius-lg: 10px; --radius-xl: 12px; }
.dark body[data-theme-skin="builtin-neweven"] .text-primary { color: #59c6ff; }
body[data-theme-skin="builtin-neweven"] [role="dialog"],
body[data-theme-skin="builtin-neweven"] [role="menu"],
body[data-theme-skin="builtin-neweven"] [role="listbox"] {
  border-color: var(--color-border);
  box-shadow: 0 12px 36px #00122526;
}
.dark body[data-theme-skin="builtin-neweven"] [role="dialog"],
.dark body[data-theme-skin="builtin-neweven"] [role="menu"],
.dark body[data-theme-skin="builtin-neweven"] [role="listbox"] { box-shadow: 0 16px 48px #0007; }
body[data-theme-skin="builtin-neweven"] .bg-primary.text-primary-foreground {
  background-image: linear-gradient(115deg, #0878df, #005cc9);
  color: #fff;
  box-shadow: 0 3px 12px #0068d925;
}
body[data-theme-skin="builtin-neweven"] :focus-visible { outline-offset: 3px; }
`,
};
