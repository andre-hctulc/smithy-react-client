import type { ServiceException } from "@smithy/smithy-client";

export type Disabled = null | false | undefined | "" | 0;

/**
 * Keys used in SWR cache.
 */
export type SmithyReactClientCacheKey = {
    commandName: string;
    commandInput: Record<string, any>;
    smithyReactClient: true;
    type: "mutation" | "query" | "infinite";
};

export type SafeResult<T> =
    | {
          data: T;
          error: null;
          success: true;
      }
    | {
          data: undefined;
          error: ServiceException;
          success: false;
      };
