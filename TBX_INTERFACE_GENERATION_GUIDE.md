# TBX Interface Generation Guide

## 🎯 Modular Approach (Recommended)

TBX interfaces are now created as **folders with 4 separate files** for better Cursor AI editing experience:

```
generated-interfaces/my_interface/
├── code.jsx        # JSX UI components (View pane)
├── data.json       # INPUT data from server - simulates task data (Data pane)
├── preprocess.js   # Data enrichment function (Enrich Data pane)
└── constants.json  # Static config: options, labels (Constants pane)
```

### Benefits
- ✅ **Full syntax highlighting** for JSX and JavaScript
- ✅ **No JSON string escaping** - write natural code
- ✅ **Better AI assistance** - Cursor understands the code structure
- ✅ **Easier debugging** - each file can be validated separately
- ✅ **Version control friendly** - cleaner diffs

---

## ☑️ Startup Checklist — run **every** session

1. **Pull context**

   ```bash
   ./post_open.sh -v
   ```

2. **Load reference files** (no exceptions)

   | File                                                      | Purpose                                       |
   | --------------------------------------------------------- | --------------------------------------------- |
   | `src/interfaces/tbx/elements.d.ts`                        | **🔥 Component API — single source of truth** |
   | `src/interfaces/examples/basic_example/`                  | Simple patterns (modular format)              |
   | `src/interfaces/examples/advanced_example/`               | Complex patterns (modular format)             |
   | `src/interfaces/tbx/snippets.json`                        | Proven code snippets                          |

