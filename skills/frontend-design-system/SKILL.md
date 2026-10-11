---
name: hcmute_frontend_design_system_v2
description: Quy chuẩn hệ thống thiết kế giao diện Frontend (Design System Guide V2) cho toàn bộ website và ứng dụng HCMUTE (hệ màu OKLCH, typography tiếng Việt, layout, borders, cards, shadows, animations).
---

# HCMUTE Website Frontend — Design System Guide for AI Agents (V2)

**Purpose**: This guide defines the visual design system and CSS patterns for the HCMUTE website. Follow these rules to maintain design consistency across all generated components.

**Target Audience**: AI agents (Copilot, Claude, Antigravity) generating new components, pages, and sections.

---

## 1. Color System (OKLCH)

### 1.0 QUY TẮC BẮT BUỘC: THAY THẾ CHỮ ĐEN BẰNG MÀU XANH THẪM RGB(0, 71, 118)

> [!IMPORTANT]
> **QUY CHUẨN THƯƠNG HIỆU HCMUTE (Tham chiếu chính thức: https://beta.hcmute.edu.vn)**:
> * Trong toàn bộ hệ thống giao diện (Light Theme), **TUYỆT ĐỐI KHÔNG DÙNG MÀU ĐEN THUẦN (`#000000`, `text-black`, `text-slate-900`, `text-gray-900`)** cho tiêu đề và nội dung văn bản.
> * **MÀU CHỮ TIÊU CHUẨN:** Bắt buộc sử dụng màu Xanh thẫm thương hiệu HCMUTE: **`rgb(0, 71, 118)`** (HEX: **`#004776`**).
> * **Phạm vi áp dụng:**
>   * Toàn bộ thẻ tiêu đề: `h1, h2, h3, h4, h5, h6`
>   - Nội dung đoạn văn, danh sách, bảng: `p, li, span, td, th`
>   - Chữ in đậm: `strong, b`
>   - Tên menu điều hướng, nhãn form, tiêu đề thẻ (Card titles)
> * **Trong Dark Theme:** Tự động chuyển sang màu sáng tương phản cao `--foreground: oklch(0.9411 0.019 248.0297)`.


The entire color palette uses **OKLCH color space** (perceptually uniform, modern CSS standard). All colors are defined as CSS variables in `:root` and `.dark` scopes.

### 1.1 Primary Color Palette

| Variable | Light | Dark | Purpose |
|----------|-------|------|---------|
| `--primary` | oklch(0.5505 0.2485 262.5896) | oklch(0.6357 0.1959 260.1213) | Links, CTAs, primary buttons |
| `--primary-foreground` | oklch(0.9801 0.0096 252.8096) | oklch(100% 0.00011 271.152) | Text on primary buttons |
| `--secondary` | oklch(0.9404 0.0197 245.6429) | oklch(0.2792 0.0512 251.0746) | Secondary actions, accents |
| `--secondary-foreground` | oklch(0.2993 0.0609 251.2891) | oklch(0.8989 0.0203 250.3975) | Text on secondary |
| `--accent` | oklch(0.97 0.014 254.604) | oklch(0.4007 0.1195 259.9299) | Highlights, badges |
| `--accent-foreground` | oklch(0.421 0.1203 261.7139) | oklch(0.9594 0.02 250.3828) | Text on accent |
| `--destructive` | oklch(0.6207 0.2306 24.9164) | oklch(0.6188 0.2376 25.7658) | Danger, errors, deletions |
| `--destructive-foreground` | oklch(0.9801 0.0096 252.8096) | oklch(1 0 0) | Text on destructive |

### 1.2 Neutral Color Palette

| Variable | Light | Dark | Usage |
|----------|-------|------|-------|
| `--background` | oklch(100% 0.00011 271.152) | oklch(0.1621 0.0472 251.0579) | Full-page background |
| `--foreground` | rgb(0, 71, 118) (#004776) | oklch(0.9411 0.019 248.0297) | Primary text |
| `--muted` | oklch(0.9205 0.0146 244.7261) | oklch(0.2386 0.0395 251.1373) | Muted backgrounds, disabled |
| `--muted-foreground` | oklch(38.082% 0.08041 252.8) | oklch(0.7211 0.0295 248.2358) | Secondary text, hints |
| `--card` | oklch(1 0 0) | oklch(0.2011 0.0502 250.7748) | Card/panel backgrounds |
| `--card-foreground` | oklch(0.2602 0.0703 254.8723) | oklch(0.9411 0.019 248.0297) | Card text |
| `--border` | oklch(0.93 0.03 264) | oklch(0.2991 0.0399 250.6425) | Borders, dividers, rules |
| `--input` | oklch(91.513% 0.00323 15.446) | oklch(0.2707 0.0499 250.1517) | Form input backgrounds |
| `--ring` | oklch(0.632 0.1979 260.8448) | oklch(0.6633 0.1802 257.7933) | Focus outlines |

### 1.3 Semantic Color Chart

| Variable | Light | Dark | Purpose |
|----------|-------|------|---------|
| `--chart-1` | oklch(0.6723 0.1606 244.9955) | oklch(0.6723 0.1606 244.9955) | Data visualization series 1 |
| `--chart-2` | oklch(0.6907 0.1554 160.3454) | oklch(0.6907 0.1554 160.3454) | Data visualization series 2 |
| `--chart-3` | oklch(0.8214 0.16 82.5337) | oklch(0.8214 0.16 82.5337) | Data visualization series 3 |
| `--chart-4` | oklch(0.7064 0.1822 151.7125) | oklch(0.7064 0.1822 151.7125) | Data visualization series 4 |
| `--chart-5` | oklch(0.5919 0.2186 10.5826) | oklch(0.5919 0.2186 10.5826) | Data visualization series 5 |

### 1.4 Named Color Stops (Gradient Reference)

```css
--color-1: oklch(66.2% 0.225 25.9);    /* Orange-red (accent) */
--color-2: oklch(60.4% 0.26 302);      /* Purple (secondary) */
--color-3: oklch(69.6% 0.165 251);     /* Blue-purple (primary) */
--color-4: oklch(80.2% 0.134 225);     /* Light blue (tertiary) */
--color-5: oklch(90.7% 0.231 133);     /* Yellow-green (highlight) */

--gradient-primary: oklch(0.81 0.1399 220.07);      /* Light blue gradient stop */
--gradient-secondary: oklch(0.4912 0.2867 268.64);  /* Deep purple gradient stop */
```

### 1.5 How to Use Colors in New Components

#### Correct Pattern: Use CSS Variables
```tsx
// Use --primary for links and primary actions
<a className="text-primary hover:text-primary/80">Learn More</a>

// Use --foreground for body text
<p className="text-foreground">Description text</p>

// Use --muted for secondary text
<span className="text-muted-foreground">Subtitle or helper text</span>

// Use --border for dividers
<div className="border border-border"></div>
```

---

## 2. Typography

### 2.1 Font Stack

```css
--font-sans: Inter, ui-sans-serif, sans-serif, system-ui;      /* Body, UI */
--font-serif: Georgia, serif;                                   /* Editorial */
--font-mono: JetBrains Mono, ui-monospace, monospace;           /* Code */
```

### 2.2 Fix for Vietnamese Diacritics Clipping

All text inputs automatically have `line-height: 2.05` to prevent diacritics from clipping:

```css
input, textarea, select {
  line-height: 2.05 !important;
  overflow: visible !important;
}
```

---

## 3. Spacing & Layout System

```css
--site-width: 80rem;          /* 1280px — max content width */
--site-px: 1.25rem;           /* 20px — mobile horizontal padding */
--site-px-lg: 1.5rem;         /* 24px — desktop horizontal padding */

--topbar-h: 48px;             /* Navigation bar height */
--header-h: 72px;             /* Sticky white header height */
```

---

## 4. Border Patterns

### 4.1 Vertical Side Borders (Fixed Position)
```css
.page-border-x {
  /* Fixed vertical borders at edges of --site-width */
}
```

---

## 5. Shadows & Motion

```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
```
