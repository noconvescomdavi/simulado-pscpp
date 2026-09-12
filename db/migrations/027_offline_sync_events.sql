create table if not exists offline_sync_events (
  user_id uuid not null references users(id) on delete cascade,
  event_id varchar(180) not null,
  event_type varchar(60) not null,
  device_id varchar(180),
  processed_at timestamptz not null default now(),
  primary key (user_id, event_id)
);

create index if not exists idx_offline_sync_events_processed_at
  on offline_sync_events(processed_at desc);
