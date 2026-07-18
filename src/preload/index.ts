import { contextBridge, ipcRenderer } from 'electron';

import {
  FOUNDATION_IPC_CHANNELS,
  foundationDiagnosticRequestSchema,
  foundationDiagnosticResponseSchema,
  type RumoApi,
} from '../shared/contracts';

const rumoApi: RumoApi = {
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
