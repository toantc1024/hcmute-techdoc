# Legacy Data Mapping Specification

**Project:** UTEHub TechDocs (`doc.utehub.vn`)  
**Phase:** 3B-0 - Final Production Migration Gate  
**Source Storage:** Legacy `techdoc_admin_state` (JSONB) & Browser `localStorage`  
**Target Architecture:** Fully Normalized PostgreSQL Schema with Foreign Keys & RLS  

---

## 1. Overview of Legacy Data Sources

The legacy application manages administrative state via two disconnected channels:
1. **Supabase Table `techdoc_admin_state`:** Key-Value store (`key text primary key`, `value jsonb not null`, `updated_at timestamptz`).
2. **Browser Storage (`localStorage` / `sessionStorage`):** Client-side replica acting as immediate cache and offline fallback.

---

## 2. Field-by-Field Mapping Matrix

### Mapping 1: Legacy `criteria` → Target `evaluation_criteria`
Source: `techdoc_admin_state.value` where `key = 'criteria'` (7 standard criteria)

| Legacy JSON Property | Data Type | Target Column | Target Type | Transformation / Constraint |
|---|---|---|---|---|
| `id` | `string` (`crit_dns`) | `code` | `text` | Unique identifier slug (`crit_dns`) |
| `code` | `string` (`TC-01`) | `display_code` | `text` | Display code (`TC-01` to `TC-07`) |
| `name` | `string` | `title` | `text` | Mandatory title (`NOT NULL`) |
| `description` | `string` | `description` | `text` | Optional explanatory text |
| `weight` | `number` (15, 20) | `weight` | `numeric(5,2)` | `CHECK (weight >= 0)` |
| `passCondition` | `string` | `pass_condition` | `text` | Benchmark criteria |
| `warningCondition` | `string` | `warning_condition` | `text` | Benchmark criteria |
| `failCondition` | `string` | `fail_condition` | `text` | Benchmark criteria |
| `isCustom` | `boolean` | `is_custom` | `boolean` | `DEFAULT false NOT NULL` |
| *(auto)* | - | `id` | `uuid` | Primary Key (`gen_random_uuid()`) |
| *(auto)* | - | `sort_order` | `int` | Sequential ordering index |

---

### Mapping 2: Legacy `units` (Catalog) → Target `organizational_units`
Source: `techdoc_admin_state.value` where `key = 'units'` (51 units)

| Legacy JSON Property | Data Type | Target Column | Target Type | Transformation / Constraint |
|---|---|---|---|---|
| `id` | `number` (1..51) | `legacy_id` | `int` | Preserved for relational mapping (`UNIQUE NOT NULL`) |
| `stt` | `number` | `sort_order` | `int` | Sequential display position |
| `group` | `string` | `group_type` | `text` | `CHECK (group_type IN ('khoa-vien', 'phong-ban', 'trung-tam', 'doan-the'))` |
| `groupLabel` | `string` | `group_label` | `text` | Display group header label |
| `name` | `string` | `name` | `text` | Full name of Faculty / Department |
| `domain` | `string` | `domain` | `text` | Unique domain (`fme.hcmute.edu.vn`) |
| `isNewWeb` | `boolean` | `is_new_web` | `boolean` | Flag: trỏ IP mới .189 vs web cũ .181 |
| `staff` | `string` | `staff_in_charge` | `text` | Assigned personnel (Phi, Cal, Nhân, Ngân) |
| `contactEmail` | `string` | `contact_email` | `text` | Optional email |
| `contactPhone` | `string` | `contact_phone` | `text` | Optional phone |
| *(auto)* | - | `id` | `uuid` | Primary Key (`gen_random_uuid()`) |

---

### Mapping 3: Legacy `units` (Rating Header) → Target `unit_ratings`
Source: `techdoc_admin_state.value` where `key = 'units'` (Rating header per unit)

