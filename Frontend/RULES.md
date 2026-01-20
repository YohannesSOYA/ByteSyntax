# Development Rules

## 📋 Strict Guidelines for This Project

### 1. Documentation Files
- **DO NOT** create any `.md` (markdown) files unless explicitly requested.
- All documentation must be approved before creation.

### 2. Component Organization
- **ALL** components MUST be placed inside the `src/components/` folder structure:
  - `src/components/ui/` - For shadcn/ui base components
  - `src/components/common/` - For custom shared components
  - `src/features/[feature-name]/components/` - For feature-specific components
- **NO** components should exist outside these designated folders.

### 3. Asset Management
- **ALL** assets (images, fonts, icons) MUST be declared and stored inside the `src/assets/` folder:
  - `src/assets/images/` - For all image files
  - `src/assets/fonts/` - For all font files
  - `src/assets/icons/` - For all icon files
- **NO** assets should be referenced from external locations without proper declaration.

### 4. Architecture Compliance
- **STRICTLY FOLLOW** the architecture defined in `architecture.md`.
- Folder structure MUST match the defined architecture:
  - Feature-based organization in `src/features/`
  - Hooks in appropriate locations (`src/hooks/` or `src/features/[name]/hooks/`)
  - API services in `src/features/[name]/api/` or `src/services/`
  - Types in `src/types/` or `src/features/[name]/types/`
- **NO** deviation from the established architecture without explicit approval.

---

> [!CAUTION]
> Violating these rules will result in inconsistent project structure and maintenance issues. Always verify file placement before creation.
