# Interface Building Guide - Advanced Sections

*This is the continuation of the Interface Building Guide. Read the main guide first.*

---

## Multi-Step Workflows

**What you'll learn:** How to create complex interfaces with multiple steps, progressive disclosure, and conditional logic for sophisticated labeling tasks.

### Understanding Progressive Disclosure

Complex tasks are easier when broken into steps. Users see only what they need for their current step, reducing cognitive load.

### `View.Collapsible` - Step Organization

**Purpose:** Create expandable sections that users can work through sequentially.

**Basic Pattern:**
```jsx
<View.Flex vertical={true} gap={'1.25rem'}>
  <View.Collapsible title="Step 1: Review Content" defaultOpen={true}>
    <View.Card>
      {/* Step 1 content */}
    </View.Card>
  </View.Collapsible>

  <View.Collapsible title="Step 2: Evaluation" disabled={!step1Complete}>
    <View.Card>
      {/* Step 2 content */}
    </View.Card>
  </View.Collapsible>

  <View.Collapsible title="Step 3: Final Decision" disabled={!step2Complete}>
    <View.Card>
      {/* Step 3 content */}
    </View.Card>
  </View.Collapsible>
</View.Flex>
```

**Key Properties:**
- `defaultOpen={true}` - Section starts expanded
- `disabled={condition}` - Section can't be opened until condition is met
- `title` - Clear step description

### Creating Conditional Logic

Show different content based on user choices:

```jsx
{/* Show detailed feedback form only if evaluation fails */}
{actions.get('evaluation_result') === 'fail' && (
  <View.Card title="Please Explain Issues">
    <Field.Textarea
      path="failure_explanation"
      label="Describe the specific problems found"
      validation={[{ required: true, min: 20 }]}
    />
  </View.Card>
)}
```

### Sticky Headers for Context

Keep important information visible as users scroll:

```jsx
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
      { title: 'Task:', value: 'Content Evaluation' },
      { title: 'Progress:', value: `${currentStep}/3`, theme: 'success' }
    ]}
  />
</View.Flex>
```

### Complete Multi-Step Example

```jsx
<View.Flex vertical={true} gap={'1.25rem'}>
  {/* Sticky Progress Header */}
  <View.Flex style={{ position: 'sticky', top: '-1rem', background: 'white', zIndex: 10, padding: '1rem' }}>
    <View.Labels
      labels={[
        { title: 'Step:', value: `${actions.get('current_step', 1)}/3` },
        { title: 'Status:', value: actions.get('overall_status', 'In Progress') }
      ]}
    />
  </View.Flex>

  {/* Step 1: Content Review */}
  <View.Collapsible title="Step 1: Review Content" defaultOpen={true}>
    <View.Alert
      variant="info"
      title="Review Instructions"
      description="Carefully read the content below before proceeding to evaluation."
    />
    <View.Card>
      <View.Markdown content={actions.get('content_to_review')} />
      <Field.Checkbox
        path="content_reviewed"
        label="✅ I have reviewed the content thoroughly"
        validation={[{ required: true }]}
      />
    </View.Card>
  </View.Collapsible>

  {/* Step 2: Evaluation (enabled after content review) */}
  <View.Collapsible 
    title="Step 2: Provide Evaluation" 
    disabled={!actions.get('content_reviewed')}
  >
    <View.Card>
      <Field.RadioGroup
        path="quality_score"
        label="Content Quality"
        options={[
          { value: 'excellent', label: '⭐ Excellent' },
          { value: 'good', label: '✅ Good' },
          { value: 'fair', label: '⚠️ Fair' },
          { value: 'poor', label: '❌ Poor' }
        ]}
        validation={[{ required: true }]}
      />

      {/* Show feedback form for non-excellent ratings */}
      {actions.get('quality_score') && actions.get('quality_score') !== 'excellent' && (
        <Field.Textarea
          path="improvement_suggestions"
          label="Suggestions for Improvement"
          placeholder="What could be improved about this content?"
          validation={[{ required: true, min: 20 }]}
        />
      )}
    </View.Card>
  </View.Collapsible>

  {/* Step 3: Final Decision */}
  <View.Collapsible 
    title="Step 3: Final Decision" 
    disabled={!actions.get('quality_score')}
  >
    <View.Card>
      <Field.RadioGroup
        path="final_decision"
        label="Final Decision"
        options={[
          { value: 'approve', label: '✅ Approve for use' },
          { value: 'revise', label: '🔄 Needs revision' },
          { value: 'reject', label: '❌ Reject completely' }
        ]}
        validation={[{ required: true }]}
      />

      <Field.Checkbox
        path="final_confirmation"
        label="✅ I confirm my evaluation is complete and accurate"
        validation={[{ required: true }]}
      />
    </View.Card>
  </View.Collapsible>
</View.Flex>
```

