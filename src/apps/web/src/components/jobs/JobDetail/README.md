# JobDetail Component

A composed component for displaying rich job details with a clean, modular architecture.

## Overview

`JobDetail` displays comprehensive job information including title, company, location, salary, description, organization details, tags, application links, and timestamps. It follows a composition pattern with Single Responsibility Principle (SRP) sub-components.

## Architecture

The component is organized into focused, reusable sub-components:

```
JobDetail/
├── index.tsx          # Main orchestrator - composes all sub-components
├── Header.tsx         # Job title, company, location, badges, salary
├── Description.tsx    # Job description text
├── Organization.tsx   # Company/organization information
├── Tags.tsx           # Color-coded job tags (province, experience, etc.)
├── Apply.tsx          # Application buttons (Apply Now, View Job Board)
└── Footer.tsx         # Posted/Updated timestamps
```

### Key Principles

1. **Composition over monolith**: Each section is a separate component
2. **Single Responsibility**: Each sub-component does one thing well
3. **Prop drilling for clarity**: Explicit props make data flow obvious
4. **Conditional rendering**: Sections return `null` if no data
5. **Semantic HTML**: Uses `<article>`, `<header>`, `<section>`, `<footer>`

## Type: JobWithRichData

The component expects a `JobWithRichData` type from the API:

```typescript
type JobWithRichData = {
  id: number;
  title: string;
  city: string;
  province: string;
  remoteOk: boolean;
  salaryMin?: number;
  salaryMax?: number;
  description: string;
  company: string;
  jobBoardUrl?: string;
  postingUrl?: string;
  isAtAStartup?: boolean;
  createdAt: Date;
  updatedAt: Date;

  organization: {
    id: number;
    name: string;
    city: string;
    province: string;
    description: string;
    website?: string;
    careers_page?: string;
    industry?: string;
  } | null;

  tags: {
    provinces: { id: number; name: string; code: string }[];
    experienceLevels: { id: number; name: string }[];
    industries: { id: number; name: string }[];
    jobTypes: { id: number; name: string }[];
    roles: { id: number; name: string }[];
  };
};
```

**Note**: This is the "rich" data that includes organization and tags. The context uses a simplified `Job` type for lists.

## Sub-Components

### `index.tsx` (Main Orchestrator)

**Responsibility**: Composes all sub-components, converts timestamps to Date objects.

**Props**: `job: JobWithRichData`

**Behavior**:
- Destructures job properties
- Converts timestamp strings to Date objects
- Conditionally renders Organization (only if present)
- Passes appropriate props to each sub-component
- Wraps content in `<article>` with vertical spacing

**Example**:
```tsx
<JobDetail job={richJob} />
```

### `Header.tsx`

**Responsibility**: Displays job title, company, location, badges, and salary.

**Props**:
- `title: string`
- `company: string`
- `city: string`
- `province: string`
- `remoteOk: boolean`
- `isAtAStartup: boolean`
- `salaryMin?: number`
- `salaryMax?: number`

**Visual Elements**:
- Large title (3xl, bold, neutral-900)
- Company name (lg, neutral-600)
- Location with 📍 emoji
- Remote badge (green, rounded-full)
- Startup badge (amber, rounded-full)
- Salary formatted as "$X - Y" (null if no salary data)

**Styling**: Tailwind neutral color palette, emoji icons, semantic `<header>`.

### `Description.tsx`

**Responsibility**: Displays the job description with preserved whitespace.

**Props**: `description: string`

**Behavior**:
- Wrapped in semantic `<section>` with h2 heading
- Uses `whitespace-pre-wrap` to preserve line breaks and formatting
- Prose styling for readability

**Styling**: `prose` class for typography, neutral-700 text color.

### `Organization.tsx`

**Responsibility**: Displays company/organization details.

**Props**:
- `name: string`
- `city: string`
- `province: string`
- `industry?: string`
- `website?: string`
- `description?: string`

**Conditional Rendering**: Each field only renders if data exists.

