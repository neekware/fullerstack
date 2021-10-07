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
  position: 'top-left',
  vertical: true,
  reverse: false,
  buttonVisibility: {
    trash: true,
    undo: true,
    redo: true,
    lineWidth: true,
    cursor: true,
    fullscreen: true,
    refresh: true,
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
  visible: true,
};

export const defaultLine = (): Line => {
  return ldDeepClone(DefaultLine);
};
