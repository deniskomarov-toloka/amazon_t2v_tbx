#!/usr/bin/env bash
# TBX Modular Template Generator
# Creates a folder with 4 separate files for better Cursor AI editing
# Usage: ./generate_template.sh <pattern_type> <folder_name>

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

PATTERN_TYPE="$1"
FOLDER_NAME="$2"

# Show usage
if [ -z "$PATTERN_TYPE" ] || [ -z "$FOLDER_NAME" ]; then
    echo -e "${BLUE}TBX Modular Template Generator${NC}"
    echo "Creates a folder with 4 separate files for better Cursor AI editing"
    echo ""
    echo -e "${YELLOW}Usage:${NC}"
    echo "  ./generate_template.sh <pattern_type> <folder_name>"
    echo ""
    echo -e "${YELLOW}Pattern Types:${NC}"
    echo "  evaluation  - Quality assessment interface"
    echo "  comparison  - Side-by-side comparison"
    echo "  workflow    - Multi-step process"
    echo "  feedback    - Text/feedback collection"
    echo "  form        - Basic form"
    echo ""
    echo -e "${YELLOW}Examples:${NC}"
    echo "  ./generate_template.sh evaluation my_quality_check"
    echo "  ./generate_template.sh comparison response_comparison"
    echo "  ./generate_template.sh workflow multi_step_review"
    echo ""
    echo -e "${YELLOW}Output Structure:${NC}"
    echo "  generated-interfaces/<folder_name>/"
    echo "    ├── code.jsx        # JSX components (editable with syntax highlighting)"
    echo "    ├── data.json       # Initial form data"
    echo "    ├── preprocess.js   # JavaScript preprocessing"
    echo "    └── constants.json  # Static configuration"
    echo ""
    echo -e "${YELLOW}After Generation:${NC}"
    echo "  1. Edit files in Cursor with full syntax support"
    echo "  2. Combine: ./combine_interface.sh generated-interfaces/<folder_name>"
    echo "  3. Validate: ./validate_interface.sh generated-interfaces/<folder_name>.json"
    exit 1
fi

# Create output folder
OUTPUT_DIR="generated-interfaces/$FOLDER_NAME"

if [ -d "$OUTPUT_DIR" ]; then
    echo -e "${YELLOW}⚠️  Folder already exists: $OUTPUT_DIR${NC}"
    read -p "Overwrite? (y/N): " confirm
    if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
        echo "Aborted."
        exit 1
    fi
    rm -rf "$OUTPUT_DIR"
fi

mkdir -p "$OUTPUT_DIR"

echo -e "${BLUE}🎯 Generating TBX Modular Template${NC}"
echo "Pattern: $PATTERN_TYPE"
echo "Output:  $OUTPUT_DIR"
echo "=================================="

# Generate files based on pattern
case "$PATTERN_TYPE" in
    "evaluation")
        # code.jsx
        cat > "$OUTPUT_DIR/code.jsx" << 'EOF'
<View.Flex vertical={true} gap={'1.5rem'}>
  {/* Instructions */}
  <View.Alert 
    variant='info' 
    title='Evaluation Task' 
    description='Review the content below and provide your assessment.' 
  />
  
  {/* Content to Review */}
  <View.Card flat={true} title='Content'>
    <View.Markdown content={CONST.contentToReview} />
  </View.Card>
  
  {/* Assessment Section */}
  <View.Card flat={true} title='Quality Assessment'>
    <View.Flex vertical={true} gap={'1rem'}>
      <Field.RadioGroup
        path='quality'
        label='Overall Quality'
        options={CONST.qualityOptions}
        validation={[{required: true}]}
      />
      
      <Field.RadioGroup
        path='accuracy'
        label='Accuracy Assessment'
        options={CONST.accuracyOptions}
        validation={[{required: true}]}
      />
      
      {/* Conditional feedback for poor ratings */}
      {(data.quality === 'poor' || data.accuracy === 'inaccurate') && (
        <Field.Textarea
          path='issues'
          label='Describe the issues found'
          validation={[{required: true, min: 20}]}
          placeholder='Please explain what problems you found...'
        />
      )}
    </View.Flex>
  </View.Card>
  
  {/* Optional Feedback */}
  <View.Card flat={true} title='Additional Feedback'>
    <Field.Textarea
      path='feedback'
      label='Additional comments (optional)'
      placeholder='Any other observations...'
    />
  </View.Card>
  
  {/* Confirmation */}
  <Field.Checkbox
    path='confirmed'
    label='✅ I confirm my evaluation is accurate and complete'
    validation={[{required: true}]}
  />
