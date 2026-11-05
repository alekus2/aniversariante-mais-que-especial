create table if not exists public.mensagens_arvore (
    id bigint generated always as identity primary key,
    nome text not null,
    mensagem text not null,
    created_at timestamptz not null default now(),
    constraint mensagens_arvore_nome_tamanho check (char_length(btrim(nome)) between 1 and 50),
    constraint mensagens_arvore_mensagem_tamanho check (char_length(btrim(mensagem)) between 3 and 280)
);

alter table public.mensagens_arvore enable row level security;

revoke all on table public.mensagens_arvore from public, anon, authenticated;

grant select (id, nome, mensagem, created_at)
    on table public.mensagens_arvore to anon;

grant insert (nome, mensagem)
    on table public.mensagens_arvore to anon;

drop policy if exists "Visitantes podem ler bilhetes" on public.mensagens_arvore;
create policy "Visitantes podem ler bilhetes"
    on public.mensagens_arvore
    for select
    to anon
    using (true);

drop policy if exists "Visitantes podem publicar bilhetes" on public.mensagens_arvore;
create policy "Visitantes podem publicar bilhetes"
    on public.mensagens_arvore
    for insert
    to anon
    with check (
        char_length(btrim(nome)) between 1 and 50
        and char_length(btrim(mensagem)) between 3 and 280
    );
