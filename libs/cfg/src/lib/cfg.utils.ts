import { CfgService } from './cfg.service';

/**
 * Remote Config Fetch Factory
 * @param cfgService CfgService Injectable
 */
export function remoteCfgFactory(cfgService: CfgService): () => Promise<any> {
  return () => cfgService.fetchRemoteCfg();
}