---

## AI Integration

**What you'll learn:** How to integrate AI-powered components for content generation, analysis, and quality checking.

### `Field.MlEndpoint` - Single AI Service Call

**Purpose:** Call one AI service to generate content, perform analysis, or automate tasks.

**Basic Usage:**
```jsx
<Field.MlEndpoint
  path="ai_analysis"
  label="🤖 Generate Quality Analysis"
  endpoint="content-analysis"
  data={{
    content: actions.get('content_to_analyze'),
    criteria: ['grammar', 'clarity', 'accuracy']
  }}
  validation={[{ required: true }]}
/>
```

**Key Properties:**
- `endpoint` - Which AI service to call
- `data` - Information sent to the AI service
- `label` - Clear description of what the AI will do
- `disabled` - Prevent calling until prerequisites are met

### `Field.MlEndpointMultiple` - Multiple AI Calls

**Purpose:** Call multiple AI services or generate multiple responses simultaneously.

**Basic Usage:**
```jsx
<Field.MlEndpointMultiple
  path="multiple_responses"
  label="⭐ Generate 3 Different Responses"
  requests={[
    {
      endpoint: 'content-generation',
      data: () => ({ prompt: actions.get('user_prompt'), style: 'formal' })
    },
    {
      endpoint: 'content-generation',
      data: () => ({ prompt: actions.get('user_prompt'), style: 'casual' })
    },
    {
      endpoint: 'content-generation',
      data: () => ({ prompt: actions.get('user_prompt'), style: 'technical' })
    }
  ]}
/>
```

### AI-Human Collaboration Pattern

1. **User provides input** → 2. **AI generates content** → 3. **Human reviews** → 4. **Human approves/edits**

```jsx
<View.Flex vertical={true} gap={'1rem'}>
  {/* Step 1: User Input */}
  <View.Card title="1. Provide Requirements">
    <Field.Text
      path="content_topic"
      label="Content Topic"
      placeholder="What should the content be about?"
      validation={[{ required: true }]}
    />
    <Field.Select
      path="content_style"
      label="Writing Style"
      options={[
        { value: 'formal', label: 'Formal' },
        { value: 'casual', label: 'Casual' },
        { value: 'technical', label: 'Technical' }
      ]}
      validation={[{ required: true }]}
    />
  </View.Card>

  {/* Step 2: AI Generation */}
  <View.Card title="2. AI Content Generation">
    <Field.MlEndpoint
      path="ai_generated_content"
      label="🤖 Generate Content"
      endpoint="content-generation"
      data={() => ({
        topic: actions.get('content_topic'),
        style: actions.get('content_style'),
        length: 'medium'
      })}
      disabled={!actions.get('content_topic') || !actions.get('content_style')}
    />
  </View.Card>

  {/* Step 3: Human Review and Edit */}
  {actions.get('ai_generated_content') && (
    <View.Card title="3. Review and Edit">
      <Field.AiEditor
        path="final_content"
        label="Review and edit the AI-generated content"
        height={400}
        aiChecks={{
          grammarScore: { enabled: true, validate: true, minScore: 4 },
          wordCount: { enabled: true, validate: true, min: 100, max: 500 }
        }}
        validation={[{ required: true }]}
      />
    </View.Card>
  )}

  {/* Step 4: Final Approval */}
  {actions.get('final_content') && (
    <View.Card title="4. Final Approval">
      <Field.RadioGroup
        path="content_approval"
        label="Content Quality Assessment"
        options={[
          { value: 'excellent', label: '⭐ Excellent - Ready to use' },
          { value: 'good', label: '✅ Good - Minor improvements made' },
          { value: 'needs_work', label: '🔄 Needs more work' }
        ]}
        validation={[{ required: true }]}
      />
    </View.Card>
  )}
</View.Flex>
```

---

