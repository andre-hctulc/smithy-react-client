import type { Command } from "@smithy/smithy-client";

export type AnyCommand = Command<any, any, any, any, any>;
export type AnyCommandCtor = new (input: any) => Command<any, any, any, any, any>;
export type CommandCtor<C extends AnyCommand = AnyCommand> = new (input: CommandInput<C>) => C;

export type CommandOutput<C extends AnyCommand = AnyCommand> =
    C extends Command<any, infer O, any, any, any> ? O : never;
export type CommandInput<C extends AnyCommand = AnyCommand> =
    C extends Command<infer I, any, any, any, any> ? I : never;
export type CommandOptions<C extends AnyCommand = AnyCommand> =
    C extends Command<any, any, infer O, any, any> ? O : never;
