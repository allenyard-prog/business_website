# Careers and Admin Portal — Product Requirements

**Document status:** Draft for future implementation  
**Purpose:** Requirements and feasibility review only  
**Implementation status:** MVP implemented; durable file storage and public resource pages remain deferred  
**Last reviewed:** September 24, 2026

## 1. Objective

Expand the current single-position careers experience into a job board with multiple positions and a dedicated job detail/application flow. Replace the standalone application-management page with a protected admin portal that manages job posts, applications, resource types, and resources.

## 2. Current-State Review

### Existing behavior

- `/careers` is a single client-rendered job detail page for one hard-coded position.
- The application form is embedded directly in `/careers` and submits to `POST /api/applications`.
- A second, general-purpose application form component exists in `src/app/ApplicationForm.tsx`, but it is not currently rendered by the home page.
- `/applications` (plural) is the current application-management page. No `/application` (singular) route exists in the repository.
- `/applications` supports:
  - unread, read, and all filters;
  - expandable application details;
  - marking an application as read or unread;
  - an email link for contacting the applicant.
- A delete server action and delete-button component exist, but deletion is not exposed in the current application-management page.
- PostgreSQL and Prisma already persist application records.
- The current `Application` record stores the role as free text rather than linking it to a job record.
- Résumés are checked for type and size, but only the original filename is saved. The uploaded file itself is not persisted.
- Basic Authentication currently protects only `/applications`. It uses environment variables but also contains fallback credentials in source code.
- There are no current database models, APIs, or admin screens for jobs, resource types, or resources.

### Feasibility conclusion

The requested work is **eligible and feasible** within the current Next.js, Prisma, and PostgreSQL architecture. It is not a content-only change: it requires new database models and migrations, new public and admin routes, authentication changes, and application-data migration.

The main prerequisite decisions are:

1. Choose production-grade admin authentication and remove all fallback credentials from source code.
2. Define whether a resource is a link/content record, an uploaded file, or both.
3. If résumés or resource files must be downloadable, select durable private/public object storage and define access rules.

## 3. Scope

### In scope

- A public careers listing containing multiple published positions.
- A unique public detail page for each position.
- A position-specific application form.
- A protected `/admin` portal.
- Job-post management.
- Application management.
- Resource-type management.
- Resource management.
- Retirement of the current standalone `/applications` page.
- Migration of existing application records without data loss.

### Out of scope for the first release

- Applicant accounts or an applicant self-service portal.
- Interview scheduling.
- Automated emails, reminders, or rejection workflows.
- Resume parsing or candidate scoring.
- Multi-company or multi-tenant administration.
- Advanced analytics.
- Localization.
- A public resource library, unless separately approved. This document defines admin resource management; public presentation remains a decision item.

## 4. Users and Permissions

### Visitor / applicant

- Can view published job listings and job details.
- Can submit an application for a published, open position.
- Cannot access admin routes or unpublished content.

### Administrator

- Must authenticate before accessing any `/admin` route or protected admin operation.
- Can create, edit, publish, unpublish, close, and archive job posts.
- Can view and manage applications.
- Can create, edit, order, and archive resource types and resources.

The first release may use one administrator role. Fine-grained roles such as recruiter, editor, and super-admin are deferred.

## 5. Proposed Route Structure

| Route | Access | Purpose |
|---|---|---|
| `/careers` | Public | List all published positions |
| `/careers/[slug]` | Public | Show one position and its application form |
| `/admin` | Admin | Dashboard and section navigation |
| `/admin/jobs` | Admin | Job-post list and management |
| `/admin/jobs/new` | Admin | Create a job post |
| `/admin/jobs/[id]` | Admin | Edit and manage a job post |
| `/admin/applications` | Admin | Search, filter, and review applications |
| `/admin/applications/[id]` | Admin | View and update one application |
| `/admin/resource-types` | Admin | Manage resource categories/types |
| `/admin/resources` | Admin | Manage resources |

### Route retirement

- Replace `/applications` with `/admin/applications`.
- After the admin replacement is available, `/applications` should redirect to `/admin/applications` for a defined transition period.
- If `/application` has existed in a deployed version outside this repository, it should also redirect to `/admin/applications`.
- Retired routes must not expose application data without authentication.

