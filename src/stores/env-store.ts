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

// Check if we're in development mode
const isDevelopment = process.env.NODE_ENV === 'development';

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
      // Use merge to properly intercept rehydration and force local env in development
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<EnvState> | undefined;

        // In development mode, always use local environment regardless of localStorage
        if (isDevelopment) {
          return {
            ...currentState,
            currentEnv: 'local' as EnvironmentName,
            config: getEnvironmentConfig('local'),
          };
        }

        // In production/staging builds, respect persisted environment
        const envToUse = persisted?.currentEnv || currentState.currentEnv;
        return {
          ...currentState,
          currentEnv: envToUse,
          config: getEnvironmentConfig(envToUse),
        };
      },
    }
  )
);
