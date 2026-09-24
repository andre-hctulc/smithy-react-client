"use client";

import { createContext, useContext, type FC, type ReactNode } from "react";
import { SWRConfig, type SWRConfiguration } from "swr";
import type { ClientType } from "./client.js";
import { baseSwrConfig } from "./base-swr-config.js";

export interface SmithyReactClientContextValue<T = ClientType> {
    /** The client instance */
    client: T;
    /** The parent context, if any */
    parentContext: SmithyReactClientContextValue | undefined;
    /** The id the client can be identified by */
    clientId: string | undefined;
    /** The client can only be found using it's clientId */
    ghost: boolean;
}

const SmithyReactClientContext = createContext<SmithyReactClientContextValue | undefined>(undefined);

export function useSmithyClient<T extends object = ClientType>(
    clientId?: string,
): SmithyReactClientContextValue<T> {
    let context = useContext(SmithyReactClientContext);
    if (!context) {
        throw new Error("useSmithyClient must be used within a SmithyReactClientContext");
    }

    if (clientId === undefined) {
        while (context) {
            if (!context.ghost) return context as SmithyReactClientContextValue<T>;
            context = context.parentContext;
        }
    } else {
        while (context) {
            if (context.clientId === clientId) return context as SmithyReactClientContextValue<T>;
            context = context.parentContext;
        }
    }

    throw new Error("No matching SmithyReactClientContext found");
}

export interface SmithyReactClientProviderProps extends Partial<
    Pick<SmithyReactClientContextValue, "ghost" | "clientId">
> {
    children?: ReactNode;
    swrConfig?: SWRConfiguration;
    client: ClientType;
}

export const SmithyReactClientProvider: FC<SmithyReactClientProviderProps> = ({
    children,
    client,
    swrConfig,
    clientId,
    ghost,
}) => {
    const parentContext = useContext(SmithyReactClientContext);

    return (
        <SWRConfig value={{ ...baseSwrConfig, ...swrConfig }}>
            <SmithyReactClientContext.Provider
                value={{
                    client,
                    clientId,
                    parentContext,
                    ghost: !!ghost,
                }}
            >
                {children}
            </SmithyReactClientContext.Provider>
        </SWRConfig>
    );
};