## Quality Assurance

**What you'll learn:** How to implement validation, error handling, and quality checks to ensure high-quality data collection.

### Field-Level Validation

Add validation rules to individual components:

```jsx
<Field.Text
  path="response"
  label="Your Response"
  validation={[
    { required: true, message: 'Response is required' },
    { min: 10, message: 'Response must be at least 10 characters' },
    { max: 500, message: 'Response must be less than 500 characters' }
  ]}
/>
```

### Section-Level Validation

Use the `Validation` wrapper for complex rules:

```jsx
<Validation
  isValid={
    actions.get('evaluation_complete') && 
    actions.get('feedback_provided') && 
    actions.get('final_confirmed')
  }
  message="Please complete all evaluation steps before proceeding"
>
  <View.Card title="Evaluation Summary">
    {/* Card content only shows when validation passes */}
  </View.Card>
</Validation>
```

### AI Quality Checks

Configure automatic quality checking in `Field.AiEditor`:

```jsx
<Field.AiEditor
  path="response_content"
  label="Your Response"
  aiChecks={{
    wordCount: {
      enabled: true,
      validate: true,
      min: 100,
      max: 500
    },
    grammarScore: {
      enabled: true,
      validate: true,
      minScore: 4
    },
    facts: {
      enabled: true,
      sourceTexts: ['Reference material goes here'],
      maxSelectedSymbols: 1000
    }
  }}
  validation={[{ required: true }]}
/>
```

### Error Prevention Patterns

#### Conditional Field Enabling
```jsx
<Field.RadioGroup
  path="evaluation_result"
  label="Evaluation Result"
  disabled={!actions.get('content_reviewed')}
  validation={[{ required: true }]}
/>
```

#### Clear Prerequisites
```jsx
{!actions.get('guidelines_read') && (
  <View.Alert
    variant="warning"
    title="Action Required"
    description="Please read the guidelines before starting your evaluation."
  />
)}
```

#### Progress Indicators
```jsx
<View.Labels
  labels={[
    { 
      title: 'Progress:', 
      value: `${completedFields}/${totalFields}`,
      theme: completedFields === totalFields ? 'success' : 'default'
    }
  ]}
/>
```

---

## Complete Examples

**What you'll learn:** Real-world interface patterns that you can adapt for your specific labeling tasks.

### Example 1: Content Quality Evaluation

