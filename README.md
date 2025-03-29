# node_intensive

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.1.33. [Bun](https://bun.sh)
is a fast all-in-one JavaScript runtime.

Usaremos: Bun para instalar algunas cosas

- ESlint para corregir e indicar como usar JS a partir de ciertas reglas, para
  este caso usaremos las reglas de Airbnb https://github.com/airbnb/javascript,
  que tiene una de las reglas mas estrictas.

- Valibot es la biblioteca de esquemas de código abierto para TypeScript que
  tiene en cuenta el tamaño del paquete, la seguridad de tipos y la experiencia
  del desarrollador. > es una alternativa a Zod un creador de esquemas, que
  tiene una inferencia de tipos, para poder restringir y especificar como es un
  objeto, ej name es un string que es requerido, que solo puede tener ciertos
  caracteres. https://valibot.dev/

Paso a paso de los comandos:

- mkdir node_intensive
- cd .\node_intensive\
- bun init
- bun install
- bunx eslint --init
- bun add bcrypt cors jsonwebtoken valibot
- bun add -D @eslint/js @types/node @typescript-eslint/eslint-plugin
  @typescript-eslint/parser eslint-config-airbnb-base
  eslint-config-airbnb-base-typescript
- bun add -D eslint-plugin-import @types/bcrypt @types/node @types/jsonwebtoken
- bun add -D eslint-plug @types/cores ESTAS NO EXISTEN
- bun add -D @types/cors
- bun add -D unused-imports

curl -X POST http://localhost:4000/auth/register -H "Content-Type: application/json" -d "{ "email": "test@test.com", "password": "12341234" }"

2:03 testando aplicacion usando curl