</View.Flex>
EOF

        # data.json
        cat > "$OUTPUT_DIR/data.json" << 'EOF'
{
  "quality": "",
  "accuracy": "",
  "issues": "",
  "feedback": "",
  "confirmed": false
}
EOF

        # preprocess.js
        cat > "$OUTPUT_DIR/preprocess.js" << 'EOF'
// Preprocessing logic - runs after each input change
// Use this for data shaping, NOT validation (use component validation prop instead)

return data;
EOF

        # constants.json
        cat > "$OUTPUT_DIR/constants.json" << 'EOF'
{
  "contentToReview": "# Sample Content\n\nThis is the content that needs to be evaluated for quality and accuracy.\n\nReplace this with actual content from your data pipeline.",
  "qualityOptions": [
    {"value": "excellent", "label": "🌟 Excellent - Outstanding quality"},
    {"value": "good", "label": "👍 Good - Meets standards"},
    {"value": "fair", "label": "👌 Fair - Acceptable with minor issues"},
    {"value": "poor", "label": "👎 Poor - Significant issues"}
  ],
  "accuracyOptions": [
    {"value": "accurate", "label": "✅ Accurate - Factually correct"},
    {"value": "mostly_accurate", "label": "🟡 Mostly Accurate - Minor inaccuracies"},
    {"value": "inaccurate", "label": "❌ Inaccurate - Contains errors"}
  ]
}
EOF
        ;;
        
    "comparison")
        # code.jsx
        cat > "$OUTPUT_DIR/code.jsx" << 'EOF'
<View.Flex vertical={true} gap={'1.5rem'}>
  {/* Instructions */}
  <View.Alert 
    variant='info' 
    title='Comparison Task' 
    description='Compare the two options below and select your preference.' 
  />
  
  {/* Side-by-side comparison */}
  <View.Flex gap={'1rem'}>
    <View.Card flat={true} title='Option A' style={{flex: 1}}>
      <View.Markdown content={CONST.optionA} />
    </View.Card>
    
    <View.Card flat={true} title='Option B' style={{flex: 1}}>
      <View.Markdown content={CONST.optionB} />
    </View.Card>
  </View.Flex>
  
  {/* Preference Selection */}
  <View.Card flat={true} title='Your Preference'>
    <View.Flex vertical={true} gap={'1rem'}>
      <Field.RadioGroup
        path='preference'
        label='Which option is better?'
        options={CONST.preferenceOptions}
        validation={[{required: true}]}
      />
      
      <Field.Textarea
        path='reasoning'
        label='Explain your choice'
        validation={[{required: true, min: 20}]}
        placeholder='Why did you choose this option?'
      />
      
      <Field.RadioGroup
        path='confidence'
        label='How confident are you?'
        options={CONST.confidenceOptions}
        validation={[{required: true}]}
      />
    </View.Flex>
  </View.Card>
  
  {/* Confirmation */}
  <Field.Checkbox
    path='confirmed'
    label='✅ I confirm my comparison is complete'
    validation={[{required: true}]}
  />
</View.Flex>
EOF

        # data.json
        cat > "$OUTPUT_DIR/data.json" << 'EOF'
{
  "preference": "",
  "reasoning": "",
  "confidence": "",
  "confirmed": false
}
EOF

        # preprocess.js
        cat > "$OUTPUT_DIR/preprocess.js" << 'EOF'
// Preprocessing logic - runs after each input change
return data;
EOF

        # constants.json
        cat > "$OUTPUT_DIR/constants.json" << 'EOF'
{
  "optionA": "# Option A\n\nThis is the first response to compare.\n\nReplace with actual content.",
  "optionB": "# Option B\n\nThis is the second response to compare.\n\nReplace with actual content.",
  "preferenceOptions": [
    {"value": "a_much_better", "label": "A is much better"},
    {"value": "a_slightly_better", "label": "A is slightly better"},
    {"value": "tie", "label": "About the same"},
    {"value": "b_slightly_better", "label": "B is slightly better"},
    {"value": "b_much_better", "label": "B is much better"}
  ],
  "confidenceOptions": [
    {"value": "high", "label": "🟢 High confidence"},
    {"value": "medium", "label": "🟡 Medium confidence"},
    {"value": "low", "label": "🔴 Low confidence"}
  ]
}
EOF
        ;;
        
    "workflow")
        # code.jsx
        cat > "$OUTPUT_DIR/code.jsx" << 'EOF'
