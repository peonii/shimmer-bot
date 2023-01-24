---
inject: true
to: src/lib/commands/index.ts
append: true
---
export { default as <%= h.changeCase.pascal(name) %> } from './<%= h.changeCase.camel(name) %>';