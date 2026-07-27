// Data-access seam.
//
// Pages and components import their data from here rather than directly from
// mockData. In demo mode they get the bundled demo dataset; otherwise they get
// an empty tenant (so the real, integration-ready empty states render). This is
// the single switch that keeps the marketing demo working while the product is
// wired for live data.

import * as mock from "./mockData";
import { DEMO_MODE } from "./config";

export type { Employee, AppRecord, Alert, Integration, DiscoveryRow } from "./mockData";

const EMPTY_METRICS: typeof mock.METRICS = {
  monitoredEmployees: 0,
  vulnerabilityScore: 0,
  wastedMonthlySpend: 0,
  shadowAppsTotal: 0,
  criticalAlerts: 0,
};

export const EMPLOYEES = DEMO_MODE ? mock.EMPLOYEES : [];
export const ALERTS = DEMO_MODE ? mock.ALERTS : [];
export const INTEGRATIONS = DEMO_MODE ? mock.INTEGRATIONS : [];
export const DISCOVERY_ROWS = DEMO_MODE ? mock.DISCOVERY_ROWS : [];
export const METRICS = DEMO_MODE ? mock.METRICS : EMPTY_METRICS;
