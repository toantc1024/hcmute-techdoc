# Investigation Report: Score Parity Discrepancies (Migration B)

**Date**: 2026-10-18  
**Project**: iyrahtrfypjbzngmuera (Supabase Production Candidate)  
**Status**: Root Cause Proven & Verified (100% Mathematical Proof)

---

## 1. Executive Summary

During the execution of **Migration B** (`20261017000002_data_migration_candidate.sql`), the transaction safely aborted before commit with:
```text
ERROR P0001: MIGRATION ABORTED: 27 score parity discrepancies detected!
```

The discrepancy check in Migration B Step 7 compared the database trigger-computed score `r.total_score` against the seed file field `u.completenessScore`.

Our rigorous mathematical and code-level investigation reveals:
1. **The Database Trigger Calculation is 100% Identical to Application Business Logic**:
   - For all 51 units, `| JS_computeUnitScore - DB_trigger_score | <= 0.5` (**0 mismatches**).
   - Both evaluate: `earned_weight / total_weight * 100` using the criteria weights (15, 15, 15, 15, 15, 10, 15).
2. **The 27 Discrepancies are 100% Proven to be Stale Denormalized Legacy Data**:
   - In `admin-seed.json`, every single one of the 51 units had its `completenessScore` calculated using an **obsolete unweighted formula**:
     $$\text{Legacy Score} = \text{round}\left( \text{pass} \times \frac{100}{7} + \text{warning} \times \frac{50}{7} \right)$$
   - **51 out of 51 units (100.0%)** match this obsolete equal-weight formula exactly.
   - When criteria weights (15% vs 10%) were later introduced, `admin.service.ts` was updated with `computeUnitScore`, but the static `completenessScore` integers in `admin-seed.json` were never regenerated.
3. **Conclusion & Recommendation**:
   - **Authoritative Source of Truth**: The raw evaluation items in `unit_rating_items` (`rating`) combined with `evaluation_criteria` (`weight`).
   - The database trigger is correct.
   - Migration B reconciliation must compare `r.total_score` against the **true weighted evaluation score** (matching `computeUnitScore`), not against the stale legacy field.

---

## 2. Seed Rating Counts Verification

Audit of all `criteriaRatings` across the 51 units in `admin-seed.json`:

| Rating Type | Count |
| :--- | :--- |
| **Pass** | 209 |
| **Warning** | 95 |
| **Fail** | 53 |
| **Total Items** | **357** |

Formula verification: $209 + 95 + 53 = 357$. Exactly matches expected schema invariants.

---

## 3. The Two Mathematical Formulas

### A. True Application & Database Formula (Authoritative)
```typescript
// src/services/admin.service.ts
const totalWeight = criteria.reduce((sum, c) => sum + (c.weight || 10), 0); // = 100
let earned = 0;
for (const c of criteria) {
  if (ratings[c.id] === "pass") earned += c.weight;
  else if (ratings[c.id] === "warning") earned += c.weight * 0.5;
}
return Math.min(100, Math.max(0, Math.round((earned / totalWeight) * 100)));
```
- Criteria weights: `crit_dns` (15), `crit_brand` (15), `crit_luong_a` (15), `crit_luong_b` (15), `crit_luong_c` (15), `crit_security` (10), `crit_info` (15).
- Total weight = 100.
- Warning weight factor = 50% ($0.5$).

### B. Legacy Unweighted Formula in Seed (Obsolete / Stale)
$$\text{Score} = \text{round}\left( \frac{\text{pass} + 0.5 \times \text{warning}}{7} \times 100 \right)$$
In this obsolete formula, each criterion had an equal weight of $\approx 14.2857\%$.
Because `crit_security` actually has weight $10\%$ and the other 6 criteria have weight $15\%$, units with warnings or fails on different criteria diverged from equal weighting by $1.0$ to $4.0$ points.

---

## 4. Full 51-Unit Comparison Table

