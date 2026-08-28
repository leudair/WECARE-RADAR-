-- WeCare Radar — tabela de registro de atendimentos
-- Rode este arquivo inteiro em: Supabase → SQL Editor → New query → Run

create table if not exists public.atendimentos (
  id uuid primary key default gen_random_uuid(),
  funcionaria_id uuid not null references auth.users (id) on delete cascade,
  funcionaria_email text not null,
  cliente_nome text not null default '',
  cliente_instagram text not null default '',
  acao text not null check (acao in ('amostra_gratis', 'lista_completa')),
  total_nao_reciprocos integer not null default 0,
  criado_em timestamptz not null default now()
);

alter table public.atendimentos enable row level security;

-- qualquer funcionária logada pode registrar o próprio atendimento
create policy "funcionarias podem inserir seus atendimentos"
  on public.atendimentos for insert
  to authenticated
  with check (auth.uid() = funcionaria_id);

-- qualquer funcionária logada pode ver todos os atendimentos (relatório da equipe)
create policy "funcionarias podem ver todos os atendimentos"
  on public.atendimentos for select
  to authenticated
  using (true);