```jsx
<View.Flex vertical={true} gap={'1.5rem'}>
  {/* Header with Guidelines */}
  <View.Flex justify="space-between" align="middle">
    <View.Text variant="h2">Content Quality Evaluation</View.Text>
    <View.Link url="https://guidelines.example.com" validation={{ opened: true }}>
      📋 Evaluation Guidelines
    </View.Link>
  </View.Flex>

  {/* Task Context */}
  <View.Card flat={true}>
    <View.Labels
      labels={[
        { title: 'Domain:', value: actions.get('task.domain') },
        { title: 'Language:', value: actions.get('task.language') },
        { title: 'Type:', value: 'Quality Assessment' }
      ]}
    />
  </View.Card>

  {/* Content Display */}
  <View.Collapsible title="📄 Content to Evaluate" defaultOpen={true}>
    <View.Card>
      <View.Markdown content={actions.get('content.text')} />
    </View.Card>
  </View.Collapsible>

  {/* Evaluation Criteria */}
  <View.Collapsible title="📋 Evaluation Criteria">
    <View.Flex vertical={true} gap={'1rem'}>
      {/* Accuracy */}
      <View.Card title="Accuracy Assessment">
        <Field.RadioGroup
          path="accuracy_score"
          label="How accurate is the information?"
          options={[
            { value: 'accurate', label: '✅ Completely accurate' },
            { value: 'mostly_accurate', label: '⚠️ Mostly accurate with minor issues' },
            { value: 'inaccurate', label: '❌ Contains significant inaccuracies' }
          ]}
          validation={[{ required: true }]}
        />
        {actions.get('accuracy_score') === 'inaccurate' && (
          <Field.Textarea
            path="accuracy_issues"
            label="Describe the accuracy issues"
            validation={[{ required: true, min: 20 }]}
          />
        )}
      </View.Card>

      {/* Clarity */}
      <View.Card title="Clarity Assessment">
        <Field.RadioGroup
          path="clarity_score"
          label="How clear and understandable is the content?"
          options={[
            { value: 'very_clear', label: '⭐ Very clear and easy to understand' },
            { value: 'clear', label: '✅ Clear with good explanations' },
            { value: 'unclear', label: '❌ Confusing or unclear' }
          ]}
          validation={[{ required: true }]}
        />
      </View.Card>

      {/* Completeness */}
      <View.Card title="Completeness Assessment">
        <Field.RadioGroup
          path="completeness_score"
          label="Is the content complete and comprehensive?"
          options={[
            { value: 'complete', label: '✅ Complete and comprehensive' },
            { value: 'mostly_complete', label: '⚠️ Mostly complete, minor gaps' },
            { value: 'incomplete', label: '❌ Significant gaps or missing information' }
          ]}
          validation={[{ required: true }]}
        />
      </View.Card>
    </View.Flex>
  </View.Collapsible>

  {/* Overall Assessment */}
  <View.Collapsible 
    title="🎯 Overall Assessment" 
    disabled={!actions.get('accuracy_score') || !actions.get('clarity_score') || !actions.get('completeness_score')}
  >
    <View.Card>
      <View.Flex vertical={true} gap={'1rem'}>
        <Field.RadioGroup
          path="overall_rating"
          label="Overall Content Quality"
          options={[
            { value: 'excellent', label: '⭐ Excellent - Exceeds expectations' },
            { value: 'good', label: '✅ Good - Meets expectations' },
            { value: 'fair', label: '⚠️ Fair - Below expectations' },
            { value: 'poor', label: '❌ Poor - Major issues' }
          ]}
          validation={[{ required: true }]}
        />

        <Field.Textarea
          path="overall_feedback"
          label="Overall Feedback and Recommendations"
          placeholder="Provide specific feedback and suggestions for improvement..."
          rows={4}
          validation={[{ required: true, min: 50 }]}
        />

        <Field.Checkbox
          path="evaluation_complete"
          label="✅ I confirm my evaluation is complete and accurate"
          validation={[{ required: true }]}
        />
      </View.Flex>
    </View.Card>
  </View.Collapsible>
</View.Flex>
```

### Example 2: AI-Assisted Content Creation

```jsx
<View.Flex vertical={true} gap={'1.5rem'}>
  {/* Header */}
  <View.Text variant="h2">AI-Assisted Content Creation</View.Text>

  {/* Content Requirements */}
  <View.Card title="Content Requirements">
    <View.Flex vertical={true} gap={'1rem'}>
      <Field.Text
        path="content_topic"
        label="Content Topic"
        placeholder="What should the content cover?"
        validation={[{ required: true, min: 10 }]}
      />

      <Field.Select
        path="target_audience"
        label="Target Audience"
        options={[
          { value: 'beginners', label: 'Beginners - New to the topic' },
          { value: 'intermediate', label: 'Intermediate - Some knowledge' },
          { value: 'advanced', label: 'Advanced - Expert level' }
        ]}
        validation={[{ required: true }]}
      />

      <Field.Number
        path="target_length"
        label="Target Word Count"
        min={100}
        max={2000}
        placeholder="500"
        validation={[{ required: true, min: 100, max: 2000 }]}
      />
    </View.Flex>
  </View.Card>

  {/* AI Generation */}
  <View.Card title="AI Content Generation">
    <Field.MlEndpoint
      path="generated_content"
      label="🤖 Generate Initial Content"
      endpoint="content-generation"
      data={() => ({
        topic: actions.get('content_topic'),
        audience: actions.get('target_audience'),
        wordCount: actions.get('target_length')
      })}
      disabled={!actions.get('content_topic') || !actions.get('target_audience') || !actions.get('target_length')}
    />
  </View.Card>

  {/* Human Review and Editing */}
  {actions.get('generated_content') && (
    <View.Card title="Review and Edit Content">
      <Field.AiEditor
        path="final_content"
        label="Edit the generated content as needed"
        height={500}
        aiChecks={{
          wordCount: {
            enabled: true,
            validate: true,
            min: actions.get('target_length') * 0.8,
            max: actions.get('target_length') * 1.2
          },
          grammarScore: {
            enabled: true,
            validate: true,
            minScore: 4
          }
        }}
        validation={[{ required: true }]}
      />
    </View.Card>
  )}

  {/* Quality Assessment */}
  {actions.get('final_content') && (
    <View.Card title="Quality Assessment">
      <View.Flex vertical={true} gap={'1rem'}>
        <Field.RadioGroup
          path="content_quality"
          label="How would you rate the final content quality?"
          options={[
            { value: 'excellent', label: '⭐ Excellent - Ready for publication' },
            { value: 'good', label: '✅ Good - Meets requirements' },
            { value: 'needs_improvement', label: '🔄 Needs more improvement' }
          ]}
          validation={[{ required: true }]}
        />

        <Field.Checkbox
          path="content_approved"
          label="✅ I approve this content for use"
          validation={[{ required: true }]}
        />
      </View.Flex>
    </View.Card>
  )}
</View.Flex>
```

