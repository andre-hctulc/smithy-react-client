"use client";

import { createContext, useContext, type FC, type ReactNode } from "react";
import { SWRConfig, type SWRConfiguration } from "swr";
import type { ClientType } from "./client.js";
import { baseSwrConfig } from "./base-swr-config.js";

export interface SmithyReactClientContext {
    client: ClientType;
    clientId: string | undefined;
    parentContext: SmithyReactClientContext | undefined;
}

const SmithyReactClientContext = createContext<SmithyReactClientContext | undefined>(undefined);

export function useSmithyClient(clientId?: string): SmithyReactClientContext {
    let context = useContext(SmithyReactClientContext);
    if (!context) {
        throw new Error("`useSmithyClient` must be used within a `SmithyReactClientContext`");
    }

    if (clientId) {
        while (context) {
            if (context.clientId === clientId) return context;
            context = context.parentContext;
        }
        throw new Error("No `SmithyClientContext` with the given id found");
    }

    return context;
}

export interface SmithyReactClientProviderProps {
    children?: ReactNode;
    swrConfig?: SWRConfiguration;
    client: ClientType;
    clientId?: string;
}

/**
 * Lets you configure the default requestInit useXFetch hooks in the component tree.
 */
export const SmithyReactClientProvider: FC<SmithyReactClientProviderProps> = ({
    children,
    client,
    swrConfig,
    clientId,
}) => {
    const parentContext = useContext(SmithyReactClientContext);

    const prov = (
        <SmithyReactClientContext.Provider
            value={{
                client,
                clientId,
                parentContext,
            }}
        >
            {children}
        </SmithyReactClientContext.Provider>
    );

    return <SWRConfig value={{ ...baseSwrConfig, ...swrConfig }}>{prov}</SWRConfig>;
};
