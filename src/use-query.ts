"use client";

import useSWR, { type SWRResponse, type SWRConfiguration } from "swr";
import { useSmithyClient } from "./client-provider.js";
import { createQuerySender } from "./sender.js";
import type { AnyCommand, CommandCtor, CommandInput, CommandOptions, CommandOutput } from "./system-types.js";
import type { ServiceException } from "@smithy/smithy-client";
import type { Disabled } from "./types.js";

export type UseQuery<R = any> = SWRResponse<R, ServiceException>;

export type UseQueryOptions<C extends AnyCommand> = {
    clientId?: string;
    swr?: SWRConfiguration<CommandOutput<C>, ServiceException>;
    disabled?: boolean;
    options?: CommandOptions<C>;
};

export function useQuery<C extends AnyCommand>(
    Command: CommandCtor<C>,
    input: CommandInput<C> | Disabled,
    { disabled, clientId, swr, options }: UseQueryOptions<C> = {},
): UseQuery<CommandOutput<C>> {
    const { client } = useSmithyClient(clientId);

    const { send, key } = input && !disabled ? createQuerySender(client, Command, input, options) : {};

    const query = useSWR<CommandOutput<C>, ServiceException>(key, {
        fetcher: send,
        ...swr,
    });

    return query;
}
