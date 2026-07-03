# TBX Interface – Validation & Quality‑Assurance Playbook

> **Mission** Ship every TBX interface error‑free, performant, and maintainable by enforcing a single, opinionated workflow that *also* preserves the granular know‑how from the original guide.

---

## 1 End‑to‑End Validation Pipeline

| Gate                              | Purpose                                                   | Must Pass Before → |
| --------------------------------- | --------------------------------------------------------- | ------------------ |
| **1. Component Discovery**        | Ensure you are using real, properly‑typed TBX components. | Gate 2             |
| **2. Pre‑Generation Checklist**   | Assemble correct props & file scaffolding.                | Gate 3             |
| **3. Post‑Generation Validation** | Verify JSON syntax, run‑time behaviour, and data binding. | Gate 4             |
| **4. QA Sign‑Off**                | Formal checklist + Live‑Editor test → ready to merge.     | —                  |

Failure at any gate sends you back to the top of that gate.

---

## 2 Gate 1 — Component Discovery (Mandatory)

### 2.1 Checks

1. **Open `src/interfaces/tbx/elements.d.ts`**
2. Confirm the component *exists*.
3. Note **required vs optional props**, including accepted enum values.
4. Use ONLY props defined in TypeScript interface
5. Identify *special* rules (e.g., `View.Card` must have `flat={true}`).

> **CLI helper**
>
> ```bash
> grep -A10 "ComponentName" src/interfaces/tbx/elements.d.ts
> ```

### 2.2 Anti‑Patterns

| ❌ Wrong                                | ✅ Right                                                   |
| -------------------------------------- | --------------------------------------------------------- |
| `<View.Labels label="Text" />`         | `<View.Labels labels={[{title:'Text',value:'Value'}]} />` |
| `<Field.Button ... />` (doesn’t exist) | `<View.ActionButton ... />`                               |

---

## 3 Gate 2 — Pre‑Generation Checklist

* [ ] **Component exists** in TypeScript.
* [ ] **Prop names & types** match `elements.d.ts` exactly.
* [ ] **Required props** supplied; optional props only if needed.
* [ ] **AiEditor** uses `aiChecks` (never `min`/`max`).
* [ ] **View\.Card** includes `flat={true}`.
* [ ] **Filename** `snake_case.json` in correct folder:

  * `src/interfaces/` for official examples
  * `generated-interfaces/` for drafts or user content

> **Snippet examples**
>
> ```jsx
> // ✔️ Correct
> ```jsx
> <View.Labels labels={[{title: "Text", value: "Value"}]} />
> <View.Text content="Content" />
> <Field.RadioGroup path="field" options={CONST.options} />
> <View.Card flat={true}>
> ```
>
> // ❌ Incorrect
> <Field.RadioGroup options="values" />
> ```

---

## 4 Gate 3 — Post‑Generation Validation

1. **Syntax check** — `jq '.' interface.json`
2. **Prop audit** — cross‑check every component against TypeScript.
3. **Functional smoke test** in TBX Live Editor.
4. **Data binding** — ensure every `path` mirrors JSON structure.

---

## 5 Deep‑Dive Troubleshooting Library

### 5.1 `Field.AiEditor` Pitfalls

**Symptoms:**
- Interface fails to load
- Validation errors on AiEditor fields
- Min/max validation not working
- GrammarScore validation errors
- Using string mock value as an input instead of the object

**Solutions:**
1. **Remove standard validation for AiEditor:**
   ```jsx
   // ❌ WRONG:
   <Field.AiEditor validation={[{min: 20}]} />
   
   // ✅ CORRECT:
   <Field.AiEditor 
     validation={[{required: true}]}
     aiChecks={{
       wordCount: {enabled: true, validate: true, min: 20}
     }}
   />
   ```

2. **Use Field.Textarea for simple validation:**
   ```jsx
   <Field.Textarea 
     path='feedback'
     validation={[{required: true, min: 20}]}
   />
   ```

