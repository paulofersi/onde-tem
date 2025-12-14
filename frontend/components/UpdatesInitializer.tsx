import * as Updates from 'expo-updates';
import { useEffect } from 'react';

export function UpdatesInitializer() {
  useEffect(() => {
    async function checkForUpdates() {
      if (__DEV__) {
        return;
      }

      try {
        const update = await Updates.checkForUpdateAsync();

        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync();
        }
      } catch (error) {
        // Ignore errors in update check
      }
    }

    checkForUpdates();
  }, []);

  return null;
}
