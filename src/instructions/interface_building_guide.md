# Complete Interface Building Guide

A step-by-step guide to building effective labeling task interfaces using the available components from `elements.d.ts`.

## Table of Contents

1. [Getting Started](#getting-started) - Introduction and JSX basics
2. [Foundation Components](#foundation-components) - Essential building blocks
3. [Building Your First Interface](#building-your-first-interface) - Simple practical example
4. [Enhanced Components](#enhanced-components) - Advanced input and display
5. [Multi-Step Workflows](#multi-step-workflows) - Complex interface patterns
6. [AI Integration](#ai-integration) - Working with AI-powered components
7. [Quality Assurance](#quality-assurance) - Validation and error handling
8. [Complete Examples](#complete-examples) - Real-world interface patterns
9. [Troubleshooting](#troubleshooting) - Common issues and solutions

---

## Getting Started

**What you'll learn:** Basic concepts of interface components, JSX syntax, and how components work together to create user interfaces.

### Understanding Components

Components are like building blocks for interfaces. Think of them as pre-built pieces you can combine to create complete interfaces:

- **Field components** (`Field.Text`, `Field.RadioGroup`) - Let users input data
- **View components** (`View.Card`, `View.Flex`) - Display content and organize layout
- **Layout components** - Structure and arrange other components

### JSX Basics for Interface Building

JSX is the syntax used to write components. Here are the essential concepts:

#### 1. Component Structure
```jsx
<ComponentName
  property="value"
  anotherProperty={dynamicValue}
>
  Content goes here
</ComponentName>
```

#### 2. Properties (Props)
Properties customize how components behave:
```jsx
<Field.Text
  path="user_name"           // Where to store the data
  label="Your Name"          // What the user sees
  placeholder="Enter name"   // Helpful hint
  validation={[{ required: true }]}  // Rules for the input
/>
```

#### 3. Nesting Components
Components can contain other components:
```jsx
<View.Card title="User Information">
  <Field.Text path="name" label="Name" />
  <Field.Text path="email" label="Email" />
</View.Card>
```

#### 4. Dynamic Content
Use `{}` for dynamic values:
```jsx
<View.Text>{actions.get('user_name', 'Unknown User')}</View.Text>
```

---

## Foundation Components

**What you'll learn:** The most essential components for building any interface - layout, content grouping, basic inputs, and information display.

### Layout Components (Your Structure)

#### `View.Flex` - The Universal Container
**Purpose:** Arrange components in rows or columns with consistent spacing.

**Basic Usage:**
```jsx
<View.Flex vertical={true} gap={'1rem'}>
  <ComponentA />
  <ComponentB />
  <ComponentC />
</View.Flex>
```

**Key Properties:**
- `vertical={true}` - Stack items vertically (most common)
- `vertical={false}` - Arrange items horizontally  
- `gap={'1rem'}` - Space between items
- `align={'middle'}` - Vertical alignment
- `justify={'space-between'}` - Horizontal distribution

**When to Use:** This is your go-to container for almost everything. Use it as the main wrapper for your interface and for organizing related components.

#### `View.Card` - Content Grouping
**Purpose:** Group related content with visual boundaries and optional titles.

**Basic Usage:**
```jsx
<View.Card title="Section Title">
  <Field.Text path="input1" label="First Input" />
  <Field.Text path="input2" label="Second Input" />
</View.Card>
```

**Key Properties:**
- `title="Text"` - Header for the card
- `flat={true}` - Subtle styling without heavy borders
- `description="Text"` - Subtitle or explanation
- `variant="warning"` - Color theme (warning, error, success)

**When to Use:** Group related form fields, display sections of content, or create visual separation between different parts of your interface.

### Information Display Components

#### `View.Labels` - Status and Metadata
**Purpose:** Display key information like task status, metadata, or statistics.

**Basic Usage:**
```jsx
<View.Labels
  labels={[
    { title: 'Status:', value: 'In Progress', theme: 'default' },
    { title: 'Priority:', value: 'High', theme: 'warning' },
    { title: 'Completed:', value: '3/5', theme: 'success' }
  ]}
/>
```

**Key Properties:**
- `title` - Label text
- `value` - The displayed value
- `theme` - Color coding ('success', 'warning', 'error', 'default')

**When to Use:** Show task metadata, progress indicators, status information, or any key-value pairs that users need to see at a glance.

#### `View.Alert` - Important Messages
**Purpose:** Display important instructions, warnings, or status messages.

**Basic Usage:**
```jsx
<View.Alert
  variant="info"
  title="Important Notice"
  description="Please read the guidelines before starting this task."
/>
```

**Key Properties:**
- `variant` - Type of alert ('info', 'warning', 'error', 'success')
- `title` - Main message
- `description` - Additional details

**When to Use:** Provide instructions, highlight important information, show error messages, or communicate status changes.

### Basic Input Components

#### `Field.Text` - Simple Text Input
**Purpose:** Collect short text responses like names, titles, or identifiers.

**Basic Usage:**
```jsx
<Field.Text
  path="response_title"
  label="Response Title"
  placeholder="Enter a brief title..."
  validation={[{ required: true, max: 100 }]}
/>
```

**Key Properties:**
- `path` - Where the data is stored (must be unique)
- `label` - Text shown above the input
- `placeholder` - Hint text inside the input
- `validation` - Rules for the input (required, length limits, etc.)

#### `Field.Textarea` - Multi-Line Text
**Purpose:** Collect longer text responses like feedback, explanations, or detailed answers.

**Basic Usage:**
```jsx
<Field.Textarea
  path="detailed_feedback"
  label="Provide detailed feedback"
  placeholder="Explain your evaluation in detail..."
  rows={4}
  validation={[{ required: true, min: 20 }]}
/>
```

**Key Properties:**
- `rows` - Height of the text area
- `min/max` in validation - Character limits

#### `Field.RadioGroup` - Single Choice Selection
**Purpose:** Let users choose one option from a list (most common for evaluations).

**Basic Usage:**
```jsx
<Field.RadioGroup
  path="quality_rating"
  label="Rate the quality"
  options={[
    { value: 'excellent', label: '⭐ Excellent - Exceeds expectations' },
    { value: 'good', label: '✅ Good - Meets expectations' },
    { value: 'poor', label: '❌ Poor - Below expectations' }
  ]}
  validation={[{ required: true }]}
/>
```

**Key Properties:**
- `options` - Array of choices with `value` and `label`
- Always include `validation={[{ required: true }]}` for evaluations

#### `Field.Checkbox` - Yes/No Decisions
**Purpose:** Binary decisions, confirmations, or feature toggles.

**Basic Usage:**
```jsx
<Field.Checkbox
  path="final_approval"
  label="✅ I approve this content for use"
  validation={[{ required: true }]}
/>
```

**When to Use:** Final confirmations, yes/no questions, or optional features.

---

## Building Your First Interface

**What you'll learn:** How to combine foundation components to create a complete, functional interface for a simple content evaluation task.

### Step 1: Plan Your Interface Structure

Before writing code, plan what your interface needs:
1. **Header** - Task title and context
2. **Content Display** - What users need to evaluate
3. **Evaluation** - How users provide their assessment
4. **Confirmation** - Final approval step

### Step 2: Create the Basic Structure

Start with a `View.Flex` container to organize everything vertically:

```jsx
<View.Flex vertical={true} gap={'1.5rem'}>
  {/* All your interface components go here */}
</View.Flex>
```

### Step 3: Add Header Information

```jsx
<View.Flex vertical={true} gap={'1.5rem'}>
  {/* Header */}
  <View.Flex justify="space-between" align="middle">
    <View.Text variant="h2">Content Quality Review</View.Text>
    <View.Link url="https://guidelines.example.com" validation={{ opened: true }}>
      📋 Review Guidelines
    </View.Link>
  </View.Flex>

  {/* Task Information */}
  <View.Card flat={true}>
    <View.Labels
      labels={[
        { title: 'Domain:', value: 'Technology' },
        { title: 'Language:', value: 'English' },
        { title: 'Task ID:', value: 'EVAL-001' }
      ]}
    />
  </View.Card>
</View.Flex>
```

### Step 4: Display Content to Evaluate

```jsx
{/* Content to Review */}
<View.Card title="Content to Review">
  <View.Markdown content="This is the content that needs to be evaluated for quality and accuracy." />
</View.Card>
```

### Step 5: Add Evaluation Components

```jsx
{/* Evaluation Section */}
<View.Card title="Your Evaluation">
  <View.Flex vertical={true} gap={'1rem'}>
    {/* Quality Rating */}
    <Field.RadioGroup
      path="quality_rating"
      label="Overall Quality"
      options={[
        { value: 'excellent', label: '⭐ Excellent - High quality content' },
        { value: 'good', label: '✅ Good - Acceptable quality' },
        { value: 'poor', label: '❌ Poor - Needs improvement' }
      ]}
      validation={[{ required: true }]}
    />
    
    {/* Detailed Feedback */}
    <Field.Textarea
      path="feedback"
      label="Detailed Feedback"
      placeholder="Explain your rating and provide specific suggestions..."
      rows={4}
      validation={[{ required: true, min: 20 }]}
    />
    
    {/* Final Approval */}
    <Field.Checkbox
      path="approved"
      label="✅ I approve this content"
      validation={[{ required: true }]}
    />
  </View.Flex>
</View.Card>
```

### Step 6: Complete First Interface

Here's your complete first interface:

```jsx
<View.Flex vertical={true} gap={'1.5rem'}>
  {/* Header */}
  <View.Flex justify="space-between" align="middle">
    <View.Text variant="h2">Content Quality Review</View.Text>
    <View.Link url="https://guidelines.example.com" validation={{ opened: true }}>
      📋 Review Guidelines
    </View.Link>
  </View.Flex>

  {/* Task Information */}
  <View.Card flat={true}>
    <View.Labels
      labels={[
        { title: 'Domain:', value: 'Technology' },
        { title: 'Language:', value: 'English' },
        { title: 'Task ID:', value: 'EVAL-001' }
      ]}
    />
  </View.Card>

  {/* Content to Review */}
  <View.Card title="Content to Review">
    <View.Markdown content="This is the content that needs to be evaluated for quality and accuracy." />
  </View.Card>

  {/* Evaluation Section */}
  <View.Card title="Your Evaluation">
    <View.Flex vertical={true} gap={'1rem'}>
      <Field.RadioGroup
        path="quality_rating"
        label="Overall Quality"
        options={[
          { value: 'excellent', label: '⭐ Excellent - High quality content' },
          { value: 'good', label: '✅ Good - Acceptable quality' },
          { value: 'poor', label: '❌ Poor - Needs improvement' }
        ]}
        validation={[{ required: true }]}
      />
      
      <Field.Textarea
        path="feedback"
        label="Detailed Feedback"
        placeholder="Explain your rating and provide specific suggestions..."
        rows={4}
        validation={[{ required: true, min: 20 }]}
      />
      
      <Field.Checkbox
        path="approved"
        label="✅ I approve this content"
        validation={[{ required: true }]}
      />
    </View.Flex>
  </View.Card>
</View.Flex>
```

### What You've Built

This interface includes:
- **Clear structure** with consistent spacing
- **Essential information** display
- **User input collection** with validation
- **Visual organization** using cards and flexbox
- **Professional appearance** with proper labeling

---

## Enhanced Components

**What you'll learn:** More sophisticated components for advanced input, content display, and interface organization.

### Advanced Input Components

#### `Field.AiEditor` - Rich Content Creation
**Purpose:** Advanced text editor with AI-powered quality checks and rich formatting.

**Basic Usage:**
```jsx
<Field.AiEditor
  path="content"
  label="Write your response"
  height={400}
  aiChecks={{
    wordCount: { enabled: true, validate: true, min: 100, max: 500 },
    grammarScore: { enabled: true, validate: true, minScore: 4 }
  }}
  validation={[{ required: true }]}
/>
```

**Key Properties:**
- `height` - Editor height in pixels
- `aiChecks` - Automatic quality validation
- `defaultMode` - 'markdown' or 'rich-text'

**When to Use:** When users need to create longer, formatted content with quality requirements.

#### `Field.Select` - Dropdown Choices
**Purpose:** Choose from many options in a compact dropdown menu.

**Basic Usage:**
```jsx
<Field.Select
  path="category"
  label="Content Category"
  options={[
    { value: 'technical', label: 'Technical Documentation' },
    { value: 'creative', label: 'Creative Writing' },
    { value: 'academic', label: 'Academic Content' }
  ]}
  validation={[{ required: true }]}
/>
```

#### `Field.MultiSelect` - Multiple Choices
**Purpose:** Select multiple options from a list.

**Basic Usage:**
```jsx
<Field.MultiSelect
  path="issues_found"
  label="Issues Found (select all that apply)"
  options={[
    { value: 'grammar', label: 'Grammar errors' },
    { value: 'accuracy', label: 'Factual inaccuracies' },
    { value: 'clarity', label: 'Unclear explanations' }
  ]}
/>
```

### Content Display Components

#### `View.Markdown` - Formatted Text Display
**Purpose:** Display formatted text with headers, lists, links, and other rich content.

**Basic Usage:**
```jsx
<View.Markdown
  content={`
# Instructions

Please review the content below and provide:

1. Overall quality rating
2. Specific feedback
3. Final approval decision

**Important:** Read the guidelines before starting.
  `}
/>
```

#### `View.Text` - Styled Text Elements
**Purpose:** Display text with specific styling for headers, paragraphs, etc.

**Basic Usage:**
```jsx
<View.Text variant="h3">Section Title</View.Text>
<View.Text variant="p">Regular paragraph text</View.Text>
<View.Text variant="small" color="secondary">Helper text</View.Text>
```

### Organization Components

#### `View.Tabs` - Tabbed Content
**Purpose:** Organize different types of content in tabs.

**Basic Usage:**
```jsx
<View.Tabs
  defaultTab="current"
  tabs={[
    {
      value: 'current',
      label: '📊 Current Task',
      content: (
        <View.Card>
          <Field.Text path="current_input" label="Current Response" />
        </View.Card>
      )
    },
    {
      value: 'history',
      label: '📈 Previous Responses',
      content: (
        <View.Card>
          <View.Text>Previous response history would go here</View.Text>
        </View.Card>
      )
    }
  ]}
/>
```

#### `View.Divider` - Visual Separation
**Purpose:** Add visual breaks between sections.

**Basic Usage:**
```jsx
<View.Flex vertical={true} gap={'1rem'}>
  <SectionA />
  <View.Divider />
  <SectionB />
</View.Flex>
```

---

*[Continue reading the next sections for Multi-Step Workflows, AI Integration, Quality Assurance, Complete Examples, and Troubleshooting...]* 