<View.Flex vertical={true} gap={'1.5rem'}>
  {/* Progress indicator */}
  <View.Labels
    labels={[
      {
        title: 'Progress', 
        value: `${[data.step1_complete, data.step2_complete, data.step3_complete].filter(Boolean).length} of 3 steps`,
        theme: data.step3_complete ? 'success' : 'default'
      }
    ]}
  />
  
  {/* Step 1: Initial Review */}
  <View.Collapsible title='Step 1: Initial Review' defaultOpen={true}>
    <View.Card flat={true}>
      <View.Flex vertical={true} gap={'1rem'}>
        <View.Markdown content={CONST.step1Instructions} />
        
        <Field.Text
          path='reviewer_name'
          label='Your Name'
          validation={[{required: true}]}
        />
        
        <Field.Checkbox
          path='step1_complete'
          label='✅ Step 1 complete'
        />
      </View.Flex>
    </View.Card>
  </View.Collapsible>
  
  {/* Step 2: Detailed Analysis */}
  <View.Collapsible 
    title='Step 2: Detailed Analysis' 
    disabled={!data.step1_complete}
  >
    <View.Card flat={true}>
      <View.Flex vertical={true} gap={'1rem'}>
        <Field.RadioGroup
          path='analysis_rating'
          label='Analysis Result'
          options={CONST.analysisOptions}
          validation={[{required: data.step1_complete}]}
        />
        
        <Field.Textarea
          path='analysis_notes'
          label='Analysis Notes'
          placeholder='Document your findings...'
        />
        
        <Field.Checkbox
          path='step2_complete'
          label='✅ Step 2 complete'
        />
      </View.Flex>
    </View.Card>
  </View.Collapsible>
  
  {/* Step 3: Final Approval */}
  <View.Collapsible 
    title='Step 3: Final Approval' 
    disabled={!data.step2_complete}
  >
    <View.Card flat={true}>
      <View.Flex vertical={true} gap={'1rem'}>
        <View.Alert
          variant='warning'
          title='Final Step'
          description='Please review all previous steps before final approval.'
        />
        
        <Field.Checkbox
          path='step3_complete'
          label='✅ Final approval granted'
          validation={[{required: data.step2_complete}]}
        />
      </View.Flex>
    </View.Card>
  </View.Collapsible>
</View.Flex>
EOF

        # data.json
        cat > "$OUTPUT_DIR/data.json" << 'EOF'
{
  "reviewer_name": "",
  "step1_complete": false,
  "analysis_rating": "",
  "analysis_notes": "",
  "step2_complete": false,
  "step3_complete": false
}
EOF

        # preprocess.js
        cat > "$OUTPUT_DIR/preprocess.js" << 'EOF'
// Preprocessing logic for workflow
return data;
EOF

        # constants.json
        cat > "$OUTPUT_DIR/constants.json" << 'EOF'
{
  "step1Instructions": "Review the task requirements and provide your information.",
  "analysisOptions": [
    {"value": "approved", "label": "✅ Approved - Meets all criteria"},
    {"value": "needs_revision", "label": "🔄 Needs Revision - Minor changes required"},
    {"value": "rejected", "label": "❌ Rejected - Does not meet criteria"}
  ]
}
EOF
        ;;
        
    "feedback")
        # code.jsx
        cat > "$OUTPUT_DIR/code.jsx" << 'EOF'
<View.Flex vertical={true} gap={'1.5rem'}>
  {/* Instructions */}
  <View.Alert 
    variant='info' 
    title='Feedback Collection' 
    description='Please provide your detailed feedback on the content below.' 
  />
  
  {/* Content Display */}
  <View.Card flat={true} title='Content'>
    <View.Markdown content={CONST.content} />
  </View.Card>
  
  {/* Rating */}
  <View.Card flat={true} title='Overall Rating'>
    <Field.RadioGroup
      path='rating'
      label='How would you rate this content?'
      options={CONST.ratingOptions}
      validation={[{required: true}]}
    />
  </View.Card>
  
  {/* Detailed Feedback */}
  <View.Card flat={true} title='Detailed Feedback'>
    <View.Flex vertical={true} gap={'1rem'}>
      <Field.AiEditor
        path='detailed_feedback'
        label='Your Feedback'
        validation={[{required: true}]}
        aiChecks={{
          wordCount: {enabled: true, validate: true, min: 50},
          grammarScore: {enabled: true, validate: true, minScore: 3}
        }}
        height={200}
      />
      
      <Field.Textarea
        path='suggestions'
        label='Improvement Suggestions'
        placeholder='What could be improved?'
      />
    </View.Flex>
  </View.Card>
  
  {/* Confirmation */}
  <Field.Checkbox
    path='confirmed'
    label='✅ I confirm my feedback is complete'
    validation={[{required: true}]}
  />
