import { AnnotatorConfig, AnnotatorState, CanvasButtonAttributes, Line } from './annotator.model';

export const DefaultAnnotatorState: AnnotatorState = {
  lineCap: 'round',
  lineWidth: 2.5,
  strokeStyle: '#000',
  cursor: false,
  fullscreen: true,
};

/**
 * Default configuration - Layout module
 */
export const DefaultAnnotatorConfig: AnnotatorConfig = {
  logState: false,
};

export const DefaultCanvasButtonAttributes: CanvasButtonAttributes = {
  canvas: {
    zIndex: 1,
    width: '100%',
    height: '100%',
    border: 0,
  },
  button: {
    zIndex: 2,
    color: 'primary',
    top: 0,
    right: 0,
    bottom: 'unset',
    left: 'unset',
    position: 'absolute',
  },
};

export const DefaultLine: Line = {
  points: [],
  attributes: {
    lineCap: DefaultAnnotatorState.lineCap,
    lineWidth: DefaultAnnotatorState.lineWidth,
    strokeStyle: DefaultAnnotatorState.strokeStyle,
  },
  visible: false,
};
