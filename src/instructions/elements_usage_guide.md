# Elements Usage Guide

This guide provides a beginner-friendly overview of the components available in `elements.d.ts` and how they're used in practice for creating labeling task interfaces.

## Table of Contents

1. [Component Categories](#component-categories)
2. [Header & Task Metadata Components](#header--task-metadata-components)
3. [Text Input & Writing Components](#text-input--writing-components)
4. [Evaluation & Feedback Components](#evaluation--feedback-components)
5. [Layout & Organization Components](#layout--organization-components)
6. [AI Integration Components](#ai-integration-components)
7. [Media & Document Components](#media--document-components)
8. [Best Practices Examples](#best-practices-examples)

---

## Component Categories

Based on analysis of real interface examples, components fall into these main categories:

### 🏷️ Header & Task Metadata Components
Components that display task information, guidelines, and navigation aids.

### ✍️ Text Input & Writing Components
Components for capturing user text input, from simple fields to advanced editors.

### ⭐ Evaluation & Feedback Components
Components for rating, scoring, and providing feedback on content.

### 🎛️ Layout & Organization Components
Components that structure and organize interface elements.

### 🤖 AI Integration Components
Components that leverage AI services for automation and assistance.

### 📱 Media & Document Components
Components for displaying and working with media files and documents.

---

## Header & Task Metadata Components

These components help users understand their task context and access guidelines.

### Key Components:
- **`View.Labels`** - Display metadata like task ID, domain, phase
- **`View.Link`** - Links to guidelines and external resources
- **`View.Text`** - Task titles and descriptions
- **`View.Alert`** - Important notices and status messages

### Usage Example:
```jsx
{/* Task header with metadata */}
<View.Flex vertical={false} gap={'1.25rem'} align={'middle'}>
  <View.Text>{'Some SFTish Rubric Evaluation Pipeline Interface'}</View.Text>
  <View.Link url={''} validation={{ opened: true }}>
    {'Guideline link 1'}
  </View.Link>
  <View.Link url={''} validation={{ opened: true }}>
    {'Guideline link 2'}
  </View.Link>
</View.Flex>

{/* Task metadata display */}
<View.Labels
  labels={[
    { title: 'Phase:', value: actions.get('taskmeta.phase'), theme: 'success' },
    { title: 'Language:', value: actions.get('taskmeta.language'), theme: 'default' },
    { title: 'Domain:', value: actions.get('taskmeta.domain'), theme: 'default' },
  ]}
/>
```

### What This Does:
- **View.Text**: Shows the main task title
- **View.Link**: Provides clickable links to guidelines (opens in new tab)
- **View.Labels**: Displays key task information in a clean, organized format with color coding

---

## Text Input & Writing Components

These components capture user input ranging from simple text to complex AI-assisted writing.

### Key Components:
- **`Field.AiEditor`** - Advanced rich text editor with AI analysis features
- **`Field.Textarea`** - Multi-line text input for longer responses
- **`Field.Text`** - Single-line text input for short responses

### Usage Examples:

#### Advanced AI-Powered Editor
```jsx
<Field.AiEditor
  path="content.text"
  label="Generated Response"
  height={400}
  aiChecks={{
    wordCount: { enabled: true, validate: true, min: 50, max: 500 },
    grammarScore: { enabled: true, validate: true, minScore: 4 },
    facts: { enabled: true, sourceTexts: ["Source text 1", "Source text 2"] }
  }}
  validation={[{ required: true }]}
/>
```

#### Simple Text Areas
```jsx
<Field.Textarea
  path="rubric.feedback"
  label="Detailed Feedback"
  placeholder="Explain your evaluation..."
  rows={4}
  validation={[{ required: true, min: 20 }]}
/>

<Field.Text
  path="content.title"
  label="Response Title"
  placeholder="Brief title..."
  validation={[{ required: true, max: 100 }]}
/>
```

### What These Do:
- **Field.AiEditor**: Rich text editor that can check grammar, count words, validate facts, and more
- **Field.Textarea**: Multi-line text box for longer responses like feedback or explanations
- **Field.Text**: Single-line input for short text like titles or IDs

---

## Evaluation & Feedback Components

These components help users rate, score, and provide structured feedback.

### Key Components:
- **`Field.RadioGroup`** - Single-choice selections (pass/fail, quality ratings)
- **`Field.Checkbox`** - Binary yes/no decisions
- **`Field.Select`** - Dropdown selections from predefined options
- **`Field.MultiSelect`** - Multiple choice selections
- **`Field.ToggleGroup`** - Visual toggle buttons

### Usage Examples:

#### Quality Evaluation
```jsx
<Field.RadioGroup
  path="rubric.clarity"
  label="Clarity (1-4 scale)"
  options={[
    { value: 'poor', label: '1 - Poor' },
    { value: 'fair', label: '2 - Fair' },
    { value: 'good', label: '3 - Good' },
    { value: 'excellent', label: '4 - Excellent' }
  ]}
  validation={[{ required: true }]}
/>
```

#### Pass/Fail Evaluation
```jsx
<Field.RadioGroup
  path="general_rubrics_evaluation"
  label="Evaluation"
  options={[
    { value: 'pass', label: '✅ Pass - Meets criteria' },
    { value: 'fail', label: '❌ Fail - Does not meet criteria' }
  ]}
  validation={[{ required: true }]}
/>
```

#### Final Approval
```jsx
<Field.Checkbox
  path="is_passed"
  label="✅ Final QA Approval - Ready for training data"
  validation={[{ required: true }]}
/>
```

### What These Do:
- **Field.RadioGroup**: Forces users to pick one option from a list (good for ratings)
- **Field.Checkbox**: Simple yes/no decisions (like final approval)
- **Field.Select**: Dropdown menus for choosing from many options
- **Field.MultiSelect**: Allows selecting multiple items (like tagging issues)

---

## Layout & Organization Components

These components structure the interface and organize content into logical sections.

### Key Components:
- **`View.Flex`** - Flexible layout container (horizontal/vertical arrangement)
- **`View.Card`** - Content containers with optional titles and borders
- **`View.Collapsible`** - Expandable/collapsible sections
- **`View.Tabs`** - Tabbed content organization
- **`View.Divider`** - Visual separators

### Usage Examples:

#### Organized Sections
```jsx
<View.Collapsible title="Step 1: General Rubrics" defaultOpen={true}>
  <View.Card flat={true}>
    <View.Alert
      variant="warning"
      title="General Quality Standards"
      description="These rubrics apply to all content regardless of domain or task type."
    />
    <View.Flex vertical={true} gap={'2rem'}>
      {/* Content goes here */}
    </View.Flex>
  </View.Card>
</View.Collapsible>
```

#### Tabbed Interface
```jsx
<View.Tabs
  tabs={[
    {
      value: 'Checkbox',
      content: (
        <View.Flex vertical={true} gap={'1.25rem'}>
          {/* Checkbox content */}
        </View.Flex>
      )
    },
    {
      value: 'Text',
      content: (
        <Field.Text path="text" label="Text label" />
      )
    }
  ]}
/>
```

### What These Do:
- **View.Flex**: Arranges items horizontally or vertically with spacing
- **View.Card**: Groups related content in visual containers
- **View.Collapsible**: Lets users expand/collapse sections to focus on relevant content
- **View.Tabs**: Organizes different types of content in tabs
- **View.Divider**: Adds visual separation between sections

---

## AI Integration Components

These components connect to AI services for automated processing and assistance.

### Key Components:
- **`Field.MlEndpoint`** - Single AI service call
- **`Field.MlEndpointMultiple`** - Multiple AI service calls
- **`actions.llm`** - Direct language model calls

### Usage Examples:

#### Automated Rubric Generation
```jsx
<Field.MlEndpoint
  path="generated_rubrics"
  label="Generate Contextual Rubrics"
  endpoint="flo-rubric-generation"
  data={{
    context: data.context_input.context_plain,
    prompt: data.defaults.prompt,
    response: data.defaults.completion,
    language: data.taskmeta.language,
  }}
/>
```

#### Multiple AI Analysis
```jsx
<Field.MlEndpointMultiple
  path="claude_response"
  label="⭐️ Generate 4 answers for the prompt ⭐️"
  requests={[0, 1, 2, 3].map(() => ({
    endpoint: 'anthropic-rubric-response-autoeval-pipeline-v3',
    function: 'precise_rubric_response_generation',
    data: () => ({
      prompt: actions.get('prompt.content'),
      max_tokens: 8096,
    }),
  }))}
/>
```

### What These Do:
- **Field.MlEndpoint**: Calls one AI service and displays the result
- **Field.MlEndpointMultiple**: Calls multiple AI services (like generating several responses)
- **actions.llm**: Direct integration with language models for custom processing

---

## Media & Document Components

These components handle files, images, videos, and documents.

### Key Components:
- **`View.Pdf`** - PDF document viewer
- **`View.Image`** - Image display
- **`View.Video`** - Video player
- **`Field.FileUpload`** - File upload interface
- **`View.Markdown`** - Formatted text display

### Usage Examples:

#### Document Display
```jsx
<View.Pdf
  url={actions.get('project_quality.report_url')}
  height={600}
/>
```

#### Content Display
```jsx
<View.Markdown
  content={`**Context Plain:**

${data.context_input.context_plain}

---

**Context Markdown:**

${data.context_input.context_markdown}`}
/>
```

#### File Upload
```jsx
<Field.FileUpload
  path="supporting.files"
  label="Upload Documents"
  multiple={true}
  accept={['.pdf', '.txt', '.docx']}
  validation={[{ type: 'array', max: 5 }]}
/>
```

### What These Do:
- **View.Pdf**: Shows PDF files directly in the interface
- **View.Image**: Displays images with optional preview
- **View.Video**: Embeds video players with tracking capabilities
- **Field.FileUpload**: Lets users upload files with restrictions
- **View.Markdown**: Renders formatted text with headers, lists, etc.

---

## Best Practices Examples

Here are step-by-step examples showing how to build effective interfaces:

### Example 1: Simple Content Evaluation Interface

```jsx
<View.Flex vertical={true} gap={'1.5rem'}>
  {/* Header */}
  <View.Text variant="h2">Content Quality Review</View.Text>
  
  {/* Task Information */}
  <View.Card description="Task metadata">
    <View.Labels
      labels={[
        { title: 'Domain:', value: actions.get('domain'), theme: 'default' },
        { title: 'Language:', value: actions.get('language'), theme: 'success' }
      ]}
    />
  </View.Card>

  {/* Content to Review */}
  <View.Collapsible title="Content to Review" defaultOpen={true}>
    <View.Markdown content={data.content_to_review} />
  </View.Collapsible>

  {/* Evaluation */}
  <View.Card title="Your Evaluation">
    <View.Flex vertical={true} gap={'1rem'}>
      <Field.RadioGroup
        path="quality_rating"
        label="Overall Quality"
        options={[
          { value: 'poor', label: 'Poor - Major issues' },
          { value: 'fair', label: 'Fair - Some issues' },
          { value: 'good', label: 'Good - Minor issues' },
          { value: 'excellent', label: 'Excellent - No issues' }
        ]}
        validation={[{ required: true }]}
      />
      
      <Field.Textarea
        path="feedback"
        label="Feedback (explain your rating)"
        placeholder="Describe what works well and what could be improved..."
        validation={[{ required: true, min: 20 }]}
      />
      
      <Field.Checkbox
        path="approved"
        label="✅ Approve for use"
        validation={[{ required: true }]}
      />
    </View.Flex>
  </View.Card>
</View.Flex>
```

### Example 2: Multi-Step Rubric Evaluation

```jsx
<View.Flex vertical={true} gap={'1.25rem'}>
  {/* Sticky Header */}
  <View.Flex 
    style={{
      position: 'sticky',
      top: '-1rem',
      background: 'hsl(var(--card))',
      zIndex: 10,
      padding: '1rem',
      borderBottom: '1px solid hsl(var(--border))'
    }}
  >
    <View.Labels
      labels={[
        { title: 'Task ID:', value: actions.get('task_id') },
        { title: 'Stage:', value: 'evaluation' },
        { title: 'Progress:', value: `${currentStep}/3`, theme: 'success' }
      ]}
    />
  </View.Flex>

  {/* Step 1: Content Review */}
  <View.Collapsible title="Step 1: Review Content" defaultOpen={true}>
    <View.Card>
      <View.AiEditor
        path="content"
        label="Content to Evaluate"
        disabled={true}
        height={300}
      />
    </View.Card>
  </View.Collapsible>

  {/* Step 2: Apply Rubrics */}
  <View.Collapsible title="Step 2: Apply Evaluation Criteria">
    <View.Flex vertical={true} gap={'1rem'}>
      {data.rubrics.map((rubric, index) => (
        <View.Card key={index} title={`Criterion ${index + 1}: ${rubric.name}`}>
          <View.Flex vertical={true} gap={'0.5rem'}>
            <View.Text>{rubric.description}</View.Text>
            <Field.RadioGroup
              path={`rubric_${index}_score`}
              label="Score"
              options={[
                { value: 'pass', label: '✅ Pass' },
                { value: 'fail', label: '❌ Fail' }
              ]}
              validation={[{ required: true }]}
            />
          </View.Flex>
        </View.Card>
      ))}
    </View.Flex>
  </View.Collapsible>

  {/* Step 3: Final Decision */}
  <View.Collapsible title="Step 3: Final Decision">
    <View.Card>
      <View.Flex vertical={true} gap={'1rem'}>
        <Field.RadioGroup
          path="final_verdict"
          label="Overall Decision"
          options={[
            { value: 'accept', label: '✅ Accept - Ready for use' },
            { value: 'revise', label: '🔄 Needs revision' },
            { value: 'reject', label: '❌ Reject - Cannot be used' }
          ]}
          validation={[{ required: true }]}
        />
        
        <Field.Textarea
          path="summary_feedback"
          label="Summary feedback"
          placeholder="Summarize your evaluation and any recommendations..."
          validation={[{ required: true }]}
        />
      </View.Flex>
    </View.Card>
  </View.Collapsible>
</View.Flex>
```

### Key Design Principles:

1. **Clear Information Hierarchy**: Use headers, cards, and collapsible sections to organize content
2. **Progressive Disclosure**: Show information in logical steps, allow users to focus on current task
3. **Visual Feedback**: Use colors, icons, and themes to indicate status and importance
4. **Validation & Guidance**: Provide clear labels, placeholders, and validation messages
5. **Consistent Patterns**: Use similar structures for similar tasks to reduce cognitive load

### Common Patterns:

- **Header + Metadata + Content + Evaluation + Decision**: Standard evaluation flow
- **Tabs for Different Views**: Organize different aspects of complex tasks
- **Collapsible Sections**: Break complex tasks into manageable steps
- **Cards for Grouping**: Visually separate different types of content
- **Validation at Multiple Levels**: Ensure data quality at field and section levels

This guide provides the foundation for building effective, user-friendly interfaces for labeling tasks using the available components. 