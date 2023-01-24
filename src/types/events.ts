/* eslint-disable @typescript-eslint/ban-types */
import 'reflect-metadata';
import { Bot } from '../bot';

export interface ShimmerDiscordEvent {
    name?: string
    once?: boolean
}

export type EventRunner = (bot: Bot, ...args: unknown[]) => Promise<void>;

export const Event = {
    Once() {
        return function (constructor: Function) {
            constructor.prototype.once = true;
        };
    },

    Name(name: string) {
        return function (constructor: Function) {
            constructor.prototype.name = name;
        };
    },

    Runner() {
        return function (constructor: Object, propertyKey: string) {
            Reflect.defineMetadata('events:runner', propertyKey, constructor);
        };
    }
};