**Visual Elements**:
- "About {name}" heading
- Key-value pairs (Location, Industry, Website)
- Website link with red brand color (`#8b2332`)
- Description with `whitespace-pre-wrap`

**Styling**: Border top separator, small text (14px), neutral colors.

### `Tags.tsx`

**Responsibility**: Displays color-coded badges for job metadata.

**Props**:
- `provinces: { id, name }[]`
- `experienceLevels: { id, name }[]`
- `industries: { id, name }[]`
- `jobTypes: { id, name }[]`
- `roles: { id, name }[]`

**Color Coding**:
- Provinces: **Blue** (bg-blue-50, text-blue-700)
- Experience Levels: **Purple** (bg-purple-50, text-purple-700)
- Industries: **Teal** (bg-teal-50, text-teal-700)
- Job Types: **Orange** (bg-orange-50, text-orange-700)
- Roles: **Pink** (bg-pink-50, text-pink-700)

**Conditional Rendering**: Returns `null` if all tag arrays are empty.

**Styling**: Small rounded badges (px-2 py-1), flex-wrap layout.

### `Apply.tsx`

**Responsibility**: Provides application action buttons.

**Props**:
- `jobBoardUrl?: string`
- `postingUrl?: string`

**Buttons**:
1. **Apply Now** (Primary):
   - Uses `postingUrl`
   - Red background (`#8b2332`)
   - White text
   - Hover darkens to `#721c28`

2. **View Job Board** (Secondary):
   - Uses `jobBoardUrl`
   - Outlined with red border
   - Red text
   - Hover has light red background (`#8b2332/5`)

**Conditional Rendering**: Returns `null` if both URLs are missing.

**Styling**: Border top separator, flex-wrap layout, transition colors.

### `Footer.tsx`

**Responsibility**: Displays posting and update timestamps.

**Props**:
- `createdAt: Date`
- `updatedAt: Date`

**Behavior**:
- Formats dates in Canadian locale (`en-CA`)
- Shows "Posted: [date]"
- Shows "Updated: [date]" only if different from posted date

**Formatting**: "Month Day, Year" (e.g., "January 15, 2025")

**Styling**: Border top separator, extra-small text (12px), neutral-500.

## Usage

### In a Server Component

The component is designed to work with server-side data fetching:

```tsx
// app/jobs/[id]/page.tsx
import { jobsApi } from "@/data/api/jobs";
import JobDetail from "@/components/jobs/JobDetail";
import type { JobWithRichData } from "@/data/api/jobs";

export default async function JobPage({ params }: { params: { id: string } }) {
  const jobId = parseInt(params.id, 10);
  const job: JobWithRichData = await jobsApi.getRichById(jobId);

  if (!job) {
    notFound();
  }

  return <JobDetail job={job} />;
}
```

### With Error Handling

```tsx
export default async function JobPage({ params }: { params: { id: string } }) {
  try {
    const job = await jobsApi.getRichById(parseInt(params.id, 10));
    return <JobDetail job={job} />;
  } catch (error) {
    console.error("Failed to fetch job:", error);
    return <div>Job not found</div>;
  }
}
```

### Conditional Organization

The Organization section only renders if `job.organization` is truthy:

```tsx
{organization && (
  <Organization
    name={organization.name}
    city={organization.city}
    province={organization.province}
    industry={organization.industry}
    website={organization.website}
    description={organization.description}
  />
)}
```

## Styling Decisions

### Color Palette

- **Primary brand color**: `#8b2332` (deep red) - used for links and primary actions
- **Neutral text**: `neutral-900`, `neutral-700`, `neutral-600`, `neutral-500`
- **Tag colors**: Blue, Purple, Teal, Orange, Pink for categorical differentiation
- **Badge backgrounds**: Light tints (50 shade) with darker text (700 shade)

### Typography

- **Title**: `text-3xl font-bold`
- **Company name**: `text-lg`
- **Section headings**: `text-xl font-semibold`
- **Body text**: `text-sm` or `prose prose-sm`
- **Footer**: `text-xs`

### Spacing

