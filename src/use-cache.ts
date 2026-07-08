"use client";

import { useSWRConfig } from "swr";
import { useCallback } from "react";
import { isCacheKey } from "./helpers.js";
import type { SmithyReactClientCacheKey } from "./types.js";

interface UseCache {
    mutate: (match: (key: SmithyReactClientCacheKey) => boolean, data?: any) => Promise<any[]>;
}

export function useCache(): UseCache {
    const { mutate } = useSWRConfig();
    const _mutate = useCallback(
        async (match: (key: SmithyReactClientCacheKey) => boolean, data?: any) => {
            return mutate((key: unknown) => {
                if (!isCacheKey(key)) {
                    return false;
                }
                return match(key);
            }, data);
        },
        [mutate],
    );

    return { mutate: _mutate };
}
