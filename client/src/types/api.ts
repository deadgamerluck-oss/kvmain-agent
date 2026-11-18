export interface HealthStatus {
  status: string;
  timestamp: string;
  uptime: number;
  service: string;
}

export interface VersionInfo {
  name: string;
  version: string;
  environment: string;
}
