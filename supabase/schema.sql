-- Tabella delle prenotazioni, scritta dal Route Handler POST /api/prenota.
-- Esegui questo SQL nell'editor SQL di Supabase.

create table if not exists public.prenotazioni (
  id          uuid        primary key default gen_random_uuid(),
  created_at  timestamptz not null    default now(),
  name        text        not null,
  email       text        not null,
  phone       text,
  date        date        not null,
  time        text        not null,
  guests      integer     not null    check (guests >= 1),
  notes       text,
  status      text        not null    default 'pending'
);

-- La tabella viene scritta solo dal server con la service role key (bypassa la
-- RLS). Abilitiamo comunque la RLS senza policy pubbliche, cosi' il client anon
-- non puo' leggere ne' scrivere le prenotazioni.
alter table public.prenotazioni enable row level security;
