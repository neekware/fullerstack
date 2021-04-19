import { RemoteType } from './config.models';
import { ConfigService } from './config.service';

/**
 * Remote Config Fetch Factory
 * @param configService ConfigService Injectable
 */
export function remoteConfigFactory(
  configService: ConfigService
): () => RemoteType {
  return () => configService.fetchRemoteConfig();
}
