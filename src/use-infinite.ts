"use client";

import useSWRInfinite, { type SWRInfiniteResponse, type SWRInfiniteConfiguration } from "swr/infinite";
import { useSmithyClient } from "./client-provider.js";
import { createInfiniteSender } from "./sender.js";
import type { Disabled } from "./types.js";
import type { ServiceException } from "@smithy/smithy-client";
import type { AnyCommand, CommandCtor, CommandInput, CommandOptions, CommandOutput } from "./system-types.js";

export type UseInfinite<TOutput = any> = SWRInfiniteResponse<TOutput, ServiceException>;

export type UseInfiniteOptions<C extends AnyCommand> = {
    clientId?: string;
    swr?: SWRInfiniteConfiguration<CommandOutput<C>, ServiceException>;
    disabled?: boolean;
    options?: CommandOptions<C>;
};

export type InfiniteInputFactory<C extends AnyCommand> = (
    pageIndex: number,
    previousPageData: CommandOutput<C> | null,
) => CommandInput<C> | null;

/**
 * Hook for infinite/paginated queries using SWR Infinite.
 *
 * @param Command - The Smithy command constructor
 * @param inputFactory - Function that returns command input based on page index and previous page data.
 *                      Return null to stop loading more pages.
 * @param options - Hook configuration options
 *
 * @example
 * ```typescript
 * const { data, error, size, setSize, isLoading, isValidating } = useInfinite(
 *   ListItemsCommand,
 *   (pageIndex, previousPageData) => {
 *     if (previousPageData && !previousPageData.nextToken) return null; // reached the end
 *     return {
 *       nextToken: previousPageData?.nextToken,
 *       maxResults: 10
 *     };
 *   }
 * );
 * ```
 */
export function useInfinite<C extends AnyCommand>(
    Command: CommandCtor<C>,
    inputFactory: InfiniteInputFactory<C> | Disabled,
    { disabled, clientId, swr, options }: UseInfiniteOptions<C> = {},
): UseInfinite<CommandOutput<C>> {
    const { client } = useSmithyClient(clientId);

    const { getKey, fetcher } =
        inputFactory && !disabled
            ? createInfiniteSender(client, Command, inputFactory, options)
            : { getKey: () => null, fetcher: () => Promise.resolve([]) };

    const infinite = useSWRInfinite<CommandOutput<C>, ServiceException>(getKey, fetcher, {
        ...swr,
    });

    return infinite;
}
