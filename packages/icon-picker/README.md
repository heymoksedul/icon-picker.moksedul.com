# @hellokit/icon-picker

A highly polished, production-ready, and lightweight Icon Picker component for React and Next.js applications. Perfect for SaaS products, website builders, and form builders.

## Features

- 🚀 **100,000+ Icons Supported:** Supports `react-icons` libraries seamlessly.
- ⚡ **Zero UI Lag:** Highly optimized lazy-loading and chunk-based rendering.
- 🎨 **Fully Themed:** Native support for Light/Dark mode via CSS variables.
- 🖼️ **SVG Output Mode:** Auto-converts icons to SVG formats natively to avoid bundle bloat in user projects.
- 💅 **Multiple Variants:** Built-in `card`, `button`, `ghost`, and `dashed` variants.
- 🔧 **Tailwind Compatible:** Easily override styles with standard Tailwind CSS classes.

## Installation

```bash
npm install @hellokit/icon-picker
# or
pnpm add @hellokit/icon-picker
# or
yarn add @hellokit/icon-picker
```

## Quick Start

### 1. Import CSS (Globally)

Import the required CSS file in your root layout or entry point (`layout.tsx`, `_app.tsx`, or `main.tsx`).

```tsx
// app/layout.tsx
import "@hellokit/icon-picker/dist/index.css";
```

### 2. Wrap with Provider (Optional but Recommended)

Wrap your app or specific sections with the `<IconProvider>` to set global configurations or SVG output default.

```tsx
import { IconProvider } from "@hellokit/icon-picker";

export default function App({ children }) {
  return (
    <IconProvider config={{ outputFormat: "svg" }}>{children}</IconProvider>
  );
}
```

### 3. Use the Picker Field

```tsx
import { IconPickerField, type IconValue } from "@hellokit/icon-picker";
import { useState } from "react";

export default function MyComponent() {
  const [icon, setIcon] = useState<IconValue | null>(null);

  return (
    <div className="p-10">
      <IconPickerField
        value={icon}
        onChange={setIcon}
        variant="button" // Options: "button", "ghost", "card", "dashed"
        size="md"
        placeholder="Select an Icon"
      />
    </div>
  );
}
```

## Customizing Styles

The component uses Tailwind utility classes internally but exposes powerful CSS variables. You can override the component entirely using your own `className`.

```tsx
<IconPickerField
  value={icon}
  onChange={setIcon}
  // Custom Tailwind overrides
  className="w-full hover:border-red-500 rounded-none shadow-xl"
  // Custom theme variables
  theme={{
    primary: "#eab308", // Yellow
    bg: "#18181b", // Custom Dark Background
    fg: "#ffffff", // Text Color
  }}
/>
```

### Global Theme Overrides

Alternatively, you can customize the CSS variables globally in your stylesheet:

```css
:root {
  --ip-primary: #3b82f6;
  --ip-primary-fg: #ffffff;
  --ip-bg: #ffffff;
  --ip-surface: #f4f4f5;
  --ip-border: #e4e4e7;
  --ip-fg: #09090b;
  --ip-fg-muted: #71717a;
}

.dark {
  --ip-bg: #09090b;
  --ip-surface: #18181b;
  --ip-border: #27272a;
  --ip-fg: #ffffff;
  --ip-fg-muted: #a1a1aa;
}
```

## API Reference

### `IconPickerField` Props

| Prop          | Type                                             | Default         | Description                                   |
| :------------ | :----------------------------------------------- | :-------------- | :-------------------------------------------- |
| `value`       | `IconValue \| null`                              | `null`          | The currently selected icon object.           |
| `onChange`    | `(value: IconValue \| null) => void`             | required        | Callback when an icon is selected or removed. |
| `variant`     | `"button" \| "ghost" \| "card" \| "dashed"`      | `"button"`      | The visual style of the picker field.         |
| `size`        | `"sm" \| "md" \| "lg" \| number`                 | `"md"`          | Size of the picker field.                     |
| `placeholder` | `string`                                         | `"Select Icon"` | Placeholder text when no icon is selected.    |
| `className`   | `string`                                         | `""`            | Appended to the root button element.          |
| `theme`       | `Partial<Record<"primary" \| "bg" \| "fg" ...>>` | `{}`            | Inline CSS variable theme overrides.          |

### `IconValue` Object

When an icon is selected, `IconValue` returns:

```ts
// If outputFormat is "svg" (Recommended)
{
  type: "svg";
  name: string; // e.g., "FaApple"
  set: string; // e.g., "fa"
  svg: string; // Raw SVG HTML string (<svg>...</svg>)
}

// If outputFormat is "react-icon"
{
  type: "react-icon";
  name: string;
  set: string;
}
```