| ID | Unit Name | Seed Score (Stale) | JS Compute | DB Trigger | Diff (Seed - DB) | Discrepancy (>0.5)? |
| :---: | :--- | :---: | :---: | :---: | :---: | :---: |
| 1 | Viện Sư phạm Kỹ thuật | 79 | 78 | 77.5 | 1.5 | **YES (Mismatch)** |
| 2 | Phân hiệu Bình Phước | 7 | 5 | 5 | 2.0 | **YES (Mismatch)** |
| 3 | Khoa Điện - Điện tử | 93 | 93 | 92.5 | 0.5 | No (Match) |
| 4 | Khoa Kinh tế | 43 | 40 | 40 | 3.0 | **YES (Mismatch)** |
| 5 | Khoa Cơ khí | 93 | 93 | 92.5 | 0.5 | No (Match) |
| 6 | Khoa Giao thông & NL | 93 | 93 | 92.5 | 0.5 | No (Match) |
| 7 | Khoa Hóa & KH Sự sống | 93 | 93 | 92.5 | 0.5 | No (Match) |
| 8 | Khoa Công nghệ TT | 100 | 100 | 100 | 0.0 | No (Match) |
| 9 | Khoa Xây dựng | 79 | 78 | 77.5 | 1.5 | **YES (Mismatch)** |
| 10 | Khoa Đào tạo Tiên tiến | 64 | 63 | 62.5 | 1.5 | **YES (Mismatch)** |
| 11 | Khoa Chính trị và Luật | 100 | 100 | 100 | 0.0 | No (Match) |
| 12 | Khoa Mỹ thuật & TT | 57 | 55 | 55 | 2.0 | **YES (Mismatch)** |
| 13 | Khoa Khoa học Ứng dụng | 100 | 100 | 100 | 0.0 | No (Match) |
| 14 | Khoa Ngoại ngữ | 93 | 93 | 92.5 | 0.5 | No (Match) |
| 15 | Viện Đào tạo Quốc tế | 100 | 100 | 100 | 0.0 | No (Match) |
| 16 | Phòng Công tác sinh viên | 36 | 35 | 35 | 1.0 | **YES (Mismatch)** |
| 17 | Phòng Đào tạo | 93 | 93 | 92.5 | 0.5 | No (Match) |
| 18 | P. Đào tạo - VLVH | 64 | 63 | 62.5 | 1.5 | **YES (Mismatch)** |
| 19 | Phòng Khảo thí & ĐBCL | 64 | 63 | 62.5 | 1.5 | **YES (Mismatch)** |
| 20 | Phòng Quan hệ Doanh nghiệp | 100 | 100 | 100 | 0.0 | No (Match) |
| 21 | Phòng Quan hệ Quốc tế | 79 | 78 | 77.5 | 1.5 | **YES (Mismatch)** |
| 22 | Phòng QLĐT XD & Đấu thầu | 100 | 100 | 100 | 0.0 | No (Match) |
| 23 | Phòng Quản trị CSVC | 64 | 63 | 62.5 | 1.5 | **YES (Mismatch)** |
| 24 | Phòng QTTH & Truyền thông | 100 | 100 | 100 | 0.0 | No (Match) |
| 25 | Phòng Tổ chức – Nhân sự | 64 | 63 | 62.5 | 1.5 | **YES (Mismatch)** |
| 26 | Phòng Hành chính – Tổng hợp | 71 | 70 | 70 | 1.0 | **YES (Mismatch)** |
| 27 | Phòng Khoa học Công nghệ | 93 | 93 | 92.5 | 0.5 | No (Match) |
| 28 | Phòng Kế hoạch tài chính | 36 | 35 | 35 | 1.0 | **YES (Mismatch)** |
| 29 | Văn phòng Đảng uỷ | 36 | 33 | 32.5 | 3.5 | **YES (Mismatch)** |
| 30 | Trạm Y tế | 93 | 93 | 92.5 | 0.5 | No (Match) |
| 31 | Ban Quản lý Ký túc xá | 100 | 100 | 100 | 0.0 | No (Match) |
| 32 | Phòng Thí nghiệm mở | 43 | 40 | 40 | 3.0 | **YES (Mismatch)** |
| 33 | Viện Sau đại học | 93 | 93 | 92.5 | 0.5 | No (Match) |
| 34 | Thư viện Trường | 93 | 93 | 92.5 | 0.5 | No (Match) |
| 35 | Trung tâm GD Thể chất | 100 | 100 | 100 | 0.0 | No (Match) |
| 36 | TT Nghiên cứu NL Tái tạo | 21 | 18 | 17.5 | 3.5 | **YES (Mismatch)** |
| 37 | TT Sáng tạo Khởi nghiệp | 71 | 70 | 70 | 1.0 | **YES (Mismatch)** |
| 38 | Trung tâm TT – Máy tính | 36 | 33 | 32.5 | 3.5 | **YES (Mismatch)** |
| 39 | Trung tâm Tin học | 36 | 33 | 32.5 | 3.5 | **YES (Mismatch)** |
| 40 | Trung tâm Ngoại ngữ | 36 | 33 | 32.5 | 3.5 | **YES (Mismatch)** |
| 41 | TT Học liệu và Dạy học số | 93 | 93 | 92.5 | 0.5 | No (Match) |
| 42 | TT GD Quốc phòng và AN | 71 | 70 | 70 | 1.0 | **YES (Mismatch)** |
| 43 | Trung tâm Robot Thông minh | 43 | 40 | 40 | 3.0 | **YES (Mismatch)** |
| 44 | Tạp chí KHGD Kỹ thuật | 100 | 100 | 100 | 0.0 | No (Match) |
| 45 | Công đoàn Trường | 100 | 100 | 100 | 0.0 | No (Match) |
| 46 | Đoàn Thanh niên - Hội SV | 29 | 25 | 25 | 4.0 | **YES (Mismatch)** |
| 47 | Hội Cựu sinh viên | 43 | 40 | 40 | 3.0 | **YES (Mismatch)** |
| 48 | Đào tạo ngắn hạn online | 43 | 40 | 40 | 3.0 | **YES (Mismatch)** |
| 49 | Đào tạo từ xa | 93 | 93 | 92.5 | 0.5 | No (Match) |
| 50 | Rèn luyện và CTXH | 36 | 35 | 35 | 1.0 | **YES (Mismatch)** |
| 51 | Hội đồng Giáo sư cơ sở | 100 | 100 | 100 | 0.0 | No (Match) |