3. **GrammarScore validation - CRITICAL RULES:**
   ```jsx
   // ❌ WRONG - Using min/max or invalid numbers:
   <Field.AiEditor 
     aiChecks={{
       grammarScore: {
         enabled: true,
         validate: true,
         minScore: 10,    // WRONG: max score is 5
         min: 3,          // WRONG: don't use min/max
         max: 5           // WRONG: don't use min/max
       }
     }}
   />
   
   // ✅ CORRECT - Only use minScore with valid range (0-5):
   <Field.AiEditor 
     aiChecks={{
       grammarScore: {
         enabled: true,
         validate: true,
         minScore: 3      // CORRECT: Valid range 0-5
       }
     }}
   />
   ```

   **GrammarScore Rules:**
   - **Valid range**: 0 to 5 only
   - **Use `minScore` property**: NOT `min` or `max`
   - **No decimals**: Use whole numbers (0, 1, 2, 3, 4, 5)
   - **Common values**: `minScore: 3` or `minScore: 4` for quality content

4. **Wrong mock values when reading data with Field.AiEditor**

  ```jsx
  // ❌ WRONG - Data view has following JSON key-value inside when addressing as path='document.content' in Field.AiEditor:
  "content": ""
  // ✅ CORRECT - Data view has following JSON key-value inside when addressing as path='document.content' in Field.AiEditor:
  "content": {
    "content": "text here"
  }
  ```

### 5.2 Component Prop Mismatch

**Symptoms:**
- Component not rendering
- Props not being recognized
- TypeScript-like errors in TBX editor

**Solutions:**
1. **Always check elements.d.ts first:**
   ```bash
   grep -A 10 "ComponentName" src/interfaces/tbx/elements.d.ts
   ```

2. **Common prop corrections:**
   ```jsx
   // ❌ WRONG:
   <View.Labels label="text" />
   <View.Text label="content" />
   <View.Card>  // Missing flat={true}
   
   // ✅ CORRECT:
   <View.Labels labels={[{title: "text", value: "value"}]} />
   <View.Text content="content" />
   <View.Card flat={true}>
   ```

3. **View.Link - Wrong props:**
   ```jsx
   // ❌ WRONG:
   <View.Link href={data.pdfUrl} label="View PDF Document" />
   
   // ✅ CORRECT:
   <View.Link url={data.pdfUrl} validation={{opened: true}}>
     View PDF Document
   </View.Link>
   ```

4. **View.Text - Wrong syntax:**
   ```jsx
   // ❌ WRONG:
   <View.Text content="Please analyze the document." />
   
   // ✅ CORRECT:
   <View.Text>Please analyze the document.</View.Text>
   ```

### 5.3 Wrong Component Selection

**Symptoms:**
- Component doesn't exist error
- Function not working as expected
- Button or action components not rendering

**Solutions:**
1. **Button components - Use correct component:**
   ```jsx
   // ❌ WRONG - Field.Button doesn't exist:
   <Field.Button
     path="generateSummary"
     label="Generate Summary"
     onClick={async () => {}}
   />
   
   // ✅ CORRECT - Use View.ActionButton:
   <View.ActionButton
     label="Generate Summary"
     action={async () => {}}
     variant="default"
   />
   ```

   1.1 **Button components - Verify that prop values exist:**
   ```jsx
   // ❌ WRONG - variant prop has no "primary" value
   <View.ActionButton
      label="Generate Summary"
      action={async () => {
        await actions.llm({
          path: 'llm_summary',
          prompt: `Please provide a concise summary of this document: ${'https://arxiv.org/pdf/' + actions.get('article_id')}`,
          model_id: 'amazon-bedrock-nova-pro-v1',
          temperature: 0.7,
          response_format_type: 'json_object',
        });
      }}
      variant="primary"
    />

    // ✅ CORRECT - variant prop has following values: 'default', 'secondary', 'ghost', 'outline'
    <View.ActionButton
      label="Generate Summary"
      action={async () => {
        await actions.llm({
          path: 'llm_summary',
          prompt: `Please provide a concise summary of this document: ${'https://arxiv.org/pdf/' + actions.get('article_id')}`,
          model_id: 'amazon-bedrock-nova-pro-v1',
          temperature: 0.7,
          response_format_type: 'json_object',
        });
      }}
      variant='default'
    />
    ```

