import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  EnvironmentName,
  EnvironmentConfig,
  getDefaultEnvironment,
  getEnvironmentConfig,
} from '@/config/environments';

interface EnvState {
  currentEnv: EnvironmentName;
  config: EnvironmentConfig;
  setEnvironment: (env: EnvironmentName) => void;
  isProduction: () => boolean;
  requiresConfirmation: () => boolean;
}

export const useEnvStore = create<EnvState>()(
  persist(
    (set, get) => ({
      currentEnv: getDefaultEnvironment(),
      config: getEnvironmentConfig(getDefaultEnvironment()),

      setEnvironment: (env: EnvironmentName) => {
        set({
          currentEnv: env,
          config: getEnvironmentConfig(env),
        });
      },

      isProduction: () => get().currentEnv === 'production',

      requiresConfirmation: () => get().config.features.requireConfirmation,
    }),
    {
      name: 'content-studio-env',
      partialize: (state) => ({ currentEnv: state.currentEnv }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.config = getEnvironmentConfig(state.currentEnv);
        }
      },
    }
  )
);
