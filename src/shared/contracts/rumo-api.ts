import type {
  FoundationDiagnosticRequest,
  FoundationDiagnosticResponse,
} from './foundation-ipc';
import type {
  CreateDailyClosingRequest,
  CreateDailyClosingResponse,
  ListDailyClosingsRequest,
  ListDailyClosingsResponse,
} from './daily-closing-ipc';

export interface RumoApi {
  readonly dailyClosings: {
    create(
      request: CreateDailyClosingRequest,
    ): Promise<CreateDailyClosingResponse>;
    list(request: ListDailyClosingsRequest): Promise<ListDailyClosingsResponse>;
  };
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
