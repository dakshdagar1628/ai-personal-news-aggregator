# Report API Reference

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/reports | Paginated report list |
| GET | /api/reports/today | Today's report (cached or generates) |
| GET | /api/reports/history?limit=30 | Recent reports summary |
| GET | /api/reports/{date} | Report for specific date (YYYY-MM-DD) |
| POST | /api/reports/regenerate | Regenerate a report `{ "date": "YYYY-MM-DD" }` |
| GET | /api/reports/statistics | Aggregate statistics across all reports |

All responses follow the standard `{ success, data, message, timestamp }` envelope.
