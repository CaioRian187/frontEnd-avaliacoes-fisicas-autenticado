---
name: spring-boot-standards
description: Padrões arquiteturais, boas práticas e convenções para o desenvolvimento back-end com Java e Spring Boot.
---

# Spring Boot Standards & Conventions

- **Arquitetura em Camadas**: Siga estritamente a separação entre `Controller`, `Service`, `Repository` e `DTO`. Regras de negócio pertencem exclusivamente à camada de serviço.
- **Clean Code**: Siga boas práticas de desenvolvimento deixando o código legível, organizado e fácil de entender.
- **Mapeamento de Banco de Dados**: 
  - Utilize sempre **Strings** (ou Enums mapeados como String no banco) para campos textuais de estado ou papéis (ex: campo `role` no banco de dados deve ser salvo como string `ADMIN` ou `USER`, **nunca** como `smallint` ou ordinal).
- **Tratamento de Exceções**: Utilize `@RestControllerAdvice` global com classes de exceção personalizadas (`ResponseStatusException`) retornando um DTO padrão de erro implementado no filtro de Exception que é o status HTTP e a mensagem de erro.
- **Injeção de Dependências**: Prefira injeção via construtor (utilize `@RequiredArgsConstructor` do Lombok) em vez de `@Autowired` em campos.
- **Validação**: Utilize anotações do Bean Validation (`@NotBlank`, `@NotNull`, `@Email`, `@Valid`) nos DTOs de entrada.