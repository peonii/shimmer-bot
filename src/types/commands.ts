/* eslint-disable @typescript-eslint/ban-types */
import { ApplicationCommandOptionType, ChatInputCommandInteraction, CommandInteraction, SlashCommandBuilder } from 'discord.js';

interface ShimmerSlashCommandOption {
    id: string;
    meta: ShimmerSlashCommandOptionMeta
}

interface ShimmerSlashCommandOptionMeta {
    type: ApplicationCommandOptionType;
    required?: boolean;
    description: string;
}

export interface ShimmerSlashCommandMeta {
    name: string;
    description: string;
}

/**
 * Decorator function for declaring slash command arguments.
 * Works by setting the `'cmd:param'` metadata key.
 * Name is inferred from the variable name.
 *  
 * @param opts Options for this specific argument. The only required field is `description`.
 */
export function Argument(opts: ShimmerSlashCommandOptionMeta) {
    return function (target: Object, propertyKey: string) {
        const old = (Reflect.getMetadata('cmd:param', target) ?? []) as ShimmerSlashCommandOption[];

        Reflect.defineMetadata('cmd:param', [...old, { id: propertyKey, meta: opts }], target);
    };
};

/**
 * Decorator function for declaring slash comamnd executors.
 * Note that only one `@Runner` decorator may be present in a command.
 * 
 * @param object Command class instance
 * @param propertyKey Command executor property key
 */
export function Runner(object: Object, propertyKey: string) {
    Reflect.defineMetadata('cmd:runner', propertyKey, object);
}

/**
 * Decorator function for setting the cooldown on slash commands.
 * Cooldowns are stored in the global bot object.
 *
 * @param cooldownSeconds
 */
export function Cooldown(cooldownSeconds: number) {
    return function (target: Function) {
        target.prototype.cooldown = cooldownSeconds;
    };
}

/**
 * Decorator to declare slash command as ephemeral.
 */
export function Ephemeral(target: Function) {
    target.prototype.ephemeral = true;
}


export class Command {
    /**
     * Internal slash command builder.
     */
    data = new SlashCommandBuilder();

    /**
     * Internal slash command meta. Modify this in your command!
     */
    meta: ShimmerSlashCommandMeta = { name: '', description: '' };

    /**
     * Function that should be called before running the command runner function.
     * This loads the options in the interaction into
     * the arguments defined by `@Argument()` decorators.
     *  
     * @param interaction Interaction to load the arguments from.
     */
    async load(interaction: ChatInputCommandInteraction) {
        const params = Reflect.getMetadata('cmd:param', this) as ShimmerSlashCommandOption[];

        if (!params) return;

        for (const param of params) {
            if (param.meta.type === ApplicationCommandOptionType.String) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-ignore next-line
                this[param.id] = interaction.options.getString(param.id) ?? this[param.id];
            }
        }
    }

    /**
     * Function that constructs the SlashCommandBuilder from the arguments defined by `@Argument()` decorators. 
     * 
     * @returns The constructed SlashCommandBuilder.
     */
    construct(): SlashCommandBuilder {
        const params = Reflect.getMetadata('cmd:param', this) as ShimmerSlashCommandOption[];
        const data = new SlashCommandBuilder();

        data.setName(this.meta.name);
        data.setDescription(this.meta.description);

        if (!params) return data;

        for (const param of params) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore next-line
            if (param.meta.type === ApplicationCommandOptionType.String) {
                data.addStringOption(o => {
                    o.setName(param.id);
                    o.setDescription(param.meta.description);
                    o.setRequired(param.meta.required ?? false);

                    return o;
                });
            }
        }

        return data;
    }
}