## 6. Functional Requirements

### 6.1 Public careers listing

The `/careers` page must:

- Display all jobs whose status is `published` and whose application state is open.
- Show, at minimum, title, team/department, location, workplace type, employment type, and a short summary.
- Link every job card or row to `/careers/[slug]`.
- Provide an intentional empty state when no positions are open.
- Exclude drafts, archived jobs, and unpublished jobs.
- Use deterministic ordering: admin-defined display order first, then most recently published.
- Be responsive and keyboard accessible.

### 6.2 Job detail and application

Each `/careers/[slug]` page must:

- Display the complete job description, including responsibilities, requirements, compensation when supplied, location, workplace type, and employment type.
- Display a clear open/closed state.
- Include an application form for an open position.
- Associate every submission with the job by immutable job ID, not only by job title or other free text.
- Prevent submissions to draft, archived, unpublished, or closed positions, including direct API requests.
- Return a useful not-found response for an invalid slug.
- Preserve readable job information for historical applications even if the original job is later renamed or archived.

The initial application form should preserve the currently collected fields where applicable:

- First name — required.
- Last name — required.
- Email — required and validated.
- Phone — configurable or required according to the job.
- Full address — configurable or required according to the job.
- Portfolio and LinkedIn URL — optional unless configured otherwise.
- Applicant message — optional or required according to the job.
- Internet provider, speeds, secure-location response, and availability — job-specific fields for the hosting-equipment role.
- Résumé — configurable as optional or required.
- Recruitment-data consent — required, versioned, and timestamped.

The first release may support a shared base form plus a small set of job-specific fields. A general-purpose form builder is out of scope.

### 6.3 Admin shell and dashboard

The `/admin` area must:

- Require authentication for all pages, APIs, server actions, files, and mutations under the admin scope.
- Provide navigation to Jobs, Applications, Resource Types, and Resources.
- Show useful summary counts, such as open jobs and unread applications.
- Prevent search-engine indexing.
- Provide a sign-out action when session-based authentication is selected.

### 6.4 Job-post management

Administrators must be able to:

- Create a draft job.
- Edit job content and metadata.
- Preview a draft before publication.
- Publish and unpublish a job.
- Close applications without removing the public job detail immediately.
- Archive a job without deleting related applications.
- Define a unique, URL-safe slug.
- Set display order.
- View application counts for each job.

Minimum job fields:

- ID.
- Title.
- Slug, unique.
- Team or department.
- Short summary.
- Full description.
- Responsibilities.
- Requirements.
- Location label.
- Workplace type: remote, hybrid, or on-site.
- Employment type.
- Compensation text or structured range, optional.
- Status: draft, published, closed, or archived.
- Application-open flag or equivalent state.
- Display order.
- Published, created, and updated timestamps.

Long-form fields must use a defined safe format. Markdown is recommended for the first release; rendered HTML must be sanitized.

### 6.5 Application management

Administrators must be able to:

- View a paginated list of applications.
- Filter by job and application status.
- Search by applicant name or email.
- Sort by received date, newest first by default.
- Open a dedicated application detail view.
- Change application workflow status.
- Add internal notes.
- Contact the applicant using an email link.
- Access the stored résumé when one exists and the administrator is authorized.
- Archive an application.

Recommended workflow statuses:

- `unread`
- `reviewing`
- `shortlisted`
- `interview`
- `rejected`
- `hired`
- `archived`

Destructive permanent deletion should not be part of the normal workflow. If required for privacy requests, it must require confirmation, be authorized, and remove associated private files.

### 6.6 Resource-type management

A resource type is a category used to organize resources, such as Guide, Template, Case Study, or Download.

Administrators must be able to:

- Create and edit a resource type.
- Set a unique name and slug.
- Add an optional description.
- Control display order.
- Activate or archive a type.
- See how many resources use each type.
- Be prevented from deleting a type that is in use, unless its resources are first reassigned or archived.

### 6.7 Resource management

For planning purposes, a resource is assumed to be a managed content item that may point to an external URL or an uploaded file. This assumption must be confirmed before implementation.

Administrators must be able to:

- Create and edit a resource.
- Assign exactly one resource type in the first release.
- Set title, slug, short description, and body/content.
- Attach an external URL, an uploaded file, or both, subject to the final resource definition.
- Add optional thumbnail/cover metadata.
- Save as draft, publish, unpublish, and archive.
- Control display order and publication date.

If resources are publicly displayed, a separate requirement must define their public routes, SEO behavior, and download/access rules.

## 7. Proposed Data Model

### `Job`

- `id` — UUID primary key.
- `title` — required.
- `slug` — required, unique.
- `team`, `summary`, `description`, `responsibilities`, `requirements`.
- `location`, `workplaceType`, `employmentType`.
- `compensation` — optional.
- `status` — constrained enum.
- `applicationOpen` — boolean.
- `applicationConfig` — optional structured configuration for supported form fields.
- `displayOrder`.
- `publishedAt`, `createdAt`, `updatedAt`.

### `Application`

- Keep existing applicant and hosting-role fields during migration.
- Add required `jobId` relation after backfilling existing records.
- Optionally retain `jobTitleSnapshot` to preserve the title seen at submission time.
- Replace the read/unread-only status constraint with the approved workflow enum.
- Add `consentedAt` and `consentVersion`.
- Add `updatedAt` and optional `archivedAt`.
- Store résumé object key, original name, content type, size, and checksum if files are enabled.

### `ApplicationNote`

- `id`, `applicationId`, `body`, `createdBy`, `createdAt`, and `updatedAt`.
- Notes are private and must never be included in public responses.

### `ResourceType`

- `id`, `name`, `slug`, `description`, `displayOrder`, `status`, `createdAt`, and `updatedAt`.

### `Resource`

- `id`, `resourceTypeId`, `title`, `slug`, `summary`, `body`.
- Optional `externalUrl`, file metadata/object key, and image metadata/object key.
- `status`, `displayOrder`, `publishedAt`, `createdAt`, and `updatedAt`.

Enums and database constraints should be used for all controlled statuses and types rather than accepting arbitrary strings.

## 8. Validation and Business Rules

- Job and resource slugs must be unique and normalized.
- Server-side validation is required even when client validation exists.
- Application submissions must reference an existing, published job that is accepting applications.
- Applicant email addresses must be normalized.
- URLs must allow only approved protocols.
- Rich text or Markdown must be sanitized before rendering.
- File type checks must inspect both declared MIME type and file signature where practical; extensions alone are insufficient.
- File size and allowed-type limits must be configurable and enforced server-side.
- Private applicant files must not use publicly guessable URLs.
- Resource deletion and job deletion should default to archive/soft-delete behavior when related records exist.
- Mutations must reject unauthenticated and unauthorized requests.
- Public forms should have rate limiting and automated-submission protection.

## 9. Security and Privacy Requirements

- Remove hard-coded fallback admin credentials before the admin portal is released.
- Prefer session-based authentication with securely hashed credentials or a managed identity provider. Basic Authentication is acceptable only as a temporary migration measure when credentials are mandatory environment values and all traffic uses HTTPS.
- Apply authentication to the entire `/admin/:path*` route tree and every associated API/server action.
- Protect against CSRF where the chosen authentication approach requires it.
- Do not log résumé contents, sensitive addresses, phone numbers, or form payloads.
- Encrypt traffic in transit and rely on encrypted managed storage at rest.
- Define applicant-data retention and deletion rules before launch.
- Record consent text/version and timestamp.
- Admin pages and private files must use `no-store` caching behavior.
- Consider an audit log for job publication, status changes, data export, and deletion. At minimum, preserve timestamps and the acting administrator where authentication provides an identity.

## 10. Accessibility, SEO, and Performance

- Public pages must meet WCAG 2.2 AA expectations for keyboard use, focus state, labels, error messaging, contrast, and semantic structure.
- Each job detail page must have unique title and description metadata.
- Published jobs should include valid `JobPosting` structured data when all required source fields are available.
- Draft, admin, and application-management pages must not be indexed.
- Careers listing and detail pages should be server-rendered or statically revalidated so content is discoverable and loads without relying on client JavaScript.
- Paginate admin application results; do not load an unbounded application table.
- Empty, loading, success, validation-error, server-error, closed-job, and not-found states must be designed explicitly.

