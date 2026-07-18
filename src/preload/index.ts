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
};

contextBridge.exposeInMainWorld('rumo', rumoApi);
