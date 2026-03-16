"use client";

import { useSmithyClient } from "./client-provider.js";
import { createMutationSender } from "./sender.js";
import type { SmithyReactClientCacheKey } from "./types.js";
import type { ServiceException } from "@smithy/smithy-client";
import useSWRMutation, { type SWRMutationConfiguration, type SWRMutationResponse } from "swr/mutation";
import type { AnyCommand, CommandCtor, CommandInput, CommandOptions, CommandOutput } from "./system-types.js";

export type UseMutation<C extends AnyCommand> = SWRMutationResponse<
    CommandOutput<C>,
    ServiceException,
    SmithyReactClientCacheKey,
    CommandInput<C>
>;

export type UseMutationOptions<C extends AnyCommand> = {
    clientId?: string;
    swr?: SWRMutationConfiguration<
        CommandOutput<C>,
        ServiceException,
        SmithyReactClientCacheKey,
        CommandInput<C>
    >;
    options?: CommandOptions<C>;
};

export function useMutation<C extends AnyCommand>(
    Command: CommandCtor<C>,
    { clientId, swr, options }: UseMutationOptions<C> = {},
): UseMutation<C> {
    const { client } = useSmithyClient(clientId);
    const { send, key } = createMutationSender(client, Command, options);

    const mutation = useSWRMutation<
        CommandOutput<C>,
        ServiceException,
        SmithyReactClientCacheKey,
        CommandInput<C>
    >(key, send, swr);

    return mutation;
}