---

## Troubleshooting

**What you'll learn:** Common issues and how to solve them when building interfaces.

### Common Issues and Solutions

#### Problem: Components Not Showing
**Symptoms:** Components don't appear or render incorrectly
**Solutions:**
- Check that all required properties are provided
- Ensure proper JSX syntax (closing tags, proper nesting)
- Verify that `path` values are unique across all Field components

#### Problem: Validation Not Working
**Symptoms:** Form allows submission with missing/invalid data
**Solutions:**
- Add `validation={[{ required: true }]}` to required fields
- Check that validation rules are properly formatted
- Use the `Validation` wrapper for complex multi-field validation

#### Problem: Conditional Logic Not Working
**Symptoms:** Content doesn't show/hide based on user choices
**Solutions:**
- Use `actions.get('field_name')` to access field values
- Check that the condition matches the actual field values
- Use `&&` for showing content conditionally: `{condition && <Component />}`

#### Problem: Spacing and Layout Issues
**Symptoms:** Components are too close together or poorly aligned
**Solutions:**
- Use consistent `gap` values in `View.Flex` containers
- Check that `vertical={true}` is set for vertical layouts
- Use `View.Card` for visual grouping and separation

#### Problem: AI Components Not Working
**Symptoms:** AI components don't respond or show errors
**Solutions:**
- Ensure all required data is provided in the `data` property
- Check that prerequisite fields are completed before enabling AI components
- Use `disabled` logic to prevent premature AI calls

### Debugging Tips

#### Check Your Data
```jsx
{/* Temporarily display field values for debugging */}
<View.Text>Debug: {JSON.stringify(actions.get('field_name'))}</View.Text>
```

#### Validate Your Structure
```jsx
{/* Make sure your main container is properly structured */}
<View.Flex vertical={true} gap={'1.5rem'}>
  {/* All your content goes here */}
</View.Flex>
```

#### Test Validation
```jsx
{/* Add temporary validation status display */}
<View.Labels
  labels={[
    { title: 'Form Valid:', value: actions.get('form_valid') ? 'Yes' : 'No' }
  ]}
/>
```

### Best Practices Checklist

✅ **Structure**
- [ ] Main container uses `View.Flex vertical={true}`
- [ ] Consistent `gap` spacing throughout
- [ ] Proper nesting of components

✅ **Data Collection**
- [ ] All Field components have unique `path` values
- [ ] Required fields include `validation={[{ required: true }]}`
- [ ] Text inputs have appropriate length limits

✅ **User Experience**
- [ ] Clear labels and descriptions for all inputs
- [ ] Helpful placeholder text where appropriate
- [ ] Progress indicators for multi-step workflows
- [ ] Guidelines and help links provided

✅ **Quality Assurance**
- [ ] Validation at appropriate levels (field, section, form)
- [ ] Conditional logic working correctly
- [ ] AI components have proper prerequisites
- [ ] Error messages are clear and actionable

✅ **Visual Design**
- [ ] Consistent use of emojis for visual clarity
- [ ] Proper use of `View.Card` for content grouping
- [ ] Appropriate spacing and visual hierarchy
- [ ] Responsive design considerations

---

## Conclusion

You now have the knowledge to build effective labeling task interfaces using the available components. Remember:

1. **Start simple** with foundation components
2. **Add complexity gradually** with enhanced features
3. **Always validate user input** at multiple levels
4. **Use progressive disclosure** for complex workflows
5. **Test your interfaces** with real users when possible

The key to successful interface design is balancing functionality with simplicity - provide powerful tools without overwhelming your users. 