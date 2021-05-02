import { UixConfig } from './uix.model';

export const UIX_MDI_ICONS = '/assets/font/mdi.svg';

export const AvailableThemes = [
  'deeppurple-amber',
  'indigo-pink',
  'pink-bluegrey',
  'purple-green',
];

export const DefaultTheme = 'pink-bluegrey';

/**
 * Default configuration - i18n module
 */
export const DefaultUixConfig: UixConfig = {
  defaultTheme: DefaultTheme,
};
