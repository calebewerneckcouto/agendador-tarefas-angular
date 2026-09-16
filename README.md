# Deadline — Agendador de Tarefas

Frontend Angular do **Deadline Javanauta**: landing page, cadastro, login e área autenticada para gerenciar tarefas, telefones e endereços.

O app fala com o **BFF** em `http://localhost:8083`, que orquestra as APIs de usuário, tarefas e notificações.

## Stack

- Angular 22 (standalone, `inject`, signals)
- Angular Material (tema Azure Blue) + CDK
- HttpClient com interceptor JWT
- Reactive Forms
- RxJS
- Vitest (`ng test`)

## Pré-requisitos

- Node.js 20+ e npm
- BFF do agendador rodando em **http://localhost:8083**
- Contas/serviços de usuário e tarefas acessíveis pelo BFF (em geral usuario `:8080` e tarefas via BFF)

## Como rodar

```bash
npm install
npm start
```

Abra [http://localhost:4200](http://localhost:4200). O `ng serve` recarrega ao salvar.

Outros comandos:

| Comando        | Função                          |
|----------------|---------------------------------|
| `npm start`    | Servidor de desenvolvimento     |
| `npm run build`| Build de produção em `dist/`    |
| `npm test`     | Testes unitários (Vitest)       |

## Rotas

| Rota          | Acesso        | Tela                                      |
|---------------|---------------|-------------------------------------------|
| `/`           | Público       | Home (recursos, preços, contato)          |
| `/register`   | Público       | Cadastro de usuário                       |
| `/login`      | Público       | Login                                     |
| `/tasks`      | Autenticado   | Lista, cadastro, edição e exclusão de tarefas |
| `/user-data`  | Autenticado   | Nome/e-mail, telefones e endereços        |

Rotas autenticadas usam `authGuard`. Sem token no `localStorage`, o usuário vai para `/login`.

## O que o app faz

**Conta**

- Cadastro (`POST /usuario`) e login (`POST /usuario/login`)
- JWT guardado em `localStorage` (`auth_token`) e usuário em `logged_user`
- Menu: Entrar/Cadastrar quando deslogado; avatar com **Meus dados** e **Sair** quando logado

**Tarefas** (`/tasks`)

- Listar tarefas do usuário
- Cadastrar, editar e excluir
- Data e hora no modal (datepicker + timepicker)
- `dataEvento` enviado no formato esperado pelo BFF: `dd-MM-yyyy HH:mm:ss` (ex.: `16-09-2026 20:30:00`)
- Status de notificação: Pendente, Notificado, Cancelado

**Meus dados** (`/user-data`)

- Telefones: criar, editar e excluir
- Endereços: criar, editar, excluir e busca de CEP (`GET /usuario/endereco/{cep}`)

## Integração com o BFF

Base URL: `http://localhost:8083`

O interceptor `authInterceptor` envia `Authorization: Bearer <token>` nas rotas autenticadas. Login e cadastro de usuário não recebem o header.

**Usuário**

| Método | Endpoint                         | Uso                |
|--------|----------------------------------|--------------------|
| POST   | `/usuario`                       | Cadastro           |
| POST   | `/usuario/login`                 | Login (JWT)        |
| GET    | `/usuario?email=`                | Dados do usuário   |
| POST   | `/usuario/telefone`              | Novo telefone      |
| PUT    | `/usuario/telefone?id=`          | Editar telefone    |
| DELETE | `/usuario/telefone?id=`          | Excluir telefone   |
| POST   | `/usuario/endereco`              | Novo endereço      |
| PUT    | `/usuario/endereco?id=`          | Editar endereço    |
| DELETE | `/usuario/endereco?id=`          | Excluir endereço   |
| GET    | `/usuario/endereco/{cep}`        | Consulta CEP       |

**Tarefas**

| Método | Endpoint            | Uso              |
|--------|---------------------|------------------|
| GET    | `/tarefas`          | Listar           |
| POST   | `/tarefas`          | Criar            |
| PUT    | `/tarefas?id=`      | Atualizar        |
| DELETE | `/tarefas?id=`      | Excluir          |

## Estrutura

```
src/app/
  core/http/          interceptor JWT
  guards/             authGuard
  pages/              home, login, register, tasks, user-data
  services/           auth, user, tasks
  shared/components/  top-menu, footer, modal-dialog, password-field
```

Serviços principais:

- `Auth` — token, usuário logado e `loggedIn` (signals)
- `UserService` — login, cadastro e CRUD de telefone/endereço
- `TasksService` — CRUD de tarefas e signal da lista

O modal compartilhado (`ModalDialog`) monta o formulário a partir de `DialogFieldConfig` (texto, data, hora, textarea).

## Observações

- Sem o BFF em `8083`, login, cadastro e tarefas falham no `HttpClient`.
- Datas de tarefa **não** devem ir em ISO (`2026-09-16T20:30:00.000Z`); o backend espera `LocalDateTime` no padrão `dd-MM-yyyy HH:mm:ss`.
- Projeto gerado com Angular CLI 22.1.7.
