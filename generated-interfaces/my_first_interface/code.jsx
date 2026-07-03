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
