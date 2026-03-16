import type { SWRConfiguration } from "swr";

export const baseSwrConfig: SWRConfiguration = {
    // Smithy clients are expected to handle retries themselves, so we disable SWR's retry mechanism by default.
    errorRetryCount: 0,
};
