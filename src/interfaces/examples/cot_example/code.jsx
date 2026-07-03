<View.Flex vertical={true} gap={'1.25rem'}>
  <View.Card title={''}>
    <View.Flex vertical={true} gap={'1.25rem'}>
      <View.Link
        url={
          'https://mindrift.zendesk.com/hc/en-us/articles/18884212389148-CoT-Graphic-Interpretation'
        }
        validation={{ opened: false }}
      >
        {'Guidelines'}
      </View.Link>
      <View.Link
        url={'https://discord.com/channels/1161728470934622330/1361705268571803689'}
        validation={{ opened: false }}
      >
        {'Discord: #updates-graph-v2'}
      </View.Link>
      <View.Link
        url={'https://discord.com/channels/1161728470934622330/1361705371097370786'}
        validation={{ opened: false }}
      >
        {'Discord: #chat-graph-v2'}
      </View.Link>
    </View.Flex>
  </View.Card>
  {actions.get('evaledit_comment') && (
    <View.Alert
      variant={'error'}
      icon={false}
      description={
        <View.Flex vertical={true} gap={'1.25rem'}>
          <View.Text variant="h2">{'Review Results'}</View.Text>
          <View.Row gap={'1.25rem'}>
            <View.Col span={12}>
              <View.Alert
                variant={'error'}
                icon={false}
                title={'Item ID'}
                description={actions.get('original_item_id')}
              />
            </View.Col>
            <View.Col span={12}>
              <View.Alert
                variant={'error'}
                icon={false}
                title={'Reviewer ID'}
                description={actions.get('reviewer_id')}
              />
            </View.Col>
          </View.Row>
          <View.Divider />
          <View.Alert
            variant={'error'}
            icon={true}
            title={'Reviewer Comment'}
            description={actions.get('evaledit_comment')}
          />
        </View.Flex>
      }
    />
  )}
  <View.Alert
    variant={'info'}
    title={'Short instruction:'}
    description={
      <View.Markdown
        content={
          '**CoT Generation: Final CoT Generation Task**  \n- Focus on generating the **final CoT** from the prepopulated data. Use the draft only for context. Rewrite, expand, or discard as needed.  \n- Ensure the CoT is **accurate, complete, and step-based** – ready for model training.\n\n**Do the following:**  \n- Check that reasoning flows logically and supports the correct answer  \n- **Use the grammar tool** in each step (this is required)\n- **Manually double-check punctuation** in each step  \n- Use clear, descriptive language – **no instructional phrasing**  \n- Tick both checkboxes before submitting:  \n  - *I have checked all numbers in CoT steps*  \n  - *I am confirming that CoT Logic is correct*\n\n**Make sure to correct:**  \n- Instructional language ("Check", "Look at", etc.) and language errors  \n- Incorrect subplot, labels, or axis references  \n- Missing steps, vague estimates, lacking justifications, or flawed logic  \n- Contradictions or unnecessary filler in CoT'
        }
      />
    }
  />

  <View.Text variant={'h2'}>{'Write Chain of Thought'}</View.Text>
  <View.Text variant={'h4'}>{'Examine Figure'}</View.Text>
  <View.Card title={''}>
    <View.Flex vertical={true} gap={'1.25rem'}>
      <View.Image style={{ width: '400px' }} src={actions.get('image_url')} />
      <View.Alert
        variant={'info'}
        title={'Plot Description'}
        description={actions.get('plot_desc')}
      />
      <View.Markdown
        content={
          '\n\n_**Note:** This is just a brief overview of the figure, and may not be entirely accurate. This information is simply meant to enhance your understanding of the visual._'
        }
      />
    </View.Flex>
  </View.Card>
  <View.Card title={'Article PDF'}>
    <View.Flex vertical={true} gap={'1.25rem'}>
      <View.Labels
        labels={[
          { title: 'Page', value: actions.get('figure_page_number') },
          { title: 'Figure Number', value: actions.get('figure_number') },
        ]}
      />
      <View.Link
        url={'https://arxiv.org/pdf/' + actions.get('article_id')}
        validation={{ opened: false }}
      >
        {'Link to PDF'}
      </View.Link>
      <View.ActionButton
        label={'Click me for a short summary of the PDF'}
        action={async () => {
          await actions.llm({
            path: 'llm_summary',
            prompt: `Please provide me a summary on this PDF: ${'https://arxiv.org/pdf/' + actions.get('article_id')}`,
            model_id: 'amazon-bedrock-nova-pro-v1',
            temperature: 0.8,
            response_format_type: 'json_object',
          });
        }}
      />
      {actions.get('llm_summary') && (
        <View.Card title={'Summary'}>
          <View.Markdown content={actions.get('llm_summary')} />
        </View.Card>
      )}
    </View.Flex>
  </View.Card>
  <View.Divider />
  <View.Text variant="h4">{'Question & Answer'}</View.Text>
  <View.Card title={'Q&A Pair'}>
    <View.Flex vertical={true} gap={'1.25rem'}>
      <View.Row gap={'1.25rem'}>
        <View.Col span={4}>
          <View.Text>{'Question'}</View.Text>
        </View.Col>
        <View.Col span={20}>
          <Field.AiEditor
            path={'ann_prompt'}
            disabled={actions.get('qa_pair_validity') != 'needs_edit'}
            height={300}
            requiredContent={true}
            aiChecks={{
              grammarScore: {
                enabled: actions.get('qa_pair_validity') == 'needs_edit',
                minScore: 4,
                validate: actions.get('qa_pair_validity') == 'needs_edit',
              },
            }}
          />
        </View.Col>
      </View.Row>
      <View.Row gap={'1.25rem'}>
        <View.Col span={4}>
          <View.Text>{'Answer'}</View.Text>
        </View.Col>
        <View.Col span={20}>
          <Field.AiEditor
            path={'ann_answer'}
            height={300}
            requiredContent={true}
            disabled={actions.get('qa_pair_validity') != 'needs_edit'}
            aiChecks={{
              grammarScore: {
                enabled: false,
                minScore: 4,
                validate: false,
              },
            }}
          />
        </View.Col>
      </View.Row>
      {actions.get('ann_llm_answer') && (
        <View.Alert
          variant={'info'}
          title={'Model Answer'}
          description={actions.get('ann_llm_answer')}
        />
      )}
      <Field.RadioGroup
        path={'qa_pair_validity'}
        label={'Are both the question and answer valid and based on the visual data?'}
        options={[
          {
            label:
              '✅ Yes – the question and answer are accurate and clearly based on the graph(s)',
            value: 'valid',
          },
          {
            label:
              '✏️ Minor issues – allow editing to fix small problems in the question or answer',
            value: 'needs_edit',
          },
        ]}
        validation={[{ required: true }]}
      />
      {actions.get('qa_pair_validity') === 'needs_polishing' && (
        <Field.Textarea
          path={'qna_problem_explanation'}
          label={'Please explain what is wrong with the question–answer pair'}
          placeholder={
            'Describe the issue (e.g., mismatch with graph, unclear phrasing, wrong answer)'
          }
          rows={4}
          validation={[{ required: true }]}
        />
      )}
    </View.Flex>
  </View.Card>
  {actions.get('qa_pair_validity') != 'needs_polishing' && (
    <>
      <View.Text variant="h4">
        {'Describe specific data from Graph for Chain of Thought'}
      </View.Text>
      <View.Card title={''}>
        <View.Flex vertical={true} gap={'1.25rem'}>
          <View.Alert
            variant={'info'}
            icon={false}
            title={'Short instruction:'}
            description={
              <View.Markdown
                content={
                  'Please describe what specific data must be extracted from the graph(s) in order to answer the question.\nList each required item or variable. Do not provide the actual values — only explain what needs to be picked from the plot(s) and where or how it should be identified (e.g., line intersections, peak values, number of visual markers, etc.).\n\nYou can use this optional format for clarity:\n- Variable name or description: how/where to find it on the graph\n- …\n\nAlso, include any special notes, such as if the value must be estimated, rounded, visually counted, filtered by color or symbol, etc.\n\n✅ Example:\n- Number of blue circles touching the torsion curve: Count how many distinct blue circles lie directly on the torsion curve in subplot A.\n- Peak value of the red line in subplot B: Identify the highest point reached by the red line and note the y-axis value.\n- Time at which the green curve crosses zero: Locate the x-axis position where the green curve crosses the horizontal axis.'
                }
              />
            }
          />
          <Field.AiEditor
            path={'required_data_picked_from_graphs'}
            label={'Variables (required for "creation draft CoT"):'}
            height={250}
            requiredContent={true}
            aiChecks={{
              grammarScore: {
                enabled: false,
                minScore: 3,
                validate: false,
              },
            }}
          />
        </View.Flex>
      </View.Card>
      <View.Text variant="h4">{'Enter Chain of Thought'}</View.Text>
      <View.Card title={''}>
        <View.Flex vertical={true} gap={'1.25rem'}>
          <View.Card title={'Chain of Thought'} flat>
            <View.Flex vertical={true} gap={'1.25rem'}>
              {actions.get('qa_pair.cot', []).length === 0 && (
                <Field.MlEndpoint
                  path={'qa_pair.cot'}
                  label={'Create draft cot'}
                  endpoint={'amz-cot-synt-gen'}
                  function={'cot_synt_gen'}
                  data={{
                    image: actions.get('image_url'),
                    question: actions.get('ann_prompt.content'),
                    additional_data_about_chart: actions.get(
                      'required_data_picked_from_graphs.content',
                    ),
                  }}
                  postProcessingFn={(response) =>
                    (response?.generated_cot ?? []).map((elem) => ({ content: elem }))
                  }
                />
              )}
              <Field.List
                path={'qa_pair.cot'}
                itemWithBorder={false}
                gap={'1.25rem'}
                renderItem={(basePath, item, index) => (
                  <View.Flex vertical={true} gap={'0.75rem'}>
                    <Field.AiEditor
                      path={`${basePath}`}
                      label={`CoT step #${index + 1}`}
                      height={200}
                      requiredContent={true}
                      aiChecks={{
                        grammarScore: {
                          enabled: true,
                          minScore: 4,
                          validate: true,
                        },
                      }}
                    />

                    <Field.Checkbox
                      path={`${basePath}.is_regenerate`}
                      label={`regenerate chain below (CoT step #${index + 1} will be saved)`}
                    />
                    {actions.get(`${basePath}.is_regenerate`) && (
                      <>
                        {actions.get('required_data_picked_from_graphs.content') ? (<View.ActionButton
                        label={'Regenerate CoT from selected step'}
                          action={async () => {
                          
                          if (confirm(`Are you sure you want to regenerate the CoT from CoT step #${index+1}?`)) {
                            const currentList = actions.get('qa_pair.cot', []);
                            actions.set('__previous_cot', currentList);
                            const correctSteps = currentList.slice(0, index + 1);

                            actions.set('qa_pair.cot', correctSteps);

                            const correctStepsTexts = correctSteps
                              .map((elem) => elem.content ?? '')
                              .join('\n');

                            const initialCotStepsTexts = currentList
                              .map((elem) => elem.content ?? '')
                              .join('\n');

                  
                            const response = await actions.mlEndpoint({
                              path: '__regenerated_cot',
                              endpoint: 'amz-cot-synt-gen',
                              function: 'cot_synt_regen',
                              data: {
                                image: actions.get('image_url'),
                                question: actions.get('ann_prompt.content'),
                                additional_data_about_chart: correctStepsTexts,
                                initial_cot: initialCotStepsTexts,
                                revised_cot: correctStepsTexts,
                              },
                            });

                            const generetedCot = (response?.generated_cot ?? []).map(
                              (elem) => ({ content: elem }),
                            );
                            
                            const generatedAnswer = response?.answer ?? '';
                            actions.set('__llm_current_answer', generatedAnswer);

                            // const generatedSteps = generetedCot.slice(index + 1);
                            // actions.set('qa_pair.cot', [...correctSteps, ...generatedSteps]);
                            actions.set('qa_pair.cot', generetedCot);
                          } else {
                            console.log('Cancelled regeneration');
                          }
                        }}
                        variant={'default'}
                        />
                        ) : (
                    <View.Text style={{ color: 'red', fontWeight: 'bold', marginTop: '8px' }}>
                      ⚠️ Fill in the <strong>"Variables"</strong> field to regenerate data
                    </View.Text>
                        )}
                      </>
                    )}
                  </View.Flex>
                )}
                validation={[
                  { required: true },
                  { type: 'array', min: 4, message: 'Min 4 CoTs' },
                ]}
              />

              {actions.get('__previous_cot') && (
                <View.ActionButton
                  label={'Revert to CoT before regeneration'}
                  action={async () => {
                    if (confirm('Revert to the previous CoT?')) {
                      const previousList = actions.get('__previous_cot', []);
                      actions.set('qa_pair.cot', previousList);
                    }
                  }}
                  variant={'default'}
                />
              )}

              {actions.get('__llm_current_answer') && (
                <View.Card title={'Model Answer after CoT Regeneration'}>
                  <View.Text>{actions.get('__llm_current_answer')}</View.Text>
                </View.Card>
              )}
            </View.Flex>
          </View.Card>
        </View.Flex>
      </View.Card>
      <View.Text variant="h4">{'Validate Chain of Thought'}</View.Text>
      <View.Card title={''}>
        <View.Flex vertical={true} gap={'1.25rem'}>
          <View.Markdown content={'**Make sure to hit the following points**'} />
          <Field.Checkbox
            path={'numbers_checked'}
            label={'I have checked all numbers in CoT steps'}
            validation={[{ required: true }]}
          />
          {actions.get('numbers_checked') && (
            <View.Flex vertical={true} gap={'1.25rem'}>
              <Field.Checkbox
                path={'cot_logic_checked'}
                label={'I am confirming that CoT Logic is correct'}
                validation={[{ required: true }]}
              />
            </View.Flex>
          )}
        </View.Flex>
      </View.Card>
    </>
  )}
</View.Flex>
