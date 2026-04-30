import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const SUPABASE_ENABLED = Boolean(URL && KEY);

export const supabase: SupabaseClient | null = SUPABASE_ENABLED
  ? createClient(URL!, KEY!, { realtime: { params: { eventsPerSecond: 10 } } })
  : null;

/*
 * To enable real cross-device chat:
 *
 * 1. Create a free Supabase project at https://supabase.com
 * 2. In the SQL editor run:
 *
 *    create table messages (
 *      id text primary key,
 *      group_id text not null,
 *      user_id text not null,
 *      ts bigint not null,
 *      kind jsonb not null,
 *      reactions jsonb default '{}'::jsonb,
 *      reply_to text,
 *      edited_at bigint,
 *      deleted boolean default false
 *    );
 *
 *    alter table messages enable row level security;
 *    create policy "anyone reads" on messages for select using (true);
 *    create policy "anyone writes" on messages for insert with check (true);
 *    create policy "anyone updates" on messages for update using (true);
 *    alter publication supabase_realtime add table messages;
 *
 * 3. Create .env.local in the project root with:
 *    VITE_SUPABASE_URL=your-project-url
 *    VITE_SUPABASE_ANON_KEY=your-anon-key
 *
 * 4. Restart the dev server. Done.
 */