- Vertical between sections: `space-y-6` (24px)
- Section padding: `pt-6` after borders
- Button gap: `gap-3` (12px)
- Tag gap: `gap-2` (8px)

### Borders

- Top border separators between sections: `border-t border-neutral-200`
- Light gray border for subtle separation

## Design Patterns

### Composition Pattern

Each sub-component is self-contained and can be used independently:

```tsx
// Use just the header
import Header from "@/components/jobs/JobDetail/Header";
<Header title="..." company="..." city="..." province="..." />

// Use just the tags
import Tags from "@/components/jobs/JobDetail/Tags";
<Tags provinces={[]} experienceLevels={[]} ... />
```

### Conditional Rendering Pattern

Components gracefully handle missing data:

```tsx
// Organization.tsx - returns null section if no organization
{organization && <Organization {...} />}

// Apply.tsx - returns null if no URLs
if (!jobBoardUrl && !postingUrl) return null;

// Tags.tsx - returns null if all tag arrays empty
if (!hasTags) return null;
```

### Semantic HTML

Proper HTML5 elements for accessibility and SEO:

- `<article>` for the main job detail container
- `<header>` for job title and company info
- `<section>` for each logical section (description, organization, tags, apply)
- `<footer>` for timestamps

## Advantages of This Architecture

1. **Maintainability**: Each sub-component has a single, clear responsibility
2. **Reusability**: Sub-components can be used independently (e.g., Header in job card)
3. **Testability**: Small components are easier to unit test
4. **Readability**: Clear data flow through explicit props
5. **Flexibility**: Easy to add/remove/reorder sections
6. **Performance**: Each component can be optimized independently

## Testing

### Unit Testing Example

```tsx
// __tests__/JobDetail/Header.test.tsx
import { render, screen } from "@testing-library/react";
import Header from "@/components/jobs/JobDetail/Header";

describe("Header", () => {
  it("renders job title and company", () => {
    render(
      <Header
        title="Software Engineer"
        company="TechCorp"
        city="Toronto"
        province="ON"
        remoteOk={false}
        isAtAStartup={false}
      />
    );

    expect(screen.getByText("Software Engineer")).toBeInTheDocument();
    expect(screen.getByText("TechCorp")).toBeInTheDocument();
  });

  it("shows remote badge when remoteOk is true", () => {
    render(
      <Header
        title="Software Engineer"
        company="TechCorp"
        city="Toronto"
        province="ON"
        remoteOk={true}
        isAtAStartup={false}
      />
    );

    expect(screen.getByText("Remote")).toBeInTheDocument();
  });
});
```

### Integration Testing

Test the full JobDetail composition:

```tsx
import { render, screen } from "@testing-library/react";
import JobDetail from "@/components/jobs/JobDetail";
import type { JobWithRichData } from "@/data/api/jobs";

const mockJob: JobWithRichData = {
  // ... complete mock data
};

describe("JobDetail", () => {
  it("renders all sections with complete data", () => {
    render(<JobDetail job={mockJob} />);

    expect(screen.getByText(mockJob.title)).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
    expect(screen.getByText("About")).toBeInTheDocument();
    expect(screen.getByText("Tags")).toBeInTheDocument();
    expect(screen.getByText("Apply")).toBeInTheDocument();
  });
});
```

## Future Enhancements

Potential improvements:

1. **Markdown support**: Replace `whitespace-pre-wrap` with a Markdown renderer for rich descriptions
2. **Salary formatting**: Add currency formatter, handle different ranges (e.g., "$50k-80k")
3. **Organization logo**: Add image support to Organization section
4. **Share functionality**: Add social sharing buttons to Apply section
5. **Bookmark/Save**: Add bookmark action button
6. **Similar jobs**: Render related job suggestions component
7. **Mobile optimization**: Consider collapsible sections for mobile views

## Related Files

- **API client**: `apps/web/src/data/api/jobs/index.ts` - `getRichById()` function
- **Server route**: `apps/server/src/routes/jobs/jobs.ts` - GET `/:id` endpoint
- **Database**: `apps/server/src/db/functions/jobs/jobs.ts` - `getJobWithRichData()` function