2. **Always verify component exists in elements.d.ts:**
   ```bash
   # Check if component exists
   grep -n "Field.Button" src/interfaces/tbx/elements.d.ts  # Returns nothing
   grep -n "View.ActionButton" src/interfaces/tbx/elements.d.ts  # Found!
   ```

### 5.4 Validation Logic Errors

**Symptoms:**
- Form submits with invalid data
- Required fields not enforced
- Conditional validation not working

**Solutions:**
1. **Check preprocess function:**
   ```javascript
   "let errors = [];\nif (!data.required_field?.trim()) {\n  errors.push('Field is required');\n}\nreturn {...data, errors};"
   ```

2. **Verify field paths match data structure:**
   ```json
   // data structure:
   "data": "{\"user_rating\": \"\"}",
   
   // field path must match:
   "path='user_rating'"
   ```

### 5.5 JSON Syntax Errors

**Symptoms:**
- Interface won't load in TBX editor
- JSON parsing errors
- Quote/escape issues

**Solutions:**
1. **Validate JSON syntax:**
   ```bash
   jq '.' your_interface.json
   ```

2. **Fix common escape issues:**
   ```json
   // ❌ WRONG:
   "code": "<Field.Text label="Name" />"
   
   // ✅ CORRECT:  
   "code": "<Field.Text label='Name' />"
   ```

---

## 6 Gate 4 — Quality‑Assurance Checklist

### Pre-Delivery Validation (MANDATORY)

- [ ] **Context Updated**: Ran `./post_open.sh -v`
- [ ] **Files Read**: Read all 4 required context files
- [ ] **Component Verification**: Checked ALL components against `elements.d.ts`
- [ ] **Props Validated**: Used exact prop names and types from TypeScript definitions
- [ ] **JSON Structure**: Used correct 4-field string format
- [ ] **AiEditor Handled**: Used `aiChecks` instead of standard validation for AiEditor
- [ ] **Syntax Check**: Validated JSON with `jq`
- [ ] **Testing Instructions**: Provided TBX Live Editor testing steps

### Component-Specific Checks

- [ ] **View.Card**: Added `flat={true}` for proper styling
- [ ] **Field.RadioGroup**: Used array format for options with value/label objects
- [ ] **Field.AiEditor**: Used `aiChecks` for validation, not standard `min/max`
- [ ] **View.Labels**: Used `labels` array prop, not `label` string
- [ ] **View.Text**: Used `content` prop, not `label` or `children`

### File Organization

- [ ] **Saved to correct location**: 
  - `src/interfaces/` for official examples
  - `generated-interfaces/` for user/practice interfaces
- [ ] **Proper filename**: Descriptive, snake_case, `.json` extension
- [ ] **Git safety**: Avoided committing user interfaces to main repo

### Git Operations Policy

- [ ] **NEVER auto-perform git operations**: Always ask permission first
- [ ] **Ask explicitly**: "Would you like me to add, commit, and/or push these changes?"
- [ ] **Wait for confirmation**: Don't proceed until user explicitly approves
- [ ] **Respect workflow**: User controls all git operations completely

---

## 7 Testing Protocol (Live Editor)

### Functional Testing Steps
1. **Load in TBX Live Editor**
   - URL: https://tlkfrontprodpublic.blob.core.windows.net/template-builder-production/tb-jsx.editor/index.html
   - Upload your JSON file
   - Check for load errors

2. **Test all form interactions**
   - Fill out all fields
   - Test required field validation
   - Verify conditional logic works

3. **Verify validation rules**
   - Submit with empty required fields
   - Test min/max length validation
   - Check custom validation logic

4. **Check data binding**
   - Ensure field paths match data structure
   - Verify data is captured correctly
   - Test preprocess function

