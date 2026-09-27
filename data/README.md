# ESTIBORDO local content data

This directory is the source-of-truth packaging boundary for immutable/versioned academic content in the Android local runtime.

- `manifest.json`: content schema/version and bank catalog.
- Question banks remain read-only application content.
- Mutable learner state must never be stored here; it belongs to the Android private SQLite database.
- Updating academic content must preserve stable question IDs and must not replace learner state.
