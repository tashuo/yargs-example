import "reflect-metadata";
import { Options, PositionalOptions } from "yargs";
import { isNil } from "lodash";

export const COMMAND_HANDLER_METADATA = "__command-handler-metadata__";
export const COMMANDS_HANDLER_METADATA = "__commands-handler-metadata__";
export const ORIGIN_COMMAND_HANDLER_METADATA =
  "__origin-command-handler-metadata__";

export interface CommandOption {
  /**
   * The command with arguments
   *
   * eg: "mycommand <myargument> <mysecondargument>"
   * @see commander .command() method for more details
   */
  command: string;

  /**
   * The describe of the command
   */
  describe?: string;

  /**
   * The alias of the command
   */
  alias?: string;

  /**
   * A list of command params
   */
  params?: {
    name: string;
    value: PositionalOptions | Options;
    type: "positional" | "option";
  }[];
}

export function Command(option?: CommandOption): MethodDecorator {
  return (
    target: object,
    key: string | symbol,
    descriptor: PropertyDescriptor
  ) => {
    if (isNil(option)) {
      option = {
        command: key as string,
        describe: `${key as string}(auto generated)`,
      };
    }

    // 根据design:paramtypes自动补充默认的参数
    if (isNil(option.params)) {
      option.params = [];
      const params =
        Reflect.getMetadata("design:paramtypes", target, key) || [];
      let i = 1;
      params.map((p) => {
        const type = p.name.toLowerCase();
        if (!["string", "number", "boolean"].includes(type)) {
          return;
        }
        option.params.push({
          type: "positional",
          name: `${type}${i}`,
          value: {
            type,
          },
        });
        option.command += ` <${type}${i}>`;
        i = i + 1;
      });
    }
    Reflect.defineMetadata(COMMAND_HANDLER_METADATA, option, target, key);
  };
}

export const Commands =
  (options?: CommandOption): ClassDecorator =>
  (target: any): void =>
    Reflect.defineMetadata(COMMANDS_HANDLER_METADATA, options, target);

export const OriginYargsCommand =
  (): ClassDecorator =>
  (target: any): void => {
    Reflect.defineMetadata(ORIGIN_COMMAND_HANDLER_METADATA, true, target);
  };
