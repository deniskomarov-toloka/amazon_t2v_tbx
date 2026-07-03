<View.Flex vertical={true} gap={'1.5rem'}>
  {/* Instructions */}
  <View.Alert
    variant='info'
    title='Compare the two generated videos'
    description='First watch BOTH videos in full — the questions unlock once you have. After that you can replay freely. Read the short guidance before each block, then answer the questions one by one.'
  />

  {/* Video description (always visible) */}
  <View.Card flat={true} title='Video description'>
    <View.Markdown content={data.prompt} />
  </View.Card>

  {/* Side-by-side videos (always visible) */}
  <View.Flex gap={'1rem'}>
    <View.Card flat={true} title='🅰️ Video A'>
      <View.Video url={data.video_a} ratio={16 / 9} validation={{ playedFully: true }} />
    </View.Card>
    <View.Card flat={true} title='🅱️ Video B'>
      <View.Video url={data.video_b} ratio={16 / 9} validation={{ playedFully: true }} />
    </View.Card>
  </View.Flex>

  {/* Questions unlock only after BOTH videos have been watched in full at least once */}
  {(data.__playedFullyVideosMap
    && data.__playedFullyVideosMap[encodeURIComponent(data.video_a)]
    && data.__playedFullyVideosMap[encodeURIComponent(data.video_b)]) ? (
    <View.Flex vertical={true} gap={'1.5rem'}>
      {/* Breadcrumb of blocks */}
      <View.Flex gap={'0.5rem'}>
        {CONST.blocks.map((b, i) => (
          <View.Text
            key={b}
            variant='small'
            color={((data.step || 0) < CONST.steps.length ? CONST.steps[(data.step || 0)].block : 'Overall') === b ? 'primary' : 'secondary'}
          >
            {(i > 0 ? '→  ' : '') + b}
          </View.Text>
        ))}
      </View.Flex>

      {/* Current step: either a guidance intro or a question (one at a time) */}
      {CONST.steps.map((s, i) => (
        (data.step || 0) === i ? (
          s.type === 'intro' ? (
            <View.Card key={`step-${i}`} flat={true} title={s.title}>
              <View.Markdown content={s.body} />
            </View.Card>
          ) : (
            <View.Card key={`step-${i}`} flat={true} title={`${s.title}  (${s.counter})`}>
              <Field.RadioGroup path={s.path} validation={[{ required: true }]}
                label={s.description}
                hint={`Example: ${s.example}`}
                options={CONST.choiceOptions}
              />
            </View.Card>
          )
        ) : null
      ))}

      {/* Mandatory justification — shown only after all steps are complete */}
      {(data.step || 0) >= CONST.steps.length ? (
        <View.Card flat={true} title='Justification'>
          <Field.Textarea path='comment' validation={[{ required: true, min: 30, message: 'Please describe your reasoning in at least 30 characters.' }]}
            label='Why did you make these choices? Describe the reasoning that justifies your selection.'
            placeholder='e.g. Video A follows the description more closely and has sharper detail, while Video B shows flickering in the background.'
          />
        </View.Card>
      ) : null}

      {/* Navigation */}
      <View.Flex gap={'1rem'}>
        <View.ActionButton
          label='← Back'
          variant='outline'
          disabled={(data.step || 0) === 0}
          action={() => actions.set('step', (data.step || 0) - 1)}
        />
        {(data.step || 0) < CONST.steps.length ? (
          <View.ActionButton
            label='Next →'
            variant='default'
            disabled={CONST.steps[(data.step || 0)].type === 'question' && !data[CONST.steps[(data.step || 0)].path]}
            action={() => actions.set('step', (data.step || 0) + 1)}
          />
        ) : null}
      </View.Flex>
    </View.Flex>
  ) : (
    <View.Alert
      variant='warning'
      title='Watch both videos first to unlock the questions'
    />
  )}
</View.Flex>
