import type { ClientType } from "./client.js";
import type { AnyCommandCtor, CommandInput, CommandOptions } from "./system-types.js";
import type { SmithyReactClientCacheKey } from "./types.js";

export type CreateQuerySenderResult = {
    send: (command: SmithyReactClientCacheKey) => Promise<any>;
    key: SmithyReactClientCacheKey;
};

export function createQuerySender(
    client: ClientType,
    Command: AnyCommandCtor,
    commandInput: CommandInput,
    options: CommandOptions,
): CreateQuerySenderResult {
    const key: SmithyReactClientCacheKey = {
        smithyReactClient: true,
        commandName: Command.constructor.name,
        commandInput,
        type: "query",
    };

    const sender = ({ commandInput }: SmithyReactClientCacheKey) => {
        return client.send(new Command(commandInput), options);
    };

    return {
        key,
        send: sender,
    };
}

export type CreateMutationSenderResult = {
    send: (command: SmithyReactClientCacheKey, input: { arg: CommandInput }) => Promise<any>;
    key: SmithyReactClientCacheKey;
};

export function createMutationSender(
    client: ClientType,
    Command: AnyCommandCtor,
    options: CommandOptions,
): CreateMutationSenderResult {
    const key: SmithyReactClientCacheKey = {
        smithyReactClient: true,
        commandName: Command.constructor.name,
        commandInput: {},
        type: "mutation",
    };

    const sender = ({}: SmithyReactClientCacheKey, input: { arg: CommandInput }) => {
        return client.send(new Command(input.arg), options);
    };

    return {
        key,
        send: sender,
    };
}

export type CreateInfiniteSenderResult = {
    getKey: (pageIndex: number, previousPageData: any) => SmithyReactClientCacheKey | null;
    fetcher: (key: SmithyReactClientCacheKey) => Promise<any>;
};

export function createInfiniteSender<TInput = any, TOutput = any>(
    client: ClientType,
    Command: AnyCommandCtor,
    inputFactory: (pageIndex: number, previousPageData: TOutput | null) => TInput | null,
    options?: CommandOptions,
): CreateInfiniteSenderResult {
    const getKey = (
        pageIndex: number,
        previousPageData: TOutput | null,
    ): SmithyReactClientCacheKey | null => {
        const commandInput = inputFactory(pageIndex, previousPageData);

        if (!commandInput) {
            return null;
        }

        return {
            smithyReactClient: true,
            commandName: Command.constructor.name,
            commandInput,
            type: "infinite",
        };
    };

    const fetcher = (key: SmithyReactClientCacheKey) => {
        return client.send(new Command(key.commandInput), options);
    };

    return {
        getKey,
        fetcher,
    };
}
