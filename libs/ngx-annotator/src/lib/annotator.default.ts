import { AnnotatorConfig, AnnotatorState } from './annotator.model';

export const DefaultAnnotatorState: AnnotatorState = {
  lineCap: 'round',
  lineWidth: 2.5,
  strokeStyle: '#000',
};

/**
 * Default configuration - Layout module
 */
export const DefaultAnnotatorConfig: AnnotatorConfig = {
  logState: false,
};
