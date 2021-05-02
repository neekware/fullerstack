import { RemoteType } from './config.model';
import { ConfigService } from './config.service';

/**
 * Remote Config Fetch Factory
 * @param config ConfigService Injectable
 */
export function remoteConfigFactory(config: ConfigService): () => RemoteType {
  return () => config.fetchRemoteConfig();
}