| Legacy JSON Property | Data Type | Target Column | Target Type | Transformation / Constraint |
|---|---|---|---|---|
| `id` (references unit) | `number` | `unit_id` | `uuid` | Foreign key linked to `organizational_units.id` (`ON DELETE CASCADE`) |
| *(evaluation period)* | - | `period_id` | `uuid` | Foreign key linked to active `evaluation_periods.id` (`ON DELETE CASCADE`) |
| `completenessScore` | `number` (0..100) | `total_score` | `numeric(5,2)` | `CHECK (total_score >= 0 AND total_score <= 100)` |
| `notes` | `string` | `admin_notes` | `text` | General evaluation notes |
| *(auto)* | - | `is_published` | `boolean` | `DEFAULT false` (Controlled publication model) |
| *(auto)* | - | `id` | `uuid` | Primary Key (`gen_random_uuid()`) |
| *(auto)* | - | `updated_at` | `timestamptz` | Last updated timestamp |

---

### Mapping 3b: Legacy `units` (Detailed Scores) → Target `unit_rating_items`
Source: `criteriaRatings` & `criteriaNotes` objects inside `units` JSON

| Legacy JSON Property | Data Type | Target Column | Target Type | Transformation / Constraint |
|---|---|---|---|---|
| *(parent rating)* | - | `rating_id` | `uuid` | Foreign key referencing `unit_ratings.id` (`ON DELETE CASCADE`) |
| Object Key (e.g. `crit_dns`) | `string` | `criterion_id` | `uuid` | Foreign key referencing `evaluation_criteria.id` (`ON DELETE RESTRICT`) |
| Rating Value (`pass`, `warning`, `fail`) | `string` | `rating` | `text` | `CHECK (rating IN ('pass', 'warning', 'fail'))` |
| Note Value | `string` | `note` | `text` | Specific criterion note (`DEFAULT ''`) |
| *(auto)* | - | `id` | `uuid` | Primary Key (`gen_random_uuid()`) |
| *(constraint)* | - | `UNIQUE(rating_id, criterion_id)` | - | Ensures one evaluation item per criterion per unit |

---

### Mapping 4: Legacy `sections` & `views` → Target `doc_sections`
Source: `techdoc_admin_state.value` where `key = 'sections'` & `key = 'views_start_date'`

| Legacy JSON Property | Data Type | Target Column | Target Type | Transformation / Constraint |
|---|---|---|---|---|
| `id` | `string` (`sec_dang_nhap`) | `section_key` | `text` | Unique section key (`PRIMARY KEY`) |
| `slug` | `string` | `slug` | `text` | URL slug |
| `chapterNumber` | `number` | `chapter_number` | `int` | Chapter sequence |
| `chapterTitle` | `string` | `chapter_title` | `text` | Chapter header |
| `pageTitle` | `string` | `page_title` | `text` | Page header |
| `summary` | `string` | `summary` | `text` | Short summary |
| `luong` | `string` | `luong_type` | `text` | `CHECK (luong_type IN ('A', 'B', 'C', 'TONG_QUAN', 'HE_THONG'))` |
| `isVisible` | `boolean` | `is_visible` | `boolean` | Layout toggle (`DEFAULT true`) |
| `viewCount` | `number` | `view_count` | `int` | Read count (`CHECK (view_count >= 0)`) |
| `readingTimeMinutes` | `number` | `reading_time_minutes` | `int` | Time in minutes |
| `tags` | `string[]` | `tags` | `text[]` | Document tags |

---

### Mapping 5: Legacy `phases` → Target `project_phases`
Source: `techdoc_admin_state.value` where `key = 'phases'` (4 phases)

| Legacy JSON Property | Data Type | Target Column | Target Type | Transformation / Constraint |
|---|---|---|---|---|
| `phaseId` | `number` (1..4) | `phase_number` | `int` | Unique phase sequence (`PRIMARY KEY`) |
| `title` | `string` | `title` | `text` | Phase title (`NOT NULL`) |
| `timeFrame` | `string` | `time_frame` | `text` | Target timeline |
| `target` | `string` | `target_description`| `text` | Key deliverables |
| `status` | `string` | `status` | `text` | `CHECK (status IN ('completed', 'in-progress', 'upcoming'))` |
| `completionRate` | `number` (0..100) | `completion_rate` | `numeric(5,2)` | `CHECK (completion_rate >= 0 AND completion_rate <= 100)` |

---

### Mapping 6: Legacy Audit Logs Provenance
Source: Browser `localStorage` (`hcmute_techdoc_admin_audit_logs`)

> [!WARNING]
> Browser `localStorage` is an untrusted client environment. Any audit logs imported from legacy client storage are marked with `source = 'legacy_import'` to prevent them from being mistaken for authoritative server-generated audit records.
