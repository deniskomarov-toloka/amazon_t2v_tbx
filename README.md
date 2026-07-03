# TBX Interface Development

Build evaluation interfaces for AI training pipelines (SFT/RLHF/etc) using TBX components. This repository provides everything you need: component definitions, working examples, and automated sync with the latest TBX updates.

## 🤖 Perfect for Cursor Agent Mode

> **⚡ Optimized for Cursor AI with auto-run and auto-fix enabled**
> 
> This repository uses a **modular folder structure** for better AI assistance:
> - **Full syntax highlighting** - JSX and JavaScript files, not stringified JSON
> - **No escaping issues** - Write natural code
> - **Better AI understanding** - Cursor can properly analyze your code
> - **Local interface creation** - Generate folders with AI assistance
> - **Error auto-fixing** - Built-in validation and troubleshooting
> 
> 🎯 **Enable Cursor's agent mode with auto-run for the best experience!**

## 📖 Table of Contents

- [🚀 Quick Start](#-quick-start)
- [📋 What is TBX?](#-what-is-tbx)
- [🎯 Modular Folder Structure](#-modular-folder-structure)
- [🎯 Learning Path](#-learning-path)
- [🧩 Essential Components](#-essential-components)
- [📝 Common Patterns](#-common-patterns)
- [🤖 AI Assistant Integration](#-ai-assistant-integration)
- [🛠️ File Organization](#️-file-organization)
- [📚 Complete Tutorial](#-complete-tutorial-from-prompt-to-working-interface)
- [🔍 Reference & Resources](#-reference--resources)
- [🚨 Common Mistakes](#-common-mistakes)
- [🔧 Troubleshooting](#-troubleshooting)

---

## 🚀 Quick Start

```bash
git clone https://github.com/toloka-dev/tbx-course.git
cd tbx-course
chmod +x setup.sh
./setup.sh
```

**Create your first interface:**
```bash
# Generate a modular template
./generate_template.sh evaluation my_first_interface

# Edit the files in Cursor with full syntax highlighting:
# - generated-interfaces/my_first_interface/code.jsx
# - generated-interfaces/my_first_interface/data.json
# - generated-interfaces/my_first_interface/preprocess.js
# - generated-interfaces/my_first_interface/constants.json

# Combine into single JSON for TBX Editor
./combine_interface.sh generated-interfaces/my_first_interface

# Validate
./validate_interface.sh generated-interfaces/my_first_interface
```

---

## 📋 What is TBX?

TBX interfaces are **JSON configurations** that create web-based evaluation forms. They're designed for:

- **AI Response Evaluation** - Quality assessment, pass/fail decisions
- **Human Preference Collection** - RLHF training data
- **Content Safety Review** - Bias detection, harmful content filtering
- **Training Data Validation** - SFT dataset quality control

---

## 🎯 Modular Folder Structure

Each interface is a **folder with 4 separate files** (instead of a single JSON with escaped strings):

```
generated-interfaces/my_interface/
├── code.jsx        # JSX components with full syntax highlighting
├── data.json       # Initial form data
├── preprocess.js   # JavaScript preprocessing logic
└── constants.json  # Static configuration (options, labels, content)
```

### Why Modular?

| Old Approach (Single JSON) | New Approach (Modular Folder) |
|---------------------------|-------------------------------|
| ❌ Code as escaped string | ✅ Real `.jsx` file with highlighting |
| ❌ No syntax highlighting | ✅ Full IDE support |
| ❌ Escaping hell (`\"`, `\n`) | ✅ Write natural code |
| ❌ AI struggles with strings | ✅ Cursor understands your code |
| ❌ Hard to debug | ✅ Each file validated separately |

### Workflow

```bash
# 1. Create/edit modular files
./generate_template.sh evaluation my_interface
# Edit files in generated-interfaces/my_interface/

# 2. Combine into JSON for TBX Editor
./combine_interface.sh generated-interfaces/my_interface

# 3. Validate
./validate_interface.sh generated-interfaces/my_interface

# 4. Test in TBX Editor
# Upload generated-interfaces/my_interface.json
```

---

## 🎯 Learning Path

### 1. **Explore Official Resources**
- **📚 [TBX Documentation](https://tbx-docs.dev-tlk.toloka-test.network/docs)** - Component reference with examples
- **🎨 [TBX Live Editor](https://tlkfrontprodpublic.blob.core.windows.net/template-builder-production/tb-jsx.editor/index.html)** - Test interfaces instantly

### 2. **Study Working Examples**
Explore modular examples to understand the structure:
- `src/interfaces/examples/basic_example/` - Simple patterns
- `src/interfaces/examples/advanced_example/` - Multi-step workflow
- `src/interfaces/examples/cot_example/` - Chain of thought interface

Combine and upload to see them in action:
```bash
./combine_interface.sh src/interfaces/examples/basic_example
# Upload src/interfaces/examples/basic_example.json to TBX Editor
```

### 3. **Find Components**
Open `src/interfaces/tbx/elements.d.ts` in your editor:
- Search `Field.` for input components (Text, RadioGroup, Checkbox)
- Search `View.` for display components (Card, Alert, Labels)
- Search `Layout.` for structure components (StickyHeader)

### 4. **Build Your First Interface**

```bash
# Generate from template
./generate_template.sh evaluation my_evaluation

# Edit files with full syntax support
code generated-interfaces/my_evaluation/code.jsx

# Combine and validate
./combine_interface.sh generated-interfaces/my_evaluation
./validate_interface.sh generated-interfaces/my_evaluation
```

### 5. **Test in Live Editor**
1. Open [TBX Editor](https://tlkfrontprodpublic.blob.core.windows.net/template-builder-production/tb-jsx.editor/index.html)
2. Click "Upload config" 
3. Select your combined JSON file
4. See immediate results

---

## 🧩 Essential Components

### **Foundation (Use These Always)**
| Component | Purpose | Example |
|-----------|---------|---------|
| `View.Flex` | Main container | `<View.Flex vertical={true} gap={'1rem'}>` |
| `View.Card` | Content sections | `<View.Card flat={true} title='Section'>` |
| `Field.RadioGroup` | Decisions/ratings | Pass/fail, quality scales |
| `Field.Checkbox` | Confirmations | Final approval checkboxes |
| `Field.Textarea` | Detailed feedback | Comments, explanations |
| `View.Alert` | Instructions | Task guidance, warnings |

### **Enhanced (Add When Needed)**
| Component | Purpose | Best For |
|-----------|---------|----------|
| `Field.AiEditor` | Rich text with AI checks | Content creation/editing |
| `View.Collapsible` | Multi-step workflows | Progressive disclosure |
| `View.Labels` | Status display | Progress, metadata |
| `View.Markdown` | Formatted content | Display text with formatting |

**🚨 Always use `flat={true}` on View.Card components**

### **🎨 Styling Tips**
**Spacing & Layout:**
- Use `rem` units for consistent spacing: `gap={'1rem'}`, `gap={'1.5rem'}`
- Standard gaps: `0.5rem`, `1rem`, `1.25rem`, `1.5rem`, `2rem`

---

## 📝 Common Patterns

### **Standard Evaluation Interface**

**code.jsx:**
```jsx
<View.Flex vertical={true} gap={'1.5rem'}>
  <View.Alert variant='info' title='Review Task' description='Evaluate content quality' />
  
  <View.Card flat={true} title='Content'>
    <View.Markdown content={CONST.contentToReview} />
  </View.Card>
  
  <View.Card flat={true} title='Evaluation'>
    <Field.RadioGroup 
      path='quality' 
      options={CONST.qualityOptions} 
      validation={[{required: true}]} 
    />
    {data.quality === 'poor' && (
      <Field.Textarea 
        path='issues' 
        label='Explain problems' 
        validation={[{required: true}]} 
      />
    )}
  </View.Card>
  
  <Field.Checkbox 
    path='confirmed' 
    label='✅ Review complete' 
    validation={[{required: true}]} 
  />
</View.Flex>
```

**data.json:**
```json
{
  "quality": "",
  "issues": "",
  "confirmed": false
}
```

**constants.json:**
```json
{
  "contentToReview": "# Sample Content\n\nContent to evaluate.",
  "qualityOptions": [
    {"value": "excellent", "label": "⭐ Excellent"},
    {"value": "good", "label": "✅ Good"},
    {"value": "poor", "label": "❌ Poor"}
  ]
}
```

**preprocess.js:**
```javascript
return data;
```

---

## 🤖 AI Assistant Integration

### **For Cursor AI Users**
Cursor automatically reads `.cursor/rules/tbx/RULE.md` which contains the **Modular TBX Interface Generation Protocol**.

**🤖 Key Commands:**
```bash
# Generate template (creates modular folder)
./generate_template.sh evaluation my_interface

# Combine files into JSON
./combine_interface.sh generated-interfaces/my_interface

# Validate (works with folder or JSON)
./validate_interface.sh generated-interfaces/my_interface
```

**🎯 Quick Start Prompts:**
```
"Create a TBX interface for [your use case]"
"Build a quality evaluation interface with rating scales and feedback"
"Make a preference collection interface comparing AI responses"
```

### **For Other AI Assistants**

**📋 Setup First:**
```
"Read TBX_INTERFACE_GENERATION_GUIDE.md, then run ./post_open.sh -v"
```

**🎯 Generation Instructions:**
```
"Create a TBX modular interface for [requirements]:
• Create folder with 4 files: code.jsx, data.json, preprocess.js, constants.json
• Use exact component names from src/interfaces/tbx/elements.d.ts
• Include validation on all form fields
• Save to generated-interfaces/
• Run ./combine_interface.sh and ./validate_interface.sh"
```

---

## 🛠️ File Organization

```bash
generated-interfaces/           # Your practice files (git ignored)
├── my_interface/               # Each interface is a FOLDER
│   ├── code.jsx                # JSX components
│   ├── data.json               # Initial form data
│   ├── preprocess.js           # Processing logic
│   └── constants.json          # Static config
└── my_interface.json           # Combined output (auto-generated)

src/interfaces/                 # Official examples
├── examples/
│   ├── basic_example/          # Modular example
│   ├── advanced_example/       # Complex workflow
│   └── cot_example/            # Chain of thought
└── tbx/                        # Component definitions
    └── elements.d.ts           # TypeScript definitions

# Scripts
├── generate_template.sh        # Create modular folder from template
├── combine_interface.sh        # Merge 4 files into JSON
└── validate_interface.sh       # Validate folder or JSON
```

---

## 📚 Complete Tutorial: From Prompt to Working Interface

### **Step 1: Generate Template** 🎯
```bash
./generate_template.sh evaluation my_evaluator
```

### **Step 2: Edit Files in Cursor** ✨
Open the folder and edit with full syntax highlighting:
- `generated-interfaces/my_evaluator/code.jsx` - Add/modify components
- `generated-interfaces/my_evaluator/data.json` - Set initial values
- `generated-interfaces/my_evaluator/constants.json` - Configure options

### **Step 3: Combine Files** 🔧
```bash
./combine_interface.sh generated-interfaces/my_evaluator
```

### **Step 4: Validate** ✅
```bash
./validate_interface.sh generated-interfaces/my_evaluator
```

### **Step 5: Test in TBX Editor** 🌐
1. Open [TBX Editor](https://tlkfrontprodpublic.blob.core.windows.net/template-builder-production/tb-jsx.editor/index.html)
2. Click "Upload config"
3. Select `generated-interfaces/my_evaluator.json`

### **Step 6: Iterate** 🔄
- Edit the modular files directly
- Re-run `./combine_interface.sh` and `./validate_interface.sh`
- Upload updated JSON to TBX Editor

### **Step 7: Success!** 🎉
You now have a working TBX interface with full IDE support!

---

## 🔍 Reference & Resources

### **For AI Agents (Primary)**
- **🚀 [TBX_INTERFACE_GENERATION_GUIDE.md](./TBX_INTERFACE_GENERATION_GUIDE.md)** - Modular generation workflow
- **✅ [TBX_VALIDATION_GUIDE.md](./TBX_VALIDATION_GUIDE.md)** - Validation and quality assurance
- **🎯 [.cursor/rules/tbx/RULE.md](./.cursor/rules/tbx/RULE.md)** - Cursor AI specific instructions

### **Additional Documentation**
- **📖 [Interface Building Guide](./src/instructions/interface_building_guide.md)** - Step-by-step tutorial
- **🚀 [Advanced Patterns](./src/instructions/interface_building_guide_advanced.md)** - Multi-step workflows
- **💡 [Design Insights](./src/instructions/comprehensive_insights.md)** - Best practices
- **📚 [Component Reference](./src/instructions/elements_usage_guide.md)** - Usage examples

### **Support**
- **💬 [#delivery-tools-support](https://toloka-ai.slack.com/archives/C07GR96FNLB)** - Slack channel

---

## 🚨 Common Mistakes

### **❌ Creating Single JSON Files**
```json
// DON'T create monolithic JSON files
{"code": "...", "data": "...", ...}
```

### **✅ Create Modular Folders**
```
my_interface/
├── code.jsx
├── data.json
├── preprocess.js
└── constants.json
```

### **❌ Missing flat={true}**
```jsx
<View.Card title='Section'>  // Wrong!
```

### **✅ Always Use flat**
```jsx
<View.Card flat={true} title='Section'>
```

---

## 🔧 Troubleshooting

**Setup issues:**
```bash
rm -rf .tbx-cache && ./setup.sh
```

**Missing autocomplete:**
```bash
./post_open.sh -v
ls -la src/interfaces/tbx/
```

**Combine/validate issues:**
```bash
# Validate individual files
jq '.' generated-interfaces/my_interface/data.json
jq '.' generated-interfaces/my_interface/constants.json

# Check preprocess.js has return statement
grep 'return' generated-interfaces/my_interface/preprocess.js
```

**Interface not rendering:**
- Check JSON syntax with `jq`
- Verify component names in `src/interfaces/tbx/elements.d.ts`
- Look at working examples in `src/interfaces/examples/`
- Run `./validate_interface.sh` for detailed diagnostics

---

## 🎉 You're Ready!

**What you have:**
✅ **Modular folder structure** with full syntax highlighting  
✅ **Component definitions** with autocomplete  
✅ **Working examples** in modular format  
✅ **Combine script** to merge files for TBX Editor  
✅ **Validation script** for quality assurance  

**What you can build:**
- AI response quality evaluators
- Human preference collectors for RLHF
- Content safety reviewers  
- Training data validators
- Multi-step assessment workflows

**Start building:** Generate a template, edit with full IDE support, and iterate!

Happy coding! 🚀
