import type {
  FoundationDiagnosticRequest,
  FoundationDiagnosticResponse,
} from './foundation-ipc';

export interface RumoApi {
  readonly diagnostics: {
    check(
      request: FoundationDiagnosticRequest,
    ): Promise<FoundationDiagnosticResponse>;
  };
}

declare global {
  interface Window {
    readonly rumo: RumoApi;
  }
}
