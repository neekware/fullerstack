import { cloneDeep as ldDeepClone } from 'lodash-es';

import { AnnotatorConfig, AnnotatorState, Line } from './annotator.model';

const DefaultAnnotatorState: AnnotatorState = {
  signature: '',
  lineCap: 'round',
  lineJoin: 'round',
  lineWidth: 3,
  strokeStyle: '#000',
  cursor: true,
  fullscreen: true,
  menuOptions: {
    showTrashButton: true,
    showUndoButton: true,
    showRedoButton: true,
    showLineWidthButton: true,
    showCursorButton: true,
    showFullscreenButton: true,
    showRefreshButton: true,
    position: 'top-left',
    vertical: true,
  },
};

export const defaultAnnotatorState = (): AnnotatorState => {
  return ldDeepClone(DefaultAnnotatorState);
};

/**
 * Default configuration - Layout module
 */
const DefaultAnnotatorConfig: AnnotatorConfig = {
  logState: false,
};

export const defaultAnnotatorConfig = (): AnnotatorConfig => {
  return ldDeepClone(DefaultAnnotatorConfig);
};

const DefaultLine: Line = {
  points: [],
  attributes: {
    lineCap: DefaultAnnotatorState.lineCap,
    lineWidth: DefaultAnnotatorState.lineWidth,
    strokeStyle: DefaultAnnotatorState.strokeStyle,
  },
  visible: false,
};

export const defaultLine = (): Line => {
  return ldDeepClone(DefaultLine);
};
