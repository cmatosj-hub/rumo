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
import type {
  GetOperationalSettingsRequest,
  GetOperationalSettingsResponse,
  UpdateOperationalSettingsRequest,
  UpdateOperationalSettingsResponse,
} from './operational-settings-ipc';

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
  readonly operationalSettings: {
    get(
      request: GetOperationalSettingsRequest,
    ): Promise<GetOperationalSettingsResponse>;
    update(
      request: UpdateOperationalSettingsRequest,
    ): Promise<UpdateOperationalSettingsResponse>;
  };
}

declare global {
  interface Window {
    readonly rumo: RumoApi;
  }
}
