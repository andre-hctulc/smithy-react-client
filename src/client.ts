"use client";

import type { Client } from "@smithy/smithy-client";

/**
 * Use module augmentation to provide specific client types for your application.
 * @example
 * declare module "@dre44/smithy-react-client" {
 *   export interface SmithyClient {
 *     client: MyCustomClient;
 *   }
 * }
 */
export interface SmithyAnnotations {
}

type AnyClient = Client<any, any, any, any>;

export type ClientType = SmithyAnnotations extends { client: infer C } ? C : AnyClient;
