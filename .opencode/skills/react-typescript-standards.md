---
name: react-typescript-standards
description: Diretrizes de desenvolvimento front-end com React, TypeScript e Tailwind CSS.
---

# React & TypeScript Standards

- **Tipagem Estrita**: Evite o uso de `any`. Defina interfaces ou tipos (`type`) explícitos para todas as propriedades (`props`), estados e respostas de API.
- **Componentização**: Crie componentes funcionais pequenos, reutilizáveis e com responsabilidade única.
- **Gerenciamento de Estado**: Utilize hooks nativos (`useState`, `useEffect`, `useMemo`) ou contextos quando necessário, mantendo a clareza e evitando re-renderizações desnecessárias.
- **Estilização**: Utilize **Tailwind CSS** para a estilização dos componentes, mantendo classes limpas e organizadas mantendo sempre a responsividade.
- **Integração HTTP**: Centralize as chamadas de API utilizando instâncias configuradas do `axios`, tipando rigidamente os payloads de envio e retorno.