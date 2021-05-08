import { tryGet } from '@fullerstack/agx-util';

import { ValidatorHintMessages } from './hint.model';

export const validatorHintMessage = (key: string): string => {
  return tryGet(() => ValidatorHintMessages[key]);
};
