import { CommandModule, Options, PositionalOptions } from "yargs";
import { flattenDeep, pick, compact } from "lodash";
import { Decorator1, Decorator2 } from "./decorator.command";
import {
  COMMANDS_HANDLER_METADATA,
  COMMAND_HANDLER_METADATA,
  Command,
  CommandOption,
} from "./decorator";

export class Scanner {
  static scan(): CommandModule[] {
    const clasess = [Decorator1, Decorator2];
    const commands = compact(
      flattenDeep<CommandModule>(
        clasess.map((c) => {
          const prototype = c.prototype;
          const instance = new c();
          // multiCommands
          const commandsMeta = Reflect.getMetadata(
            COMMANDS_HANDLER_METADATA,
            c
          );
          if (commandsMeta) {
            Object.getOwnPropertyNames(prototype)
              .filter(
                (f) =>
                  !Reflect.hasMetadata(COMMAND_HANDLER_METADATA, c, f) &&
                  f !== "constructor"
              )
              .map((f) => {
                Command({
                  command: `${commandsMeta.command}:${f}`,
                  describe: commandsMeta.describe
                    ? `${commandsMeta.describe}:${f}`
                    : `${f}(auto generated)`,
                })(prototype, f, Object.getOwnPropertyDescriptor(prototype, f));
              });
          }

          // command
          return Object.getOwnPropertyNames(prototype).map((p) => {
            const commandMeta: CommandOption = Reflect.getMetadata(
              COMMAND_HANDLER_METADATA,
              instance,
              p
            );
            if (!commandMeta) {
              return;
            }

            const builder: CommandModule["builder"] = (yargs) => {
              commandMeta.params?.map(({ name, value, type }) => {
                switch (type) {
                  case "positional":
                    yargs.positional(name, value as PositionalOptions);
                    break;
                  case "option":
                    yargs.option(name, value as Options);
                    break;
                  default:
                    break;
                }
              });
              return yargs;
            };

            const handler: NonNullable<CommandModule["handler"]> = async (
              args
            ) => {
              const exec = instance[p].bind(instance);
              const params = commandMeta.params?.map((v) => args[v.name]);
              const result = await exec(...params);
              return result;
            };

            return {
              ...pick(commandMeta, ["command", "describe", "alias"]),
              builder,
              handler,
            };
          });
        })
      )
    );
    return commands;
  }
}
