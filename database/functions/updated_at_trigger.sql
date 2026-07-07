-- Reusable updated_at trigger function
-- Apply to any table with an updated_at column:
--   CREATE TRIGGER <table>_updated_at
--     BEFORE UPDATE ON <table>
--     FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
