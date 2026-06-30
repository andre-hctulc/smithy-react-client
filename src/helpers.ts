import { ServiceException } from "@smithy/smithy-client";
import type { SafeResult, SmithyReactClientCacheKey } from "./types.js";

export function isCacheKey(key: unknown): key is SmithyReactClientCacheKey {
    return !!key && typeof key === "object" && (key as SmithyReactClientCacheKey).smithyReactClient === true;
}

/**
 * Safely awaits a `mutate` Promise and returns the result.
 */
export async function safeTrigger<T>(
    trigger: Promise<T> | (() => Promise<T>),
    onError?: (error: ServiceException) => void,
): Promise<SafeResult<T>> {
    try {
        const result = trigger instanceof Promise ? await trigger : await trigger();
        return { data: result, error: null, success: true };
    } catch (error) {
        if (error instanceof ServiceException) {
            onError?.(error);
        }
        return { data: undefined, error: error as ServiceException, success: false };
    }
}