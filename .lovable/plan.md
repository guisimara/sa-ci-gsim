# Corretor360 — Plano de Implementação do MVP Visual

## Premissa
Escopo gigantesco. Vou entregar em **fases**, começando pelo **MVP visual navegável** (frontend + dados mockados em memória), com arquitetura pronta para plugar Lovable Cloud (Supabase) em fase seguinte. Isso garante que você veja o produto funcionando rápido e validemos a direção antes de investir em backend, RLS multi-tenant, auth, storage e área do cliente — que sozinhos são vários dias de trabalho.

**Assunção principal:** seguir sem Lovable Cloud nesta primeira entrega. Quando aprovar o visual, ativamos Cloud e migramos os mocks para tabelas reais com RLS por `organization_id`, auth e storage.

## Fase 1 — Fundação visual e navegação (esta entrega)

### Design system
- Paleta: violeta primário, navy para sidebar, fundo cinza-claro, verde/laranja/vermelho semânticos.
- Fonte Poppins (Google Fonts).
- Tokens HSL em `index.css`, cores e sombras em `tailwind.config.ts`.
- Variantes shadcn (Button, Card, Badge, Sidebar) usando tokens — zero cor hardcoded.
- Cards arredondados, sombras suaves, muito respiro.

### Shell do app
- Layout com **sidebar navy fixa** (collapsible) + topbar (busca global, botão criar, sino, avatar, seletor de organização).
- 13 rotas principais + Sair, todas registradas no router.

### Telas com UI real e dados mockados
1. **Login/Cadastro** — formulário e-mail/senha + botão Google + link recuperar senha (visual).
2. **Dashboard** — 8 cards de KPI, gráfico leads por origem (pizza), faturamento mensal (barras), ranking imóveis, próximas cobranças, tarefas.
3. **Imóveis** — listagem em tabela + toggle cards, filtros (status, finalidade, bairro, corretor, busca), tela cadastro/edição com todos os campos pedidos e galeria de fotos.
4. **CRM Kanban** — colunas drag-and-drop (dnd-kit), cards de lead arrastáveis, **drawer lateral direito** para criar/editar lead (não modal), colunas customizáveis.
5. **Site/Portfólio** — painel de configuração (logo, cores, hero, blocos toggle) + rota pública `/site/:slug` com preview profissional.
6. **Clientes** — listagem e detalhe com abas (imóveis, contratos, pagamentos).
7. **Locações** — lista de contratos ativos com barra de progresso (laranja até fidelidade, verde depois, marcador do mês atual).
8. **Pagamentos** — tabela com tipo, status, vencimento, ações.
9. **Contratos** — listagem + detalhe com barra de progresso e botão placeholder "Extrair dados com IA".
10. **Vistorias** — listagem + tela de assinatura (validação e-mail/CPF/telefone + recaptcha placeholder + checkbox aceite).
11. **Financeiro** — cards de receita/comissão/repasse + gráficos + filtros.
12. **Corretores/Equipe** — listagem da equipe, permissões, badge do plano Enterprise.
13. **IA e Conteúdo** — 5 geradores com templates locais (descrição, legenda IG, follow-up, roteiro Reels, proposta).
14. **Configurações** — perfil, organização, planos (Starter/Pro/Enterprise).
15. **Área do Cliente** — rota separada `/cliente` com menu próprio (Início, Pagamentos, Contrato, Vistoria, Acompanhamento, Arquivos, Suporte).

### Dados mockados
- Arquivo `src/lib/mock-data.ts` com seeds realistas em pt-BR (imóveis, leads, clientes, contratos, pagamentos) para demonstrar tudo funcionando.

### Detalhes técnicos
- `react-router-dom` para rotas.
- `@dnd-kit/core` + `@dnd-kit/sortable` para Kanban.
- `recharts` (já no shadcn) para gráficos.
- `react-hook-form` + `zod` para formulários.
- Layout responsivo desktop-first.

## Fase 2 — Backend (após aprovação da Fase 1)
Ativar Lovable Cloud e implementar:
- Auth e-mail/senha + Google + recuperação.
- Schema multi-tenant com `organization_id` em todas as tabelas.
- RLS por organização + papel (owner, admin, corretor, financeiro, cliente) via tabela `user_roles` + função `has_role`.
- Storage para fotos de imóveis, contratos, vistorias, boletos.
- Área do cliente com auth separada.
- Planos/subscriptions.

## Fase 3 — Recursos avançados
- IA real (descrição, legendas, follow-up) via edge function + Lovable AI.
- OCR/extração de cláusulas de contrato.
- Assinatura digital com captura de IP real.
- Geração de PDF de vistoria/contrato.

## O que esta entrega NÃO inclui
- Backend real / persistência (tudo em memória, recarrega = reset).
- Auth funcional (tela visual apenas).
- Upload real de arquivos (placeholders).
- Geração real de PDF.
- IA real (templates locais).

Confirme para eu seguir com a Fase 1.
