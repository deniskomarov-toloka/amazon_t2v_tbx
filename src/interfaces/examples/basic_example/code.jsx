<View.Flex vertical={true} gap={'1.25rem'}>
  <Field.AiEditor
    path="ai_editor"
    height={400}
    aiChecks={{
      wordCount: { enabled: true, validate: false, min: 10, max: 100 },
      tokenCount: { enabled: true, validate: false, min: 10, max: 100 },
      intent: { enabled: true, validate: false, prompt: '' },
      grammarScore: { enabled: true, validate: false, minScore: 4 },
      code: { enabled: true, validate: false },
      facts: { enabled: true },
      aiGenerated: { enabled: true, validate: false, originalThreshold: 0.5 }
    }}
    comments={{ enabled: true, userType: 'Writer' }}
    requiredContent={true}
  />
  <View.Tabs
    tabs={[
      {
        value: 'Checkbox',
        content: (
          <View.Flex vertical={true} gap={'1.25rem'}>
            {['value_1', 'value_2', 'value_3'].map((valuePath, index) => (
              <Field.Checkbox
                key={valuePath}
                path={`checkbox.${valuePath}`}
                label={`Value label ${index}`}
                description={`Value description ${index}`}
              />
            ))}
          </View.Flex>
        )
      },
      {
        value: 'Labels',
        content: (
          <View.Labels labels={[
            { title: 'Domain', value: 'Formal science', theme: 'default' },
            { title: 'Subdomain', value: 'Statistics', theme: 'alert' },
            { title: 'Other', value: 'Math', theme: 'success' }
          ]} />
        )
      },
      {
        value: 'Textarea',
        content: (
          <Field.Textarea
            path="textarea"
            label="Textarea labal"
            placeholder="Enter a text here..."
          />
        )
      },
      {
        value: 'Text',
        content: (
          <Field.Text
            path="text"
            label="Text label"
            placeholder="Enter a text here..."
          />
        )
      },
      {
        value: 'Select',
        content: (
          <Field.Select
            path="select"
            label="Select label"
            placeholder="Select a option"
            options={[
              { value: 'value_1', label: 'Value 1' },
              { value: 'value_2', label: 'Value 2' },
              { value: 'value_3', label: 'Value 3' }
            ]}
          />
        )
      },
      {
        value: 'Radio Group',
        content: (
          <Field.RadioGroup
            path="radio_group"
            label="Radio group label"
            options={[
              { value: 'value_1', label: 'Value 1' },
              { value: 'value_2', label: 'Value 2' },
              { value: 'value_3', label: 'Value 3' }
            ]}
          />
        )
      },
      {
        value: 'Toggle Group',
        content: (
          <Field.ToggleGroup
            path="toggle_group"
            label="Toggle group label"
            type="single"
            options={[
              { value: 'value_1', label: 'Value 1' },
              { value: 'value_2', label: 'Value 2' },
              { value: 'value_3', label: 'Value 3' }
            ]}
          />
        )
      }
    ]}
  />

  <View.Tabs
    tabs={[
      {
        value: 'Alert',
        content: (
          <View.Flex vertical={true} gap={'1.25rem'}>
            <View.Alert variant="default" title="Default alert" description="Default alert description" />
            <View.Alert variant="error" title="Error alert" description="Error alert description" />
            <View.Alert variant="info" title="Info alert" description="Info alert description" />
            <View.Alert variant="success" title="Success alert" description="Success alert description" />
            <View.Alert variant="warning" title="Warning alert" description="Warning alert description" />
          </View.Flex>
        )
      },
      {
        value: 'Text',
        content: (
          <View.Flex vertical={true}>
            <View.Text variant="h1">Heading 1</View.Text>
            <View.Text variant="h2">Heading 2</View.Text>
            <View.Text variant="h3">Heading 3</View.Text>
            <View.Text variant="h4">Heading 4</View.Text>
            <View.Text variant="large">Large</View.Text>
            <View.Text variant="p">Paragraph</View.Text>
            <View.Text variant="p" color="secondary">Paragraph secondary</View.Text>
            <View.Text variant="p" color="error">Paragraph error</View.Text>
            <View.Text variant="p">
              Paragraph with{' '}
              <View.Link url="https://toloka.ai" validation={{ opened: true }}>link</View.Link>{' '}
              and{' '}
              <View.Text variant="code">Code</View.Text>{' '}
              inside
            </View.Text>
            <View.Text variant="small">Small</View.Text>
            <View.Text variant="blockquote">Blockquote</View.Text>
          </View.Flex>
        )
      },
      {
        value: 'Video',
        content: (
          <View.Flex vertical={true}>
            <View.Video
              url="https://tlkfrontprod.azureedge.net/template-builder-production/static/file-examples/small.mp4"
              ratio={16 / 9}
              validation={{ playedFully: true }}
            />
          </View.Flex>
        )
      }
    ]}
  />

  <View.Collapsible title="Collapsible with Image">
    <View.Image src="https://tlkfrontprod.azureedge.net/template-builder-production/static/file-examples/small.png" />
  </View.Collapsible>

  <View.Card title="Card" description="Description">
    <View.Flex vertical={true} gap={'1.25rem'}>
      {data.answers.map((answer, answerIndex) => (
        <Field.Textarea
          key={answer.id}
          path={`answers.${answerIndex}.text`}
          validation={[{ required: true }]}
        />
      ))}
    </View.Flex>
  </View.Card>
</View.Flex>