## 11. Migration and Rollout Plan

1. Add job, resource-type, resource, note, and required enum/schema changes through Prisma migrations.
2. Seed a job record representing the current U.S.-Based Hosting Equipment Manager position.
3. Backfill every existing application to that job where the stored role matches. Route unmatched records to a designated legacy/general job record for manual review.
4. Preserve the existing role text as a title snapshot during migration.
5. Build the protected admin shell and reproduce all currently required application-review behavior under `/admin/applications`.
6. Build job management before switching the public careers page to database content.
7. Build the public job listing and detail/application routes.
8. Verify that historical applications remain readable and that new applications have valid job relations.
9. Redirect `/applications` (and deployed `/application`, if applicable) to `/admin/applications`.
10. Remove the obsolete route only after redirect and access-control tests pass.
11. Add resource management after the resource definition and file-storage decision are approved.

The migration must be reversible at the database-migration level and must not drop application data.

## 12. Acceptance Criteria

### Careers

- At least three seeded/test positions can appear on `/careers` without code changes to the page.
- Selecting a position opens its unique detail page.
- Each open position accepts an application associated with the correct job ID.
- Closed or unpublished positions reject new submissions server-side.
- No draft or archived job appears publicly.

### Admin

- An unauthenticated visitor cannot access any admin page, mutation, private application data, or private applicant file.
- An administrator can complete the full job lifecycle from draft through archive.
- An administrator can search and filter applications by job and workflow status.
- An administrator can update application status and add an internal note.
- Existing application records remain available after migration.
- `/applications` no longer renders the legacy manager and redirects to the authenticated admin destination.

### Resources

- An administrator can create, edit, order, archive, and list resource types.
- An administrator can create, edit, categorize, publish, unpublish, archive, and list resources.
- A resource type in active use cannot be accidentally deleted.
- If file uploads are enabled, authorized files remain available after deployment and unauthorized access is rejected according to their visibility.

### Quality

- Production build, lint, database migration, and relevant automated tests pass.
- Core public and admin flows work on mobile and desktop layouts.
- Keyboard-only users can complete a job application and all primary admin tasks.
- Validation failures do not lose already-entered applicant data where technically practical.

## 13. Recommended Delivery Phases

### Phase 1 — Foundation

- Authentication decision and protected admin shell.
- Job data model and current-job migration.
- Application-to-job relationship and expanded workflow statuses.
- Résumé storage decision.

### Phase 2 — Careers and recruitment admin

- Multi-position careers list.
- Job detail/application flow.
- Job-post CRUD and publication workflow.
- Application list, detail, filters, notes, and status management.
- Legacy-route redirects.

### Phase 3 — Resources

- Resource definition confirmation.
- Resource-type and resource data models.
- Admin CRUD and publication workflow.
- File storage and public resource experience, if approved.

## 14. Open Decisions

The following must be confirmed before implementation begins:

1. Does “Resource” mean an article/content item, a link, a downloadable file, or a combination?
2. Will resources have public pages? If yes, what should their public URL structure be?
3. Which admin authentication method should be used, and how many administrators are expected?
4. Should every job share one application form, or which supported fields are configurable per job?
5. Is a résumé required for all jobs, selected jobs, or none?
6. Should existing general-application fields and the unused general form be retained or removed?
7. What application retention period and privacy-deletion process are required?
8. Should applications trigger applicant confirmations or internal notifications in a later phase?
9. Should jobs display structured compensation ranges or free-form compensation text?
10. Is `/applications` the only deployed legacy route, or does `/application` also need a redirect?

## 15. Implementation Status

**Status: MVP implemented.** Database-backed careers, job details and applications, the protected admin portal, job management, application workflows and notes, resource types, and link/content resources are implemented. Three initial positions are available through database seed migrations.

The following decisions and enhancements remain deferred:

- Durable private storage for résumé bytes; the current implementation validates uploads and stores the original filename only.
- Uploaded resource files; the current resource model supports content and optional external/cover-image URLs.
- Public resource-library routes.
- Session-based identity and per-user audit attribution; the current admin portal uses environment-configured HTTP Basic Authentication.