</View.Flex>
EOF

        # data.json
        cat > "$OUTPUT_DIR/data.json" << 'EOF'
{
  "rating": "",
  "detailed_feedback": {
    "content": ""
  },
  "suggestions": "",
  "confirmed": false
}
EOF

        # preprocess.js
        cat > "$OUTPUT_DIR/preprocess.js" << 'EOF'
// Preprocessing logic
return data;
EOF

        # constants.json
        cat > "$OUTPUT_DIR/constants.json" << 'EOF'
{
  "content": "# Content for Review\n\nThis is the content that requires feedback.\n\nReplace with actual content from your pipeline.",
  "ratingOptions": [
    {"value": "5", "label": "⭐⭐⭐⭐⭐ Excellent"},
    {"value": "4", "label": "⭐⭐⭐⭐ Good"},
    {"value": "3", "label": "⭐⭐⭐ Average"},
    {"value": "2", "label": "⭐⭐ Below Average"},
    {"value": "1", "label": "⭐ Poor"}
  ]
}
EOF
        ;;
        
    "form")
        # code.jsx
        cat > "$OUTPUT_DIR/code.jsx" << 'EOF'
<View.Flex vertical={true} gap={'1.5rem'}>
  {/* Header */}
  <View.Alert 
    variant='info' 
    title='Form Title' 
    description='Please fill out all required fields.' 
  />
  
  {/* User Information */}
  <View.Card flat={true} title='User Information'>
    <View.Flex vertical={true} gap={'1rem'}>
      <Field.Text
        path='name'
        label='Full Name'
        validation={[{required: true}]}
      />
      
      <Field.Text
        path='email'
        label='Email'
        validation={[{required: true, type: 'email'}]}
      />
      
      <Field.Select
        path='role'
        label='Role'
        options={CONST.roleOptions}
        validation={[{required: true}]}
      />
    </View.Flex>
  </View.Card>
  
  {/* Additional Info */}
  <View.Card flat={true} title='Additional Information'>
    <View.Flex vertical={true} gap={'1rem'}>
      <Field.Textarea
        path='comments'
        label='Comments'
        placeholder='Any additional information...'
      />
      
      <Field.Checkbox
        path='subscribe'
        label='Subscribe to updates'
      />
    </View.Flex>
  </View.Card>
</View.Flex>
EOF

        # data.json
        cat > "$OUTPUT_DIR/data.json" << 'EOF'
{
  "name": "",
  "email": "",
  "role": "",
  "comments": "",
  "subscribe": false
}
EOF

        # preprocess.js
        cat > "$OUTPUT_DIR/preprocess.js" << 'EOF'
// Preprocessing logic
return data;
EOF

        # constants.json
        cat > "$OUTPUT_DIR/constants.json" << 'EOF'
{
  "roleOptions": [
    {"value": "reviewer", "label": "Reviewer"},
    {"value": "admin", "label": "Administrator"},
    {"value": "contributor", "label": "Contributor"},
    {"value": "observer", "label": "Observer"}
  ]
}
EOF
        ;;
        
    *)
        echo -e "${RED}❌ Unknown pattern: $PATTERN_TYPE${NC}"
        echo "Available patterns: evaluation, comparison, workflow, feedback, form"
        rm -rf "$OUTPUT_DIR"
        exit 1
        ;;
esac

echo -e "${GREEN}✅ Template generated successfully!${NC}"
echo ""
echo -e "${BLUE}📁 Created files:${NC}"
ls -la "$OUTPUT_DIR"
echo ""
echo -e "${YELLOW}📝 Next steps:${NC}"
echo "1. Edit files in Cursor with full syntax highlighting:"
echo "   - $OUTPUT_DIR/code.jsx      (JSX components)"
echo "   - $OUTPUT_DIR/data.json     (initial form data)"
echo "   - $OUTPUT_DIR/preprocess.js (preprocessing logic)"
echo "   - $OUTPUT_DIR/constants.json (static config)"
echo ""
echo "2. Combine into single JSON:"
echo "   ./combine_interface.sh $OUTPUT_DIR"
echo ""
echo "3. Validate the combined output:"
echo "   ./validate_interface.sh ${OUTPUT_DIR}.json"
echo ""
echo "4. Test in TBX Editor:"
echo "   https://tlkfrontprodpublic.blob.core.windows.net/template-builder-production/tb-jsx.editor/index.html"
