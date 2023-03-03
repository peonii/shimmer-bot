---
to: src/lib/events/<%= h.changeCase.camel(name) %>.ts
---
import { Event } from '../../types/events';
import { Bot } from '../../bot';

@Event.Name('<%= h.changeCase.camel(name) %>')
export default class <%= h.changeCase.pascal(name) %>Event {
    @Event.Runner()
    async runner(bot: Bot) {
        // Your code runner.
    }
}
