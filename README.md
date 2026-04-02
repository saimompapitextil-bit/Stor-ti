# STOR TI — só front-end

Protótipo em **Next.js 14** + **React** + **Tailwind**. Sem API, sem banco: os dados vêm de `src/data/mock.ts` e de objetos locais nas páginas.

## Rodar

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Build (ex.: Vercel)

```bash
npm run build
npm start
```

Não há variáveis de ambiente obrigatórias.

## Estrutura

- `src/app/` — rotas e layouts
- `src/components/` — UI reutilizável (ex.: `Sidebar`)
- `src/data/mock.ts` — números e listas para telas de demonstração

Quando for ligar backend de novo, substitua os mocks por `fetch` ou Server Actions e acrescente o projeto de API/banco separadamente.
