---
inject: true
to: src/lib/events/index.ts
append: true
---
export { default as <%= h.changeCase.pascal(name) %> } from './<%= h.changeCase.camel(name) %>';