export type EnvironmentName = 'local' | 'debug' | 'staging' | 'production';

export interface EnvironmentConfig {
  name: string;
  color: string;
  icon: string;
  apiUrl: string;
  features: {
    dangerousOperations: boolean;
    ruleExport: boolean;
    ruleImport: boolean;
    requireConfirmation: boolean;
    autoApplyRules: boolean;
  };
  warnings?: string[];
}

export const ENVIRONMENTS: Record<EnvironmentName, EnvironmentConfig> = {
  local: {
    name: 'Local',
    color: 'green',
    icon: '🟢',
    apiUrl: process.env.NEXT_PUBLIC_API_URL_LOCAL || 'http://localhost:3000',
    features: {
      dangerousOperations: true,
      ruleExport: true,
      ruleImport: true,
      requireConfirmation: false,
      autoApplyRules: true,
    },
  },
  debug: {
    name: 'Debug',
    color: 'blue',
    icon: '🔵',
    apiUrl: process.env.NEXT_PUBLIC_API_URL_DEBUG || 'https://debug.api.readmigo.app',
    features: {
      dangerousOperations: true,
      ruleExport: true,
      ruleImport: true,
      requireConfirmation: false,
      autoApplyRules: true,
    },
  },
  staging: {
    name: 'Staging',
    color: 'yellow',
    icon: '🟡',
    apiUrl: process.env.NEXT_PUBLIC_API_URL_STAGING || 'https://staging.api.readmigo.app',
    features: {
      dangerousOperations: true,
      ruleExport: true,
      ruleImport: true,
      requireConfirmation: false,
      autoApplyRules: true,
    },
  },
  production: {
    name: 'Production',
    color: 'red',
    icon: '🔴',
    apiUrl: process.env.NEXT_PUBLIC_API_URL_PRODUCTION || 'https://api.readmigo.app',
    features: {
      dangerousOperations: false,
      ruleExport: true,
      ruleImport: true,
      requireConfirmation: true,
      autoApplyRules: true,
    },
    warnings: [
      '当前环境: PRODUCTION',
      '所有操作将影响真实用户数据，请谨慎操作',
    ],
  },
};

export function getDefaultEnvironment(): EnvironmentName {
  const envFromUrl = typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search).get('env')
    : null;

  if (envFromUrl && isValidEnvironment(envFromUrl)) {
    return envFromUrl as EnvironmentName;
  }

  const envFromProcess = process.env.NEXT_PUBLIC_DEFAULT_ENV;
  if (envFromProcess && isValidEnvironment(envFromProcess)) {
    return envFromProcess as EnvironmentName;
  }

  return 'local';
}

export function isValidEnvironment(env: string): env is EnvironmentName {
  return ['local', 'debug', 'staging', 'production'].includes(env);
}

export function getEnvironmentConfig(env: EnvironmentName): EnvironmentConfig {
  return ENVIRONMENTS[env];
}
