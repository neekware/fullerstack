import { RemoteType } from './cfg.models';
import { CfgService } from './cfg.service';

/**
 * Remote Config Fetch Factory
 * @param cfgService CfgService Injectable
 */
export function remoteCfgFactory(cfgService: CfgService): () => RemoteType {
  return () => cfgService.fetchRemoteCfg();
}