5. **Confirm visual layout**
   - Check spacing and alignment
   - Verify card styling (flat={true})
   - Test responsive behavior

### Performance Indicators
- Interface loads without errors
- All components render correctly
- Form validation works as expected
- Data is properly captured
- Visual design is professional

---

## 8 Handy CLI Commands

```bash
# Validate JSON syntax
jq '.' genrated_interface.json

# Check if component exists in elements.d.ts
grep -n "ComponentName" src/interfaces/tbx/elements.d.ts

# Inspect component props
grep -A5 "ComponentName:" src/interfaces/tbx/elements.d.ts

# Verify file structure
ls -la src/interfaces/tbx/
ls -la generated-interfaces/
```

### Common Fixes
```bash
# Fix JSON formatting
jq '.' input.json > formatted.json

# Check for quote issues
grep -n '"' your_interface.json

# Verify all required files exist
./post_open.sh -v
```

---

## 9 Appendix — Complete TypeScript Signatures

> **Source of truth** `src/interfaces/tbx/elements.d.ts` — copy there if these ever drift.

### View\.Flex

```typescript
View.Flex: {
  vertical?: boolean;
  gap?: string | number | [string | number, string | number];
  justify?: "center" | "start" | "end" | "normal" | "space-around" | "space-between";
  align?: "middle" | "start" | "end" | "stretch";
  wrap?: boolean;
  style?: React.CSSProperties;
  children: React.ReactNode;
}
```

### View\.Card

```typescript
View.Card: {
  flat?: boolean;          // CRITICAL: Use flat={true}
  title?: React.ReactNode;
  description?: React.ReactNode;
  variant?: "error" | "default" | "info" | "success" | "warning";
  view?: "fill" | "outline";
  style?: React.CSSProperties;
  children: React.ReactNode;
}
```

### Field.AiEditor

```typescript
Field.AiEditor: {
  path: string;                    // REQUIRED
  validation?: ValidationRule[];   // Use only required: true
  aiChecks?: {
    wordCount?: {
      enabled: boolean;
      validate: boolean;
      min?: number;
      max?: number;
    };
    grammarScore?: {
      enabled: boolean;
      validate: boolean;
      minScore: number;              // CRITICAL: 0‑5 range only
    };
    tokenCount?: {
      enabled: boolean;
      validate: boolean;
      min?: number;
      max?: number;
    };
  };
  defaultMode?: "markdown" | "rich-text";
  height?: number;
  contentEditable?: boolean;
}
```

### Field.RadioGroup

```typescript
Field.RadioGroup: {
  path: string;                              // REQUIRED
  options: { value: any; label: string }[];  // REQUIRED array format
  label?: React.ReactNode;
  validation?: ValidationRule[];
  disabled?: boolean;
  onChange?: (changedValue: unknown) => void;
  style?: React.CSSProperties;
}
```

### View\.Labels

```typescript
View.Labels: {
  labels: {                                  // REQUIRED array, NOT label
    title: string;
    value?: string | number | null;
    theme?: "default" | "alert" | "success";
  }[];
  style?: React.CSSProperties;
}
```

*(For any additional components, refer directly to `elements.d.ts`.)*

---

## 🚀 SUCCESS CRITERIA

### Interface Quality Standards
- ✅ **Loads without errors** in TBX Live Editor
- ✅ **All components render** correctly
- ✅ **Form validation** works as expected
- ✅ **Data capture** functions properly
- ✅ **Visual design** is professional and consistent
- ✅ **Component props** match TypeScript definitions exactly
- ✅ **JSON structure** follows 4-field string format
- ✅ **File organization** follows project standards

### Validation Completion
- ✅ **Pre-generation checklist** completed
- ✅ **Component verification** against elements.d.ts
- ✅ **Syntax validation** with jq
- ✅ **Functional testing** in TBX Live Editor
- ✅ **Quality assurance** checklist completed

---

### Remember → **No interface ships until every gate is green.**