---

## 5. Breakdown of All 27 Discrepancies

All 27 discrepancies fall into **Category B (Stale legacy aggregate computed with obsolete equal weights)**:

| ID | Unit Name | Seed Score | DB Score | Diff | Pass / Warn / Fail | Cause |
| :---: | :--- | :---: | :---: | :---: | :---: | :--- |
| 1 | Viện Sư phạm Kỹ thuật | 79 | 77.5 | +1.5 | P:4, W:3, F:0 | Category B: Stale equal-weight calculation ($1/7$) |
| 2 | Phân hiệu Bình Phước | 7 | 5 | +2.0 | P:0, W:1, F:6 | Category B: Stale equal-weight calculation ($1/7$) |
| 4 | Khoa Kinh tế | 43 | 40 | +3.0 | P:2, W:2, F:3 | Category B: Stale equal-weight calculation ($1/7$) |
| 9 | Khoa Xây dựng | 79 | 77.5 | +1.5 | P:5, W:1, F:1 | Category B: Stale equal-weight calculation ($1/7$) |
| 10 | Khoa Đào tạo Tiên tiến | 64 | 62.5 | +1.5 | P:2, W:5, F:0 | Category B: Stale equal-weight calculation ($1/7$) |
| 12 | Khoa Mỹ thuật & TT | 57 | 55 | +2.0 | P:1, W:6, F:0 | Category B: Stale equal-weight calculation ($1/7$) |
| 16 | Phòng Công tác sinh viên | 36 | 35 | +1.0 | P:1, W:3, F:3 | Category B: Stale equal-weight calculation ($1/7$) |
| 18 | P. Đào tạo - VLVH | 64 | 62.5 | +1.5 | P:2, W:5, F:0 | Category B: Stale equal-weight calculation ($1/7$) |
| 19 | Phòng Khảo thí & ĐBCL | 64 | 62.5 | +1.5 | P:2, W:5, F:0 | Category B: Stale equal-weight calculation ($1/7$) |
| 21 | Phòng Quan hệ Quốc tế | 79 | 77.5 | +1.5 | P:5, W:1, F:1 | Category B: Stale equal-weight calculation ($1/7$) |
| 23 | Phòng Quản trị CSVC | 64 | 62.5 | +1.5 | P:2, W:5, F:0 | Category B: Stale equal-weight calculation ($1/7$) |
| 25 | Phòng Tổ chức – Nhân sự | 64 | 62.5 | +1.5 | P:2, W:5, F:0 | Category B: Stale equal-weight calculation ($1/7$) |
| 26 | Phòng Hành chính – Tổng hợp | 71 | 70 | +1.0 | P:3, W:4, F:0 | Category B: Stale equal-weight calculation ($1/7$) |
| 28 | Phòng Kế hoạch tài chính | 36 | 35 | +1.0 | P:1, W:3, F:3 | Category B: Stale equal-weight calculation ($1/7$) |
| 29 | Văn phòng Đảng uỷ | 36 | 32.5 | +3.5 | P:1, W:3, F:3 | Category B: Stale equal-weight calculation ($1/7$) |
| 32 | Phòng Thí nghiệm mở | 43 | 40 | +3.0 | P:2, W:2, F:3 | Category B: Stale equal-weight calculation ($1/7$) |
| 36 | TT Nghiên cứu NL Tái tạo | 21 | 17.5 | +3.5 | P:1, W:1, F:5 | Category B: Stale equal-weight calculation ($1/7$) |
| 37 | TT Sáng tạo Khởi nghiệp | 71 | 70 | +1.0 | P:3, W:4, F:0 | Category B: Stale equal-weight calculation ($1/7$) |
| 38 | Trung tâm TT – Máy tính | 36 | 32.5 | +3.5 | P:1, W:3, F:3 | Category B: Stale equal-weight calculation ($1/7$) |
| 39 | Trung tâm Tin học | 36 | 32.5 | +3.5 | P:1, W:3, F:3 | Category B: Stale equal-weight calculation ($1/7$) |
| 40 | Trung tâm Ngoại ngữ | 36 | 32.5 | +3.5 | P:1, W:3, F:3 | Category B: Stale equal-weight calculation ($1/7$) |
| 42 | TT GD Quốc phòng và AN | 71 | 70 | +1.0 | P:3, W:4, F:0 | Category B: Stale equal-weight calculation ($1/7$) |
| 43 | Trung tâm Robot Thông minh | 43 | 40 | +3.0 | P:2, W:2, F:3 | Category B: Stale equal-weight calculation ($1/7$) |
| 46 | Đoàn Thanh niên - Hội SV | 29 | 25 | +4.0 | P:1, W:2, F:4 | Category B: Stale equal-weight calculation ($1/7$) |
| 47 | Hội Cựu sinh viên | 43 | 40 | +3.0 | P:2, W:2, F:3 | Category B: Stale equal-weight calculation ($1/7$) |
| 48 | Đào tạo ngắn hạn online | 43 | 40 | +3.0 | P:2, W:2, F:3 | Category B: Stale equal-weight calculation ($1/7$) |
| 50 | Rèn luyện và CTXH | 36 | 35 | +1.0 | P:1, W:3, F:3 | Category B: Stale equal-weight calculation ($1/7$) |

---

## 6. Authoritative Source Recommendation & Migration Plan

1. **Source of Truth**:
   The relational model is normalized: `unit_rating_items` is the authoritative ground truth for all evaluation data. `unit_ratings.total_score` is a computed aggregate maintained automatically by the database trigger `trg_techdocs_recalc_unit_rating_score`.
2. **Migration B Patch**:
   - Keep `unit_ratings.total_score` populated and recalculated by the trigger.
   - Update Step 7 reconciliation to verify that `r.total_score` matches the **authoritative JS evaluation score** (`earned_weight / total_weight * 100`).
   - Assert:
     - 51 units verified with 0 discrepancies against authoritative formula.
     - 357 rating items verified.
     - 0 discrepancies between JS application logic and DB trigger.