3. **Open** `TBX_VALIDATION_GUIDE.md` (you'll need it for validation).

---

## 🛠️ Generation Workflow

### Option A: Generate from Template (Recommended for beginners)

```bash
# Create modular folder from template
./generate_template.sh evaluation my_quality_check
./generate_template.sh comparison my_comparison
./generate_template.sh workflow my_workflow
./generate_template.sh feedback my_feedback
./generate_template.sh form my_form

# This creates:
# generated-interfaces/my_quality_check/
#   ├── code.jsx
#   ├── data.json
#   ├── preprocess.js
#   └── constants.json
```

### Option B: Create Custom Interface Manually

```bash
mkdir -p generated-interfaces/my_interface
# Then create the 4 files manually
```

---

## 📁 The 4 Panes/Files Explained

Understanding what each file represents is critical for building correct TBX interfaces.

### 1. `data.json` - INPUT Data from Server (Data pane)

**This is NOT empty form fields!** This contains the **task input data** that comes from the server when a task runs in production.

- Contains the actual content to be evaluated/reviewed
- Simulates real production data for testing your interface
- **Use snake_case** for field names (not camelCase)
- Access in View pane: `data.field_name` or `actions.get('field_name', defaultValue)`
- Access in Preprocess: `data.field_name`

**Example - AI response evaluation task:**
```json
{
  "prompt": "Explain quantum computing in simple terms",
  "ai_response": "Quantum computing uses quantum bits (qubits) that can exist in multiple states simultaneously...",
  "model_name": "gpt-4",
  "task_category": "science",
  "metadata": {
    "timestamp": "2024-01-15T10:30:00Z",
    "user_id": "eval_user_42"
  }
}
```

### 2. `preprocess.js` - Data Enrichment Function (Enrich Data pane)

**⚠️ KEEP MINIMAL!** Most interfaces don't need preprocessing. Avoid overuse.

- Receives `data` object from Data pane
- Returns object that is **MERGED** with original data: `{...data, ...returned}`
- `return {}` keeps all data intact — **this is the default**
- **Re-runs on every user interaction** — keep it lightweight!
- Use snake_case for computed field names

**Default (use 90% of the time):**
```javascript
// No preprocessing needed
return {};
```

**Only when computed fields are truly needed:**
```javascript
// Calculate derived fields from input data
const words = (data.ai_response || '').split(/\s+/).filter(w => w.length > 0);

return {
  word_count: words.length,
  is_long_response: words.length > 200
};
```

### 3. `code.jsx` - JSX UI Components (View pane)

The JSX interface that displays data and collects user input.

- Read input data: `data.field_name` (from data.json)
- Read enriched data: `actions.get('computed_field')` (from preprocess.js return)
- Write user responses: Field components with `path` attribute (snake_case)
- Use static config: `CONST.variable_name` (from constants.json)

**Example:**
```jsx
<View.Flex vertical={true} gap={'1.5rem'}>
  {/* Display task instructions */}
  <View.Alert 
    variant='info' 
    title='Evaluation Task' 
    description={CONST.instructions}
  />
  
  {/* Display INPUT content from data.json */}
  <View.Card flat={true} title='AI Response to Evaluate'>
    <View.Text variant='small' color='secondary'>
      Prompt: {data.prompt}
    </View.Text>
    <View.Markdown content={data.ai_response} />
  </View.Card>
  
  {/* Collect user OUTPUT */}
  <View.Card flat={true} title='Your Assessment'>
    <Field.RadioGroup
      path='quality_rating'
      label='Quality Rating'
      options={CONST.quality_options}
      validation={[{required: true}]}
    />
    
    {/* Conditional based on user's selection */}
    {actions.get('quality_rating') === 'poor' && (
      <Field.Textarea
        path='issue_description'
        label='Describe issues'
        validation={[{required: true, min: 20}]}
      />
    )}
  </View.Card>
  
  <Field.Checkbox
    path='confirmed'
    label='✅ Evaluation complete'
    validation={[{required: true}]}
  />
</View.Flex>
```

### 4. `constants.json` - Static Configuration (Constants pane)

Static configuration that **doesn't change per task**. Use for reusable content.

- Dropdown/radio options
- Instructions and label text
- Configuration that's the same across all tasks
- **Use snake_case** for field names

**Example:**
```json
{
  "instructions": "Evaluate the AI response for accuracy, clarity, and helpfulness.",
  "quality_options": [
    {"value": "excellent", "label": "⭐ Excellent - Accurate, clear, and helpful"},
    {"value": "good", "label": "👍 Good - Mostly accurate with minor issues"},
    {"value": "fair", "label": "👌 Fair - Some inaccuracies or clarity issues"},
    {"value": "poor", "label": "👎 Poor - Significant problems"}
  ],
  "categories": ["science", "technology", "general"]
}
```

---

## 🔧 Combine and Validate

### Step 1: Combine Files

```bash
# Combine 4 files into single JSON for TBX Editor
./combine_interface.sh generated-interfaces/my_interface

# Output: generated-interfaces/my_interface.json
```

### Step 2: Validate

```bash
# Validate the folder (will combine first, then validate)
./validate_interface.sh generated-interfaces/my_interface

# Or validate the combined JSON directly
./validate_interface.sh generated-interfaces/my_interface.json
```

### Step 3: Test

Upload the combined JSON to TBX Live Editor:
https://tlkfrontprodpublic.blob.core.windows.net/template-builder-production/tb-jsx.editor/index.html

---

## 📐 Lean Validation Strategy

| Layer                            | Responsibility               | Allowed                                                              | **Forbidden**                                                                            |
| -------------------------------- | ---------------------------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| **Component `validation` props** | Required/format/range checks | ✅ All field‑level rules                                              | —                                                                                        |
| **AI checks (`aiChecks`)**       | Grammar, length, semantics   | ✅ LLM/grammar/word‑count rules                                       | —                                                                                        |
| **`preprocess.js`**              | Data shaping only            | ✅ Normalise data<br>✅ Derive helper fields<br>✅ Conditional UI hints | ❌ Required‑field checks<br>❌ Type/range checks<br>❌ Duplicate component‑level validation |

> **Rule of thumb**: If a rule fits in `validation` or `aiChecks`, keep it **out** of `preprocess.js`

---

## 🧩 Component Architecture

### Tier 1: Foundation Components

**View.Flex** – Main layout container
```jsx
<View.Flex vertical={true} gap={'1.5rem'}>
  {/* All content goes here */}
</View.Flex>
```

**View.Card** – Content grouping (always use `flat={true}`)
```jsx
<View.Card flat={true} title="Section Title">
  {/* Section content */}
</View.Card>
```

**Field.RadioGroup** – Primary decision components
```jsx
<Field.RadioGroup
  path='decision'
  label='Quality Assessment'
  options={CONST.qualityOptions}
  validation={[{required: true}]}
/>
```

**Field.Checkbox** – Confirmations
```jsx
<Field.Checkbox
  path='confirmed'
  label='✅ I confirm my evaluation'
  validation={[{required: true}]}
/>
```

### Tier 2: Enhanced Components

**Field.Textarea** – Multi‑line text
```jsx
<Field.Textarea
  path='feedback'
  label='Detailed Feedback'
  validation={[{required: true, min: 20}]}
/>
```

**Field.AiEditor** – Rich text with AI checks
```jsx
<Field.AiEditor
  path='content'
  label='Content'
  validation={[{required: true}]}
  aiChecks={{
    wordCount: {enabled: true, validate: true, min: 50},
    grammarScore: {enabled: true, validate: true, minScore: 3}
  }}
  height={200}
/>
```

**View.Collapsible** – Multi‑step workflows
```jsx
<View.Collapsible title='Step 1: Review' defaultOpen={true}>
  {/* Step content */}
</View.Collapsible>
```

### Tier 3: Specialized Components

**View.ActionButton** – Custom JavaScript actions
```jsx
<View.ActionButton
  label='Calculate Score'
  action={() => {
    const score = actions.get('points') * 2;
    actions.set('calculated_score', score);
  }}
/>
```

**Layout.StickyHeader** – Professional header layout
```jsx
<Layout.StickyHeader header={<HeaderContent />}>
  <MainContent />
</Layout.StickyHeader>
```

---

## 🚫 File‑Handling Rules (STRICT)

* **Do NOT** edit any existing repository files (except your own generated files)
* Save generated interfaces under `./generated-interfaces/`
* Use **snake_case** for folder and file naming

---

## 📚 Quick Reference

### Essential Components
```
View.Flex          // Layout container
View.Card          // Content grouping (flat={true})
Field.RadioGroup   // Primary decisions
Field.Checkbox     // Confirmations
Field.Text         // Single-line text input
Field.Textarea     // Multi-line text
Field.AiEditor     // Rich text with AI checks
View.Alert         // Instructions/warnings
View.Labels        // Status/metadata display
View.Collapsible   // Expandable sections
Layout.StickyHeader // Professional header
View.ActionButton  // Custom JavaScript actions
```

### Data Access in code.jsx
```jsx
{/* Read from data */}
{data.fieldName}

{/* Conditional rendering */}
{data.quality === 'poor' && <Field.Textarea path='issues' />}

{/* Access constants */}
{CONST.variableName}
```

### Data Access in preprocess.js / ActionButton
```javascript
// Read value
const value = actions.get('fieldPath');
const withDefault = actions.get('fieldPath', 'defaultValue');

// Write value
actions.set('fieldPath', newValue);
```

---

## 🚀 Next Steps

After generating your interface:

1. **Combine**: `./combine_interface.sh generated-interfaces/your_interface`
2. **Validate**: `./validate_interface.sh generated-interfaces/your_interface`
3. **Test in TBX Live Editor**: Upload the combined JSON
4. **Follow quality assurance checklist** in `TBX_VALIDATION_GUIDE.md`

---

*This guide focuses on interface generation. For validation, troubleshooting, and quality assurance, see `TBX_VALIDATION_GUIDE.md`*
