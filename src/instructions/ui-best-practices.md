# UI Best-Practices Guide

**Comprehensive guide for designing effective TBX user interfaces**

## Table of Contents

- [TBX Fundamentals](#tbx-fundamentals)
- [Architecture & Component Design](#architecture--component-design)
- [Guide](#guide)
  - [1. Foundations](#1-foundations)
  - [2. Layout & Structure](#2-layout--structure)
  - [3. Component Hierarchy](#3-component-hierarchy)
  - [4. Progressive Disclosure](#4-progressive-disclosure)
  - [5. Evaluation Patterns](#5-evaluation-patterns)
  - [6. Information Architecture](#6-information-architecture)
  - [7. Validation & Quality](#7-validation--quality)
  - [8. Visual Design](#8-visual-design)
  - [9. Accessibility](#9-accessibility)
- [Error-Handling & Validation](#error-handling--validation)
- [Real-world Examples](#real-world-examples)

---

## TBX Fundamentals

### What is TBX?

TBX (Template Builder with JSX) is a system for creating user interfaces using React-like JSX syntax within JSON configuration files. Think of it as writing HTML-like components, but with more powerful interactive elements specifically designed for data collection and user evaluation tasks.

### JSX Basics for TBX

JSX looks like HTML but is more powerful:

```jsx
// HTML-like syntax
<div>Hello World</div>

// TBX components
<View.Card title="My Section">
  <Field.Text path="username" label="Enter your name" />
</View.Card>
```

**Key differences from HTML:**
- **Self-closing tags**: `<Field.Text />` not `<Field.Text></Field.Text>`
- **camelCase attributes**: `defaultOpen={true}` not `default-open="true"`
- **Curly braces for values**: `gap={'1rem'}` not `gap="1rem"`
- **Boolean attributes**: `vertical={true}` not just `vertical`

### TBX File Structure

Every TBX interface is a JSON file with exactly 4 fields:

```json
{
  "code": "JSX components as a string",
  "data": "Initial form data as JSON string", 
  "preprocess": "JavaScript validation logic as string",
  "constants": "Reusable values as JSON string"
}
```

**Important:** All 4 fields must be strings, even `data` and `constants` which contain JSON.

### How Components Work

TBX provides pre-built components in three categories:

- **View.*** - Display components (cards, text, alerts)
- **Field.*** - Input components (text fields, checkboxes, dropdowns)
- **Layout.*** - Structure components (headers, grids)

Example component usage:
```jsx
<Field.RadioGroup 
  path="rating"           // Where to store the value
  label="Rate this"       // What user sees
  options={[              // Available choices
    { value: "good", label: "👍 Good" },
    { value: "bad", label: "👎 Bad" }
  ]}
  validation={[{required: true}]}  // Make it required
/>
```

---

## Architecture & Component Design

### Core Design Principles

**1. Container-First Approach**
Always start with a main container:
```jsx
<View.Flex vertical={true} gap={'1.25rem'}>
  {/* All your content goes inside */}
</View.Flex>
```

**2. Logical Grouping**
Group related content in cards:
```jsx
<View.Card flat={true} title="User Information">
  <View.Flex vertical={true} gap={'1.25rem'}>
    <Field.Text path="name" label="Name" />
    <Field.Text path="email" label="Email" />
  </View.Flex>
</View.Card>
```

**3. Progressive Building**
Build interfaces step by step:
1. Main container (`View.Flex`)
2. Content sections (`View.Card`)  
3. Individual components (`Field.*`, `View.*`)
4. Validation and logic

### Using Constants (CONST)

**Important:** When you reference options, choices, or any reusable data in your JSX code, you must define them in the `constants` field and reference them with `CONST.variableName` syntax.

**❌ Wrong - Undefined variable:**
```jsx
<Field.RadioGroup path="decision" options={choices} />
```

**✅ Correct - Using CONST reference:**
```jsx
<Field.RadioGroup path="decision" options={CONST.choices} />
```

**And define in the Constants pane of the editor (valid JSON object):**
```json
{
  "choices": [
    { "value": "accept", "label": "✅ Accept" },
{ "value": "reject", "label": "❌ Reject" }
  ]
}
```

**Note:** In the complete JSON file, this becomes a string:
```json
{
  "constants": "{\n  \"choices\": [\n    { \"value\": \"accept\", \"label\": \"✅ Accept\" },\n    { \"value\": \"reject\", \"label\": \"❌ Reject\" }\n  ]\n}"
}
```

### Component Combination Patterns

**Pattern 1: Simple Form**
```jsx
<View.Flex vertical={true} gap={'1.25rem'}>
  <View.Alert variant="info" title="Please fill out this form" />
  <View.Card flat={true} title="User Information">
    <View.Flex vertical={true} gap={'1.25rem'}>
      <Field.Text 
        path="name" 
        label="Your Name" 
        placeholder="Enter your full name"
        validation={[{required: true}]} 
      />
      <Field.Text 
        path="email" 
        label="Email Address" 
        placeholder="your.email@example.com"
        validation={[{required: true}]} 
      />
      <Field.RadioGroup
        path="role"
        label="Your Role"
        options={[
          { value: 'student', label: '🎓 Student' },
          { value: 'teacher', label: '👨‍🏫 Teacher' },
          { value: 'admin', label: '⚙️ Administrator' }
        ]}
        validation={[{required: true}]}
      />
    </View.Flex>
  </View.Card>
  <Field.Checkbox 
    path="agreed" 
    label="✅ I agree to the terms and conditions"
    validation={[{required: true}]}
  />
</View.Flex>
```

**Pattern 2: Multi-Step Process**
```jsx
<View.Flex vertical={true} gap={'1.25rem'}>
  <View.Labels
    labels={[
      {title: 'Progress', value: 'Step 1 of 2', theme: 'default'}
    ]}
  />
  
  <View.Collapsible title="Step 1: Basic Information" defaultOpen={true}>
    <View.Flex vertical={true} gap={'1.25rem'}>
      <Field.Text 
        path="projectName" 
        label="Project Name"
        placeholder="Enter project name"
        validation={[{required: true}]} 
      />
      <Field.RadioGroup
        path="priority"
        label="Priority Level"
        options={[
          { value: 'high', label: '🔴 High Priority' },
          { value: 'medium', label: '🟡 Medium Priority' },
          { value: 'low', label: '🟢 Low Priority' }
        ]}
        validation={[{required: true}]}
      />
    </View.Flex>
  </View.Collapsible>
  
  <View.Collapsible title="Step 2: Final Review" disabled={!data.projectName}>
    <View.Flex vertical={true} gap={'1.25rem'}>
      <Field.Textarea
        path="summary"
        label="Project Summary"
        placeholder="Describe your project..."
        validation={[{required: true, min: 20}]}
      />
      <Field.Checkbox 
        path="reviewed" 
        label="✅ I have reviewed all information"
        validation={[{required: true}]}
      />
    </View.Flex>
  </View.Collapsible>
</View.Flex>
```

**Pattern 3: Decision + Conditional Feedback**
```jsx
<View.Flex vertical={true} gap={'1.25rem'}>
  <View.Alert variant="info" title="Please evaluate this content" />
  <View.Card flat={true} title="Your Assessment">
    <View.Flex vertical={true} gap={'1.25rem'}>
      <Field.RadioGroup
        path="decision"
        label="What is your decision?"
        options={[
          { value: 'accept', label: '✅ Accept' },
{ value: 'reject', label: '❌ Reject' },
{ value: 'rewrite', label: '🔄 Rewrite' }
        ]}
        validation={[{required: true}]}
      />
      
      {data.decision === 'reject' && (
        <Field.Textarea 
          path="reason" 
          label="Reason for Rejection"
          placeholder="Please explain why you rejected this..."
          validation={[{required: true, min: 20}]}
        />
      )}
      
      {data.decision === 'rewrite' && (
        <Field.Textarea 
          path="suggestions" 
          label="Suggestions for Improvement"
          placeholder="What changes would you recommend..."
          validation={[{required: true, min: 15}]}
        />
      )}
    </View.Flex>
  </View.Card>
  <Field.Checkbox
    path="confirmed"
    label="✅ I confirm my evaluation is final"
    validation={[{required: true}]}
  />
</View.Flex>
```

**Required constants for Pattern 3:**

**For the Constants pane in the editor (valid JSON object):**
```json
{
  "choices": [
        {
      "value": "accept",
      "label": "✅ Accept",
      "hint": "Content meets requirements"
    },
    {
      "value": "reject",
      "label": "❌ Reject",
      "hint": "Content has issues"
    },
    {
      "value": "rewrite",
      "label": "🔄 Rewrite",
      "hint": "Content needs improvements"
    }
  ],
  "stepChoices": [
    {
      "value": "continue",
      "label": "✅ Continue to next step"
    },
    {
      "value": "review",
      "label": "🔄 Review previous steps"
    }
  ]
}
```

**In the complete JSON file (as string):**
```json
{
  "constants": "{\n  \"choices\": [\n    {\n      \"value\": \"approve\",\n      \"label\": \"✅ Approve\",\n      \"hint\": \"Content meets requirements\"\n    },\n    {\n      \"value\": \"reject\",\n      \"label\": \"❌ Reject\",\n      \"hint\": \"Content has issues\"\n    },\n    {\n      \"value\": \"revise\",\n      \"label\": \"🔄 Needs Revision\",\n      \"hint\": \"Content needs improvements\"\n    }\n  ],\n  \"stepChoices\": [\n    {\n      \"value\": \"continue\",\n      \"label\": \"✅ Continue to next step\"\n    },\n    {\n      \"value\": \"review\",\n      \"label\": \"🔄 Review previous steps\"\n    }\n  ]\n}"
}
```

### Architecture Best Practices

**Constants Strategy:**
- Define all reusable data in the `constants` field
- Reference with `CONST.variableName` in JSX code
- Use descriptive names: `CONST.qualityOptions`, `CONST.statusChoices`
- Include `hint` properties for complex options

**Spacing Hierarchy:**
- Major sections: `gap={'1.25rem'}`
- Related items: `gap={'1rem'}`
- Closely related: `gap={'0.5rem'}`

**Component Order:**
1. Instructions/alerts at the top
2. Main content in the middle  
3. Confirmations at the bottom

**Validation Strategy:**
- Required fields: `validation={[{required: true}]}`
- Text length: `validation={[{min: 10, max: 500}]}`
- AI content: Use `aiChecks` instead of validation

---

## Guide

### 1. Foundations

**Takeaway:** Build on proven architectural patterns using foundational components as the core structure for all interfaces.

- **Use View.Flex as universal container** - Always specify `vertical={true}` for main content flows with consistent `gap` values
- **Establish component hierarchy** - Tier 1 (Foundation), Tier 2 (Enhanced), Tier 3 (Specialized) based on usage frequency and importance
- **Follow JSON structure requirements** - All interfaces must use exact 4-field format: code, data, preprocess, constants as strings
- **Always validate components exist** - Check every component against `elements.d.ts` before use

### 2. Layout & Structure

**Takeaway:** Create clear visual hierarchy through consistent spacing and proper container usage that guides users through complex workflows.

- **Use rem units for consistent spacing** - Standard gaps: `0.5rem`, `1rem`, `1.25rem`, `1.5rem`, `2rem` for different relationship levels
- **Apply View.Card with flat={true}** - Use for content grouping with subtle styling without heavy borders
- **Implement spacing hierarchy** - Major sections: `gap={'1.25rem'}`, related content: `gap={'1rem'}`, closely related items: `gap={'0.5rem'}`
- **Structure with sticky headers** - Use Layout.StickyHeader for professional header layout that maintains context during scrolling

### 3. Component Hierarchy

**Takeaway:** Choose components based on their usage tier and specific purpose to create interfaces that balance functionality with simplicity.

- **Tier 1 Foundation (Must-Have)** - View.Flex, View.Card, Field.RadioGroup, Field.Checkbox, View.Alert, View.Labels for core functionality
- **Tier 2 Enhanced (Highly Recommended)** - Field.AiEditor, Field.Select, View.Markdown, View.Collapsible for advanced features
- **Tier 3 Specialized (Context-Dependent)** - View.Pdf, View.Video, Field.List for specific use cases
- **Follow component selection logic** - Use decision matrix based on user request patterns

### 4. Progressive Disclosure

**Takeaway:** Reveal information and functionality in logical sequence to prevent cognitive overload and improve task completion rates.

- **Use View.Collapsible for multi-step workflows** - Set `defaultOpen={true}` for initial/current steps, `disabled` logic based on prerequisite completion
- **Implement conditional field enabling** - Show fields only when relevant based on user choices to maintain focus
- **Provide clear step numbering** - Include progress indicators in headers and step descriptions
- **Benefits proven by metrics** - 40% reduction in task completion time, improved user focus and decision quality

### 5. Evaluation Patterns

**Takeaway:** Design evaluation-centric interfaces using standard patterns that 89% of successful interfaces employ for consistent user experience.

- **Follow evaluation flow** - Context Display → Evaluation Criteria → Rating/Decision → Feedback → Approval
- **Use Field.RadioGroup for primary decisions** - Include emoji conventions (✅, ❌, 🔄) with descriptive labels explaining each option
- **Add conditional Field.Textarea for failures** - Show detailed feedback fields when evaluation fails or needs improvement
- **Include Field.Checkbox for final confirmations** - Use for binary approvals and completion markers

### 6. Information Architecture

**Takeaway:** Structure information using proven hierarchy patterns that improve user comprehension and reduce cognitive load.

- **Apply visual hierarchy standards** - View.Text variant="h2" for main titles, View.Card title for section headers, View.Labels for metadata
- **Use immediate feedback systems** - Dynamic View.Labels for status updates, validation messages at field and form levels
- **Implement consistent interaction patterns** - Evaluation Pattern, Generation Pattern, Review Pattern for similar interactions
- **Organize with View.Tabs** - For multiple content views, historical data organization, and different content types

### 7. Validation & Quality

**Takeaway:** Implement comprehensive validation at multiple levels to ensure high-quality data collection and prevent user errors.

- **Apply field-level validation** - Use `validation={[{ required: true }]}` for all required fields with appropriate constraints
- **Use Field.AiEditor aiChecks** - For rich content validation including wordCount, grammarScore (0-5 range), tokenCount instead of standard validation
- **Implement error prevention strategies** - Required field validation, input constraints, conditional field enabling, clear prerequisite communication
- **Provide recovery mechanisms** - Descriptive error messages, guided correction paths, state preservation during corrections

### 8. Visual Design

**Takeaway:** Use consistent visual language and spacing to create professional interfaces that guide user attention effectively.

- **Follow emoji conventions** - ✅ for success/accept, ❌ for failure/rejection, 🔄 for rewrite, ⚠️ for warnings
- **Apply theme standards** - Success states: `theme: 'success'`, Warning states: `theme: 'warning'`, Error states: `theme: 'error'`
- **Use View.Alert for important information** - Critical instructions, warnings, status messages with appropriate variant types
- **Maintain visual consistency** - Identical patterns for similar interactions across all interfaces

### 9. Accessibility

**Takeaway:** Design inclusive interfaces that support all users through clear labeling, helpful guidance, and keyboard navigation support.

- **Provide clear, descriptive labels** - For all interactive elements with helpful placeholder text and hints
- **Include helpful guidance** - Use View.Alert for task guidance and instructions, View.Text for context
- **Support keyboard navigation** - Design with screen readers in mind and consistent visual hierarchy
- **Use validation messages** - Provide clear, actionable validation messages at appropriate levels

---

## Error-Handling & Validation

This section compiles error scenarios and their solutions from the TBX validation guides.

### AiEditor Validation Problems

**Symptoms:** Interface fails to load, validation errors on AiEditor fields, min/max validation not working, GrammarScore validation errors

**Solutions:**
- **Remove standard validation for AiEditor** - Use `validation={[{required: true}]}` only, not min/max
- **Use aiChecks for content validation** - wordCount: `{enabled: true, validate: true, min: 20}`, grammarScore: `{enabled: true, validate: true, minScore: 3}`
- **GrammarScore critical rules** - Valid range 0-5 only, use `minScore` property not `min`/`max`, no decimals
- **Use Field.Textarea for simple validation** - When only basic length requirements needed

### Component Props Mismatch

**Symptoms:** Component not rendering, props not being recognized, TypeScript-like errors in TBX editor

**Solutions:**
- **Always check elements.d.ts first** - Verify component existence and exact prop names
- **Common prop corrections** - View.Labels uses `labels` array not `label` string, View.Text needs `content` prop, View.Card requires `flat={true}`
- **View.Link proper syntax** - Use `url` prop and `validation={{opened: true}}` structure
- **View.Text correct usage** - Use children content not `content` prop

### Wrong Component Selection

**Symptoms:** Component doesn't exist error, function not working as expected, button or action components not rendering

**Solutions:**
- **Use View.ActionButton not Field.Button** - Field.Button doesn't exist, use proper action syntax with `variant` values: 'default', 'secondary', 'ghost', 'outline'
- **Verify component existence** - Use `grep -n "ComponentName" elements.d.ts` to check availability
- **Check prop values** - Ensure variant and other prop values match TypeScript definitions

### Wrong Verdict Values

**Symptoms:** Inconsistent QA workflows, data processing errors, unclear decision states

**Solutions:**
- **MANDATORY: Use standard verdict values** - Always use `"accept"`, `"rewrite"`, `"reject"` for all quality assessment decisions
- **Avoid variations** - Don't use `"approve"`, `"revise"`, `"needs_revision"`, or other variations
- **Update existing code** - Replace any non-standard verdict values with the three required options
- **Consistent labeling** - Use `"✅ Accept"`, `"🔄 Rewrite"`, `"❌ Reject"` for user-facing labels

### Validation Logic Errors

**Symptoms:** Form submits with invalid data, required fields not enforced, conditional validation not working

**Solutions:**
- **Implement proper preprocess function** - Include error handling with `let errors = []` pattern
- **Verify field paths match data structure** - Ensure path names exactly match data field names

### JSON Syntax Errors

**Symptoms:** Interface won't load in TBX editor, JSON parsing errors, quote/escape issues

**Solutions:**
- **Validate JSON syntax** - Use `jq '.' your_interface.json` to check for errors
- **Fix quote escaping** - Use single quotes for JSX attributes inside JSON strings

---

## Real-world Examples

### Basic Interface Pattern

This example demonstrates fundamental UI patterns with all 4 required JSON fields:

```json
{
  "code": "<View.Flex vertical={true} gap={'1.25rem'}>\n  <View.Alert variant='info' title='Please evaluate this content' />\n  <View.Card flat={true} title='Your Assessment'>\n    <View.Flex vertical={true} gap={'1.25rem'}>\n      <Field.RadioGroup\n        path='rating'\n        label='Overall Quality'\n        options={[\n          { value: 'excellent', label: '⭐ Excellent' },\n          { value: 'good', label: '✅ Good' },\n          { value: 'poor', label: '❌ Poor' }\n        ]}\n        validation={[{ required: true }]}\n      />\n      <Field.Textarea\n        path='feedback'\n        label='Comments'\n        placeholder='Explain your rating...'\n        validation={[{ min: 10 }]}\n      />\n    </View.Flex>\n  </View.Card>\n  <Field.Checkbox\n    path='confirmed'\n    label='✅ I confirm my evaluation'\n    validation={[{ required: true }]}\n  />\n</View.Flex>",
  "data": "{\n  \"rating\": \"\",\n  \"feedback\": \"\",\n  \"confirmed\": false\n}",
  "preprocess": "let errors = [];\nif (!data.rating) errors.push('Rating is required');\nif (!data.confirmed) errors.push('Please confirm your evaluation');\nreturn { ...data, errors };",
  "constants": "{}"
}
```

**Component Definitions from elements.d.ts:**

```ts
// Foundation layout component - universal container
readonly Flex: React.FC<{
  gap?: string | number | undefined;
  vertical?: boolean | undefined;
  children: React.ReactNode;
}>;

// Primary decision component with options array format
readonly RadioGroup: React.FC<{
  path: string;
  options: {
    value: string;
    label: string;
  }[];
  validation?: ValidationRule[] | undefined;
  label?: React.ReactNode;
}>;
```

**How this demonstrates best practices:**
- Uses View.Flex with `vertical={true}` and consistent `gap={'1.25rem'}` spacing
- View.Alert provides clear instructions at the top
- Field.RadioGroup uses emoji conventions for visual clarity
- Field.Checkbox provides final confirmation
- All 4 JSON fields present with proper validation logic

### Advanced Multi-Step Workflow

This example shows complex progressive disclosure with complete JSON structure:

```json
{
  "code": "<View.Flex vertical={true} gap={'1.25rem'}>\n  <View.Labels\n    labels={[\n      {\n        title: 'Progress',\n        value: `${Object.values(data).filter(v => v === true).length}/2 steps`,\n        theme: data.step2Complete ? 'success' : 'default'\n      }\n    ]}\n  />\n  <View.Collapsible\n    title='Step 1: Initial Review'\n    defaultOpen={true}\n  >\n    <View.Flex vertical={true} gap={'1.25rem'}>\n      <Field.Text\n        path='reviewerName'\n        label='Your Name'\n        validation={[{ required: true }]}\n      />\n      <Field.Checkbox\n        path='step1Complete'\n        label='✅ Step 1 completed'\n      />\n    </View.Flex>\n  </View.Collapsible>\n  <View.Collapsible\n    title='Step 2: Final Decision'\n    disabled={!data.step1Complete}\n  >\n    <View.Flex vertical={true} gap={'1.25rem'}>\n      <Field.RadioGroup\n        path='finalDecision'\n        label='Final Verdict'\n        options={CONST.decisionOptions}\n        validation={[{ required: data.step1Complete }]}\n      />\n      <Field.Checkbox\n        path='step2Complete'\n        label='✅ Final decision made'\n      />\n    </View.Flex>\n  </View.Collapsible>\n</View.Flex>",
  "data": "{\n  \"reviewerName\": \"\",\n  \"step1Complete\": false,\n  \"finalDecision\": \"\",\n  \"step2Complete\": false\n}",
  "preprocess": "let errors = [];\nif (!data.reviewerName?.trim()) errors.push('Reviewer name required');\nif (data.step1Complete && !data.finalDecision) errors.push('Final decision required');\nreturn { ...data, errors };",
  "constants": "{\n  \"decisionOptions\": [\n    { \"value\": \"accept\", \"label\": \"✅ Accept\" },\n    { \"value\": \"reject\", \"label\": \"❌ Reject\" },\n    { \"value\": \"rewrite\", \"label\": \"🔄 Rewrite\" }\n  ]\n}"
}
```

**Component Definitions:**

```ts
// Status and metadata display with theme support
readonly Labels: React.FC<{
  labels: {
    title: string;
    value?: string | number | null | undefined;
    theme?: "default" | "alert" | "success" | undefined;
  }[];
}>;

// Progressive disclosure for multi-step workflows
readonly Collapsible: React.FC<{
  title?: React.ReactNode;
  disabled?: boolean | undefined;
  defaultOpen?: boolean | undefined;
  children: React.ReactNode;
}>;
```

**How this demonstrates advanced patterns:**
- View.Labels shows dynamic progress with theme-based visual feedback
- View.Collapsible implements progressive disclosure with `defaultOpen` and `disabled` logic
- Constants use emoji conventions for universal visual language
- Preprocess function includes comprehensive validation logic
- All 4 JSON fields properly structured with realistic data flow

### Best Practices Summary

#### Core Principles

1. **🚨 ALWAYS use View.Flex when you have multiple components**  
   Prevents components from sticking together and looking cramped

2. **📦 Structure with containers**  
   Use `View.Flex` with `vertical={true}` as main containers

3. **⚠️ CRITICAL: Flex inside Card/Collapsible**  
   When `View.Card` or `View.Collapsible` contains multiple components, wrap them in `View.Flex` with any gap

4. **🧹 Remove redundant Cards inside Collapsible**  
   Use `View.Flex` directly inside `View.Collapsible`, skip unnecessary `View.Card` wrapper

5. **📋 MANDATORY: Use standard verdict values for all QA steps**  
   Always use `"accept"`, `"rewrite"`, `"reject"` for any quality assessment decisions

#### Content Organization

5. **🗂️ Group related content**  
   Use `View.Card` to visually group form fields

6. **📝 Use inline options for simple cases**  
   No need for constants for basic dropdown/radio options

7. **📋 Add placeholders and validation**  
   Help users understand what's expected

#### UX Enhancement

8. **🔄 Progressive disclosure**  
   Use conditional rendering `{data.field && (...)}` to show/hide content

9. **🎨 Consistent visual hierarchy**  
   Use emojis and clear labels for better UX

10. **✨ Keep it simple**  
    Don't over-engineer basic forms with unnecessary complexity

**❌ Bad Example - Multiple components stick together:**
```jsx
<View.Card flat={true} title="User Info">
  <Field.Text path="name" label="Name" />        {/* No spacing! */}
  <Field.Text path="email" label="Email" />      {/* Sticks to above */}
  <Field.Checkbox path="agree" label="I agree" /> {/* Looks cramped */}
</View.Card>
```

**✅ Good Example - Use Flex to separate components:**
```jsx
<View.Card flat={true} title="User Info">
  <View.Flex vertical={true} gap={'1.25rem'}>     {/* Prevents sticking! */}
    <Field.Text path="name" label="Name" />
    <Field.Text path="email" label="Email" />
    <Field.Checkbox path="agree" label="I agree" />
  </View.Flex>
</View.Card>
```

**❌ Bad Example - Redundant Card inside Collapsible:**
```jsx
<View.Collapsible title="Step 1">
  <View.Card flat={true}>              {/* Unnecessary wrapper! */}
    <View.Flex vertical={true} gap={'1.25rem'}>
      <Field.Text path="name" />
      <Field.Checkbox path="done" />
    </View.Flex>
  </View.Card>
</View.Collapsible>
```

**✅ Good Example - Clean Flex directly in Collapsible:**
```jsx
<View.Collapsible title="Step 1">
  <View.Flex vertical={true} gap={'1.25rem'}>  {/* Direct, clean! */}
    <Field.Text path="name" />
    <Field.Checkbox path="done" />
  </View.Flex>
</View.Collapsible>
```

**The core principle: Multiple components → Use View.Flex with gap → Professional appearance**

---

## Advanced Example Breakdown: Content Review Pipeline

This section provides a complete step-by-step breakdown of how the advanced example interface (`src/interfaces/examples/advanced_example_interface.json`) was built, explaining the architecture, logic, and component connections.

### Overview: What This Interface Does

The Content Review Pipeline is a sophisticated writer-editor collaborative workflow that implements:

- **Dual-role system** - Writers submit/revise content, editors review and decide
- **Multi-round revision process** - Supports iterative improvement cycles
- **Progressive disclosure** - Steps unlock based on completion status
- **Comprehensive validation** - Field-level and cross-field validation logic
- **Dynamic state management** - Interface adapts based on user role and progress

### Architecture Principles

#### 1. **Layout Strategy: Sticky Header + Scrollable Content**

```jsx
<Layout.StickyHeader
  header={/* Fixed header with project info */}
>
  <View.Flex vertical={true} gap={'1.5rem'}>
    {/* Main content steps */}
  </View.Flex>
</Layout.StickyHeader>
```

**Why this works:**
- **Fixed context** - Project metadata always visible during long forms
- **Clean separation** - Header for meta-info, body for workflow steps
- **Responsive design** - Content scrolls while header stays accessible

#### 2. **Role-Based Conditional Rendering**

```jsx
{data.currentUserRole === 'writer' ? (
  // Writer-specific interface
) : (
  // Editor-specific interface
)}
```

**Logic pattern:**
- **Single interface, dual modes** - Reduces complexity vs separate interfaces
- **Conditional displays** - Same data, different interaction patterns
- **State preservation** - Role switching maintains progress

#### 3. **Progressive Step Disclosure**

```jsx
<View.Collapsible
  title="Step 2: Editorial Review"
  disabled={!data.stepStatus?.step1Complete}
  defaultOpen={data.step1Complete && !data.step2Complete}
>
```

**Smart opening logic:**
- **Disabled until ready** - Prevents premature step access
- **Auto-open when appropriate** - Opens next step when previous is complete
- **Focus management** - Guides user attention to current task

### Component Connection Patterns

#### 1. **Header Information Architecture**

The header uses a sophisticated metadata display pattern:

```jsx
<View.Flex justify="space-between" align="middle">
  <View.Flex vertical={true} gap={'0.5rem'}>
    {/* Title and description */}
  </View.Flex>
  <View.Labels
    labels={[
      {
        title: 'Current Role:',
        value: data.currentUserRole === 'writer' ? 'Writer' : 'Editor',
        theme: data.currentUserRole === 'writer' ? 'default' : 'alert'
      }
    ]}
  />
</View.Flex>
```

**Connection patterns:**
- **Space-between layout** - Title left, metadata right
- **Dynamic themes** - Visual indicators based on role/state
- **Contextual information** - Project details accessible but not intrusive

#### 2. **Feedback Display Logic**

Previous editor feedback is conditionally displayed with rich formatting:

```jsx
{data.previousEditorFeedback && data.currentRound > 1 && (
  <View.Card flat={true} variant="warning">
    <View.Flex vertical={true} gap={'1rem'}>
      <View.Labels labels={[/* Assessment summary */]} />
      <View.Markdown content={data.previousEditorFeedback.feedback} />
      {/* Action items mapping */}
    </View.Flex>
  </View.Card>
)}
```

**Connection strategy:**
- **Conditional visibility** - Only shows when relevant (revision rounds)
- **Structured display** - Labels for quick scanning, Markdown for details
- **Action items** - Specific tasks with clear formatting

#### 3. **Role-Specific Content Editing**

Writers get interactive editors, editors get read-only displays:

```jsx
// Writer mode - Interactive editing
<Field.AiEditor
  path="content.body"
  validation={[{ required: true }]}
  aiChecks={{
    wordCount: { min: 100, max: 5000 },
    grammarScore: { minScore: 4 }
  }}
/>

// Editor mode - Read-only display
<View.Card flat={true} variant="info">
  <View.Labels labels={[/* Content metadata */]} />
  <View.Markdown content={data.contentText} />
</View.Card>
```

**Data flow:**
1. **Writer input** → AiEditor field with validation
2. **Data processing** → Preprocess extracts and formats content
3. **Editor display** → Processed data shown as read-only Markdown

### Validation Architecture

#### 1. **Multi-Level Validation System**

The preprocess function implements sophisticated validation:

```javascript
// Field-level validation
const requiredFields = [
  {
    path: 'content.title',
    name: 'Content Title',
    step: 1,
    stepName: 'Step 1: Content Submission'
  }
];

// Cross-field validation
if (data.final_decision?.verdict === 'rewrite') {
  editorFields.push({
    path: 'final_decision.revision_priority',
    name: 'Revision Priority'
  });
}
```

**Validation layers:**
- **Required field tracking** - Dynamic list based on role and state
- **Conditional requirements** - Fields required only in specific scenarios
- **Step-based organization** - Missing fields grouped by workflow step

#### 2. **Dynamic State Calculation**

```javascript
// Progress calculation
pipelineData.validation.completionPercentage = 
  Math.round((completedFields / totalRequiredFields) * 100);

// Submission readiness
pipelineData.readyForSubmission = 
  pipelineData.validation.missingFields.length === 0;
```

**State management:**
- **Real-time progress** - Automatically updates as fields complete
- **Submission gates** - Prevents incomplete submissions
- **Visual feedback** - Progress indicators and status displays

### Step-by-Step Component Connections

#### Step 1: Content Submission
```
Writer Flow:
1. Field.Text (title) → data.content.title
2. Field.Select (type) → data.content.type  
3. Field.AiEditor (body) → data.content.body
4. Field.Textarea (notes) → data.writer_notes
5. Field.Checkbox (complete) → data.stepStatus.step1Complete

Editor Flow:
1. Read data.contentText (processed from AiEditor)
2. Display via View.Markdown
3. Show metadata via View.Labels
4. Context from data.writerNotes
```

#### Step 2: Editorial Review (Editor Only)
```
Assessment Flow:
1. Field.RadioGroup (overall_assessment) → data.evaluation.overall_assessment
2. Multiple Field.RadioGroup (quality ratings) → data.evaluation.*
3. Field.Textarea (feedback) → data.evaluation.detailed_feedback
4. Field.List (action items) → data.evaluation.action_items[]
5. Field.Checkbox (complete) → data.stepStatus.step2Complete

Validation Triggers:
- Step 2 disabled until step1Complete
- All evaluation fields required for completion
```

#### Step 3: Final Decision (Editor Only)
```
Decision Flow:
1. View.Labels (summary of step 2) ← data.evaluation.*
2. Field.RadioGroup (verdict) → data.final_decision.verdict
3. Conditional Field.RadioGroup (priority) → data.final_decision.revision_priority
4. Field.Textarea (comments) → data.final_decision.additional_comments
5. Field.Checkbox (confirm) → data.stepStatus.step3Complete

State Logic:
- Disabled until step2Complete
- Priority field appears only if verdict === 'rewrite'
- Auto-opens when step 2 is complete
```

### Data Processing Pipeline

#### 1. **Content Extraction Logic**

```javascript
function extractAiEditorContent(aiEditorValue) {
  if (typeof aiEditorValue === 'object' && aiEditorValue.content) {
    return aiEditorValue.content; // Extract from AiEditor format
  }
  return String(aiEditorValue || ''); // Fallback for strings
}
```

**Processing steps:**
1. **AiEditor input** - Complex object with metadata
2. **Content extraction** - Get actual text content
3. **Word counting** - Calculate statistics for display
4. **Validation** - Check minimum/maximum lengths

#### 2. **Role-Based Data Flow**

```javascript
// Writer role requirements
if (pipelineData.currentUserRole === 'writer') {
  requiredFields.push({
    path: 'content.body',
    minLength: 100 // Enforce content minimum
  });
}

// Editor role requirements  
if (pipelineData.currentUserRole === 'editor') {
  requiredFields.push({
    path: 'evaluation.detailed_feedback',
    minLength: 50 // Enforce feedback quality
  });
}
```

**Role-specific validation:**
- **Writer focus** - Content creation and revision response
- **Editor focus** - Assessment and feedback quality
- **Dynamic requirements** - Field validation adapts to user role

### Key Architectural Decisions

#### 1. **Single Interface vs Separate Interfaces**

**Chosen approach:** Single interface with conditional rendering

**Benefits:**
- **Shared state** - Both roles see same data, different interactions
- **Easier maintenance** - One interface definition to update
- **Better UX** - Context preservation during role switches

#### 2. **Validation Strategy**

**Chosen approach:** Comprehensive preprocess validation with UI feedback

**Benefits:**
- **Real-time feedback** - Users see progress and missing fields
- **Step-based guidance** - Clear indication of what needs attention
- **Flexible requirements** - Validation adapts to workflow state

#### 3. **Content Storage Format**

**Chosen approach:** Extract and store content separately for editor view

**Benefits:**
- **Clean separation** - Editor sees processed content, not raw editor state
- **Performance** - Avoid re-processing AiEditor content on every render
- **Flexibility** - Content can be manipulated independently of editor state

### Learning Points for Interface Building

#### 1. **Plan for Multiple User Types**
- Design role-based interfaces from the start
- Use conditional rendering rather than separate interfaces
- Maintain shared state for consistency

#### 2. **Implement Progressive Disclosure**
- Use View.Collapsible with smart opening logic
- Disable steps until prerequisites are met
- Provide clear progress indicators

#### 3. **Build Comprehensive Validation**
- Define validation rules dynamically based on state
- Group missing fields by workflow step
- Provide clear, actionable error messages

#### 4. **Handle Complex Data Flows**
- Process complex field outputs (like AiEditor) in preprocess
- Extract and transform data for different display modes
- Maintain data integrity across workflow steps

This advanced example demonstrates how to build sophisticated, multi-user workflow interfaces while maintaining clean code organization and excellent user experience patterns.

