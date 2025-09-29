## Admin Reports Dashboard (Frontend + Backend Stub)

A minimal admin dashboard to review and manage AI-assisted incident reports. Includes a static frontend and an optional Node/Express backend stub with token auth for privileged actions.

### Project layout

- `admin/index.html` — Single-file frontend with vanilla JS, CSS, and HTML
- `backend/server.js` — Express server with JSON endpoints and token validation
- `backend/package.json` — Dependencies and scripts
- `seed/sample_reports.json` — Eight sample reports for demo mode

### Features

- Token-based admin auth: paste token; stored in `localStorage`; sent as `Authorization: Bearer <token>`
- Sample mode toggle: fetches from `seed/sample_reports.json` and simulates updates
- Reports table: ID, Photo, AI Summary, Category, Severity, Urgency, Date, Status, Actions
- Sorting: by Severity (desc), Urgency (CRITICAL>HIGH>MEDIUM>LOW), Date (newest first)
- Filtering and search: by Status, Urgency, and free-text (category/summary)
- Row action View: modal with full-size photo, AI details, description, map, status dropdown
- Status update: optimistic UI; PUT `/reports/:id/status`; spinner + toasts; sample mode simulates
- Email confirmation links: GET `/reports/:id/confirm?action=confirm|reopen` documented and clickable text
- Refresh + optional 30s polling; CSV export of current filtered view
- Responsive and accessible UI (semantic markup, ARIA on modal)

### Running the frontend only (sample mode)

Simply open `admin/index.html` in your browser. Toggle "Use sample data" to on. No backend required.

### Running the backend stub

Requirements: Node 18+

1. Install deps and start server

```bash
cd backend
npm install
# set an admin token (optional; defaults to "changeme")
$env:ADMIN_TOKEN = "my-secret"  # PowerShell
# export ADMIN_TOKEN=my-secret    # bash/zsh
npm start
```

2. Open the dashboard

- Visit `http://localhost:3000/admin` (frontend is statically served by the stub)
- In the dashboard, paste your token (e.g., `my-secret`) and click Save Token
- Ensure "Use sample data" is OFF to use the backend

3. Configure API origin (optional)

- The frontend reads `API_BASE` from `localStorage`. By default it uses same-origin.
- To point to another origin, open the browser console and run:

```js
localStorage.setItem('API_BASE', 'http://localhost:3000');
```

Reload the page.

### API contract

All responses are JSON. Backend stub validates `Authorization: Bearer <ADMIN_TOKEN>` on `PUT /reports/:id/status` only.

#### GET /reports
Returns array of report objects.

#### GET /reports/:id
Returns a single report object.

#### PUT /reports/:id/status
Body:

```json
{ "status": "IN_PROGRESS|RESOLVED|RECEIVED|CONFIRMED_CLOSED|REOPENED", "resolved_by": "admin-id-or-email" }
```

- Requires header: `Authorization: Bearer <token>`
- Returns: updated report object
- Stub logs when `status` becomes `RESOLVED` (simulating email trigger)

#### GET /reports/:id/confirm?action=confirm|reopen
- `action=confirm` sets status to `CONFIRMED_CLOSED`
- `action=reopen` sets status to `REOPENED` and increments `reopen_count`

### Example curl commands

Assuming `ADMIN_TOKEN=my-secret` and server at `http://localhost:3000`.

```bash
# List reports
curl http://localhost:3000/reports | jq .

# Get single report
curl http://localhost:3000/reports/11111111-1111-1111-1111-111111111111 | jq .

# Update status (requires token)
curl -X PUT http://localhost:3000/reports/11111111-1111-1111-1111-111111111111/status \
  -H "Authorization: Bearer my-secret" \
  -H "Content-Type: application/json" \
  -d '{"status":"RESOLVED","resolved_by":"admin@example.com"}' | jq .

# Email confirmation links
curl "http://localhost:3000/reports/33333333-3333-3333-3333-333333333333/confirm?action=confirm" | jq .
curl "http://localhost:3000/reports/77777777-7777-7777-7777-777777777777/confirm?action=reopen" | jq .
```

### Report object shape

```json
{
  "id": "uuid",
  "user_id": "uuid",
  "photo_url": "https://.../file.jpg",
  "latitude": 12.9716,
  "longitude": 77.5946,
  "description": "user text",
  "ai_category": "Pothole",
  "ai_summary": "Large pothole at a busy bus stop ...",
  "ai_severity_score": 4.5,
  "ai_urgency_level": "CRITICAL",
  "status": "RECEIVED",
  "created_at": "2025-09-10T08:23:12Z",
  "updated_at": "2025-09-10T08:23:12Z",
  "resolved_by": null,
  "resolved_at": null,
  "reopen_count": 0
}
```

### Security notes

- Never embed production Supabase service role keys in client HTML.
- For privileged actions in production, proxy via a secure server using `SUPABASE_SERVICE_ROLE_KEY` or equivalent.
- For this demo, the stub uses a simple `ADMIN_TOKEN` environment variable and checks it for the status update route.
- The dashboard sends the token as `Authorization: Bearer <token>` when present.

### Troubleshooting

- If the dashboard fails to load from the API, it will automatically switch to sample mode and display a toast.
- Ensure CORS is allowed if serving the frontend from a different origin.
- To reset token/API base, clear `localStorage` for the site.


