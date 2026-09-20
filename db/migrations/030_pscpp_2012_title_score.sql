ALTER TABLE user_profiles
  ADD COLUMN IF NOT EXISTS embarkation_days INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS command_days INTEGER NOT NULL DEFAULT 0;

ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_embarkation_days_check;
ALTER TABLE user_profiles
  ADD CONSTRAINT user_profiles_embarkation_days_check CHECK (embarkation_days >= 0);

ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_command_days_check;
ALTER TABLE user_profiles
  ADD CONSTRAINT user_profiles_command_days_check CHECK (command_days >= 0);
