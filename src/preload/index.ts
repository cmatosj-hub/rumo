import { contextBridge, ipcRenderer } from 'electron';

import {
  DAILY_CLOSING_IPC_CHANNELS,
  FOUNDATION_IPC_CHANNELS,
  createDailyClosingRequestSchema,
  createDailyClosingResponseSchema,
  foundationDiagnosticRequestSchema,
  foundationDiagnosticResponseSchema,
  listDailyClosingsRequestSchema,
  listDailyClosingsResponseSchema,
  OPERATIONAL_SETTINGS_IPC_CHANNELS,
  getOperationalSettingsRequestSchema,
  getOperationalSettingsResponseSchema,
  updateOperationalSettingsRequestSchema,
  updateOperationalSettingsResponseSchema,
  type RumoApi,
} from '../shared/contracts';

const rumoApi: RumoApi = {
  dailyClosings: {
    create: async (request) => {
      const validatedRequest = createDailyClosingRequestSchema.parse(request);
      const response: unknown = await ipcRenderer.invoke(
        DAILY_CLOSING_IPC_CHANNELS.create,
        validatedRequest,
      );

      return createDailyClosingResponseSchema.parse(response);
    },
    list: async (request) => {
      const validatedRequest = listDailyClosingsRequestSchema.parse(request);
      const response: unknown = await ipcRenderer.invoke(
        DAILY_CLOSING_IPC_CHANNELS.list,
        validatedRequest,
      );

      return listDailyClosingsResponseSchema.parse(response);
    },
  },
  diagnostics: {
    check: async (request) => {
      const validatedRequest = foundationDiagnosticRequestSchema.parse(request);
      const response: unknown = await ipcRenderer.invoke(
        FOUNDATION_IPC_CHANNELS.diagnosticsCheck,
        validatedRequest,
      );

      return foundationDiagnosticResponseSchema.parse(response);
    },
  },
  operationalSettings: {
    get: async (request) => {
      const validatedRequest =
        getOperationalSettingsRequestSchema.parse(request);
      const response: unknown = await ipcRenderer.invoke(
        OPERATIONAL_SETTINGS_IPC_CHANNELS.get,
        validatedRequest,
      );
      return getOperationalSettingsResponseSchema.parse(response);
    },
    update: async (request) => {
      const validatedRequest =
        updateOperationalSettingsRequestSchema.parse(request);
      const response: unknown = await ipcRenderer.invoke(
        OPERATIONAL_SETTINGS_IPC_CHANNELS.update,
        validatedRequest,
      );
      return updateOperationalSettingsResponseSchema.parse(response);
    },
  },
};

contextBridge.exposeInMainWorld('rumo', rumoApi);
