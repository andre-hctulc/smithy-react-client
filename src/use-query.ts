"use client";

import useSWR, { type SWRResponse, type SWRConfiguration } from "swr";
import { useSmithyClient } from "./client-provider.js";
import { createQuerySender } from "./sender.js";
import type { AnyCommand, CommandCtor, CommandInput, SendOptions, CommandOutput } from "./commad-types.js";
import type { ServiceException } from "@smithy/smithy-client";
import type { Disabled } from "./types.js";

export type UseQuery<C extends AnyCommand = AnyCommand> = SWRResponse<CommandOutput<C>, ServiceException>;

export type UseQueryOptions<C extends AnyCommand = AnyCommand> = {
    clientId?: string;
    swr?: SWRConfiguration<CommandOutput<C>, ServiceException>;
    disabled?: boolean;
    sendOptions?: SendOptions<C>;
};

export function useQuery<C extends AnyCommand>(
    Command: CommandCtor<C>,
    input: CommandInput<C> | Disabled,
    { disabled, clientId, swr, sendOptions }: UseQueryOptions<C> = {},
): UseQuery<C> {
    const { client } = useSmithyClient(clientId);

    const { send, key } = input && !disabled ? createQuerySender(client, Command, input, sendOptions) : {};

    const query = useSWR<CommandOutput<C>, ServiceException>(key, {
        fetcher: send,
        ...swr,
    });

    return query;
}
