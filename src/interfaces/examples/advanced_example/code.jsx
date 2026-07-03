<Layout.StickyHeader
  header={
    <View.Flex vertical={true} gap={'1.25rem'}>
      <View.Flex justify="space-between" align="middle">
        <View.Flex vertical={true} gap={'0.5rem'}>
          <View.Text variant="h2">Content Review Pipeline</View.Text>
          <View.Text variant="small" color="secondary">
            Collaborative content evaluation with writer-editor workflow
          </View.Text>
        </View.Flex>
        {/* ========================================
           HEADER SECTION - Project Information & Metadata
            ======================================== */}
        {/* Project metadata using actions.get() to access input data */}
        <View.Labels
          labels={[
            {
              title: 'Project:',
              value: actions.get('project_name', 'Content Project'),
              theme: 'default',
            },
            {
              title: 'Domain:',
              value: actions.get('domain', 'General'),
              theme: 'success',
            },
            {
              title: 'Language:',
              value: actions.get('language', 'English'),
              theme: 'default',
            },
            {
              title: 'Current Role:',
              value: data.currentUserRole === 'writer' ? 'Writer' : 'Editor',
              theme: data.currentUserRole === 'writer' ? 'default' : 'alert',
            },
            {
              title: 'task_id:',
              value: actions.get('task_id'),
              theme: 'alert',
            },
          ]}
        />
      </View.Flex>
      <View.Divider />
      {/* ========================================
           PROGRESS INDICATOR - Shows current pipeline status
          ======================================== */}
      <View.Labels
        labels={[
          {
            title: 'Progress:',
            value: `${data.validation?.completedFields || 0}/${data.validation?.totalRequiredFields || 0} (${data.validation?.completionPercentage || 0}%)`,
            theme: data.readyForSubmission ? 'success' : 'alert',
          },
          {
            title: 'Current Phase:',
            value: data.currentPhase || 'Content Submission',
            theme: 'default',
          },
          {
            title: 'Round:',
            value: `${data.currentRound || 1}`,
            theme: 'default',
          },
        ]}
      />
    </View.Flex>
  }
>
  <View.Flex vertical={true} gap={'1.5rem'}>
    {/* ========================================
      STEP 1: CONTENT SUBMISSION
      - Writers: Interactive submission/editing
      - Editors: Read-only view of submitted content
      ======================================== */}
    <View.Collapsible
      title={
        data.currentUserRole === 'writer'
          ? 'Step 1: Content Submission'
          : 'Step 1: Submitted Content (For Review)'
      }
      defaultOpen={true}
      disabled={false}
    >
      <View.Card flat={true}>
        <View.Flex vertical={true} gap={'1.5rem'}>
          {/* Show different alerts based on user role */}
          {data.currentUserRole === 'writer' ? (
            <>
              {/* Show previous editor feedback if this is a revision round */}
              {data.previousEditorFeedback && data.currentRound > 1 && (
                <View.Card flat={true} variant="warning">
                  <View.Flex vertical={true} gap={'1rem'}>
                    <View.Text variant="h4">
                      📝 Editor Feedback from Round {data.currentRound - 1}
                    </View.Text>

                    <View.Labels
                      labels={[
                        {
                          title: 'Assessment:',
                          value:
                            data.previousEditorFeedback.assessment || 'Not specified',
                          theme: 'default',
                        },
                        {
                          title: 'Decision:',
                          value:
                            data.previousEditorFeedback.decision === 'revise'
                              ? '🔄 Needs Revision'
                              : data.previousEditorFeedback.decision === 'approve'
                                ? '✅ Approved'
                                : '❌ Rejected',
                          theme:
                            data.previousEditorFeedback.decision === 'approve'
                              ? 'success'
                              : 'alert',
                        },
                      ]}
                    />

                    {/* Display detailed editor feedback */}
                    <View.Card flat={true}>
                      <View.Text variant="small" color="secondary">
                        Detailed Feedback:
                      </View.Text>
                      <View.Markdown
                        content={
                          data.previousEditorFeedback.feedback ||
                          'No detailed feedback provided.'
                        }
                      />
                    </View.Card>

                    {/* Show action items if provided */}
                    {data.previousEditorFeedback.actionItems &&
                      data.previousEditorFeedback.actionItems.length > 0 && (
                        <View.Card flat={true}>
                          <View.Text variant="small" color="secondary">
                            Action Items to Address:
                          </View.Text>
                          <View.Flex vertical={true} gap={'0.25rem'}>
                            {data.previousEditorFeedback.actionItems.map((item, idx) => (
                              <View.Text key={idx} variant="small">
                                • {item.task}
                              </View.Text>
                            ))}
                          </View.Flex>
                        </View.Card>
                      )}
                  </View.Flex>
                </View.Card>
              )}

              <View.Alert
                variant="info"
                title={data.currentRound > 1 ? 'Content Revision' : 'Content Submission'}
                description={
                  data.currentRound > 1
                    ? 'Please revise your content based on the editor feedback above.'
                    : 'Submit your content for editorial review and evaluation.'
                }
              />
            </>
          ) : (
            <View.Alert
              variant="info"
              title="Content Submitted for Review"
              description="This is the content submitted by the writer. Review the details below before proceeding to your editorial evaluation."
            />
          )}

          {/* Content fields - Interactive for writers, read-only display for editors */}
          {data.currentUserRole === 'writer' ? (
            <>
              {/* WRITER MODE: Interactive form fields */}
              <Field.Text
                path="content.title"
                label="Content Title"
                placeholder="Enter a clear, descriptive title..."
                validation={[{ required: true, min: 5 }]}
              />

              <Field.Select
                path="content.type"
                label="Content Type"
                options={CONST.contentTypeOptions}
                validation={[{ required: true }]}
              />

              {/* Main content editor with AI assistance */}
              <Field.AiEditor
                path="content.body"
                label={data.currentRound > 1 ? 'Revised Content' : 'Content Body'}
                validation={[{ required: true }]}
                height={500}
                defaultMode="markdown"
                aiChecks={{
                  wordCount: {
                    enabled: data.test ? false : true,
                    validate: true,
                    min: 100,
                    max: 5000,
                  },
                  grammarScore: {
                    enabled: data.test ? false : true,
                    minScore: 4,
                    validate: true,
                  },
                }}
              />

              {/* Writer notes for the editor */}
              <Field.Textarea
                path="writer_notes"
                label="Notes for Editor (Optional)"
                placeholder="Any specific questions, context, or areas where you'd like focused feedback..."
                rows={3}
              />

              {/* Revision response field - only shows for revision rounds */}
              {data.currentRound > 1 && (
                <View.Card flat={true} variant="info">
                  <View.Flex vertical={true} gap={'1rem'}>
                    <View.Text variant="h4">Your Response to Editor Feedback</View.Text>
                    <Field.Textarea
                      path="writer_revision_response"
                      label="How did you address the editor's feedback?"
                      placeholder="Explain the specific changes you made based on the feedback and action items above..."
                      validation={[{ required: true, min: 30 }]}
                      rows={14}
                    />
                  </View.Flex>
                </View.Card>
              )}

              <View.Divider />

              {/* Completion checkbox for this step */}
              <Field.Checkbox
                path="stepStatus.step1Complete"
                label={
                  data.currentRound > 1
                    ? '✅ Revision is ready for re-review'
                    : '✅ Content is ready for editorial review'
                }
                validation={[{ required: true }]}
              />
            </>
          ) : (
            <>
              {/* EDITOR MODE: Read-only content display */}
              {data.contentText ? (
                <View.Card flat={true} variant="info">
                  <View.Flex vertical={true} gap={'1rem'}>
                    <View.Text variant="h4">📄 Content Details</View.Text>

                    {/* Content metadata */}
                    <View.Labels
                      labels={[
                        {
                          title: 'Title:',
                          value: data.contentTitle || 'Untitled',
                          theme: 'default',
                        },
                        {
                          title: 'Type:',
                          value: data.contentType || 'Not specified',
                          theme: 'default',
                        },
                        {
                          title: 'Word Count:',
                          value: `${data.contentWordCount || 0} words`,
                          theme: 'default',
                        },
                        {
                          title: 'Status:',
                          value:
                            data.currentRound > 1
                              ? `Revision ${data.currentRound}`
                              : 'Initial Draft',
                          theme: data.currentRound > 1 ? 'alert' : 'default',
                        },
                        {
                          title: 'Submission:',
                          value: actions.get('stepStatus.step1Complete')
                            ? '✅ Complete'
                            : '⏳ In Progress',
                          theme: actions.get('stepStatus.step1Complete')
                            ? 'success'
                            : 'alert',
                        },
                      ]}
                    />

                    {/* Render the actual content */}
                    <View.Card flat={true}>
                      <View.Text
                        variant="small"
                        color="secondary"
                        style={{ marginBottom: '0.5rem' }}
                      >
                        📝 Content:
                      </View.Text>
                      <View.Markdown content={data.contentText} />
                    </View.Card>

                    {/* Show writer's notes if provided */}
                    {data.writerNotes && (
                      <View.Card flat={true} variant={'warning'}>
                        <View.Text variant="small" color="secondary">
                          💬 Writer's Notes:
                        </View.Text>
                        <View.Text style={{ marginTop: '0.25rem' }}>
                          {data.writerNotes}
                        </View.Text>
                      </View.Card>
                    )}
                    {/* Show writer's revision response if available */}
                    {data.writerRevisionResponse && data.currentRound > 1 && (
                      <View.Card flat={true} variant={'warning'}>
                        <View.Text variant="small" color="secondary">
                          ✍️ Writer's Response to Previous Feedback:
                        </View.Text>
                        <View.Markdown
                          content={data.writerRevisionResponse}
                          style={{ marginTop: '0.25rem' }}
                        />
                      </View.Card>
                    )}
                  </View.Flex>
                </View.Card>
              ) : (
                <View.Alert
                  variant="warning"
                  title="⚠️ No Content Submitted Yet"
                  description="The writer has not yet submitted content for this step. Please wait for the writer to complete their submission before proceeding with the review."
                />
              )}
            </>
          )}
        </View.Flex>
      </View.Card>
    </View.Collapsible>

    {/* ========================================
      STEP 2: EDITORIAL REVIEW (Editor Role)
      - Content review, evaluation, and feedback
      ======================================== */}
    {data.user_role === 'editor' && (
      <View.Flex vertical={true} gap={'1.25rem'}>
        <View.Collapsible
          title="Step 2: Editorial Review"
          disabled={data.currentUserRole !== 'editor'}
          defaultOpen={true}
        >
          <View.Card flat={true}>
            <View.Flex vertical={true} gap={'1.5rem'}>
              <View.Alert
                variant="warning"
                title="Editorial Review"
                description="Review the submitted content and provide constructive feedback to help improve quality."
              />

              {/* Overall content assessment */}
              <Field.RadioGroup
                path="evaluation.overall_assessment"
                label="Overall Content Assessment"
                options={CONST.assessmentOptions}
                validation={[{ required: true }]}
              />

              {/* Detailed quality ratings */}
              <View.Flex vertical={true} gap={'1rem'}>
                <View.Text variant="h4">Detailed Quality Evaluation</View.Text>

                <Field.RadioGroup
                  path="evaluation.content_quality"
                  label="Content Quality & Accuracy"
                  options={CONST.qualityOptions}
                  validation={[{ required: true }]}
                />

                <Field.RadioGroup
                  path="evaluation.structure_organization"
                  label="Structure & Organization"
                  options={CONST.qualityOptions}
                  validation={[{ required: true }]}
                />

                <Field.RadioGroup
                  path="evaluation.language_style"
                  label="Language & Writing Style"
                  options={CONST.qualityOptions}
                  validation={[{ required: true }]}
                />
              </View.Flex>

              {/* Detailed feedback - required field */}
              <Field.Textarea
                path="evaluation.detailed_feedback"
                label="Detailed Editorial Feedback"
                placeholder={
                  data.currentRound > 1
                    ? 'Provide feedback on the revisions. What improved? What still needs work? Be specific and constructive.'
                    : 'Provide specific, constructive feedback. What works well? What needs improvement? Be detailed and helpful.'
                }
                validation={[{ required: true, min: 50 }]}
                rows={6}
              />

              {/* Action items for improvement 
                  NB: itemWithBorder={false}
              */}
              <Field.List
                path="evaluation.action_items"
                label="Action Items for Writer"
                itemWithBorder={false}
                renderItem={(itemPath) => (
                  <Field.Text
                    path={`${itemPath}.task`}
                    placeholder="Specific improvement or task needed..."
                    validation={[{ required: true, min: 10 }]}
                  />
                )}
                addButtonLabel="Add Action Item"
                maxLength={10}
              />

              <View.Divider />

              {/* Step completion checkbox */}
              <Field.Checkbox
                path="stepStatus.step2Complete"
                label="✅ I have completed my editorial review"
                validation={[{ required: true }]}
              />
            </View.Flex>
          </View.Card>
        </View.Collapsible>

        {/* ========================================
      STEP 3: FINAL DECISION (Editor Role)
      - Make final decision on content approval/revision/rejection
      ======================================== */}
        <View.Collapsible
          title="Step 3: Final Decision"
          disabled={!actions.get('stepStatus.step2Complete')}
          defaultOpen={
            actions.get('stepStatus.step2Complete') &&
            !actions.get('stepStatus.step3Complete')
          }
        >
          <View.Card flat={true}>
            <View.Flex vertical={true} gap={'1.5rem'}>
              <View.Alert
                variant="success"
                title="Final Editorial Decision"
                description="Based on your evaluation, make your final decision about this content."
              />

              {/* Summary of previous evaluation */}
              <View.Flex vertical={true} gap={'1rem'}>
                <View.Labels
                  labels={[
                    {
                      title: 'Overall Assessment:',
                      value: actions.get('evaluation.overall_assessment', 'Not set'),
                      theme: 'default',
                    },
                    {
                      title: 'Content Quality:',
                      value: actions.get('evaluation.content_quality', 'Not set'),
                      theme: 'default',
                    },
                    {
                      title: 'Structure & Organization:',
                      value: actions.get('evaluation.structure_organization', 'Not set'),
                      theme: 'default',
                    },
                    {
                      title: 'Language & Style:',
                      value: actions.get('evaluation.language_style', 'Not set'),
                      theme: 'default',
                    },
                  ]}
                />
              </View.Flex>

              {/* Final decision selection */}
              <Field.RadioGroup
                path="final_decision.verdict"
                label="Final Decision"
                options={CONST.finalDecisionOptions}
                validation={[{ required: true }]}
              />

              {/* Priority level for revisions */}
              {actions.get('final_decision.verdict') === 'revise' && (
                <Field.RadioGroup
                  path="final_decision.revision_priority"
                  label="Revision Priority Level"
                  options={CONST.priorityOptions}
                  validation={[{ required: true }]}
                />
              )}

              {/* Optional final comments */}
              <Field.Textarea
                path="final_decision.additional_comments"
                label="Additional Comments (Optional)"
                placeholder="Any final thoughts, suggestions, or context for your decision..."
                rows={3}
              />

              <View.Divider />

              {/* Final step completion */}
              <Field.Checkbox
                path="stepStatus.step3Complete"
                label="✅ I confirm my final decision is complete and accurate"
                validation={[{ required: true }]}
              />
            </View.Flex>
          </View.Card>
        </View.Collapsible>
      </View.Flex>
    )}

    {/* ========================================
      CONVERSATION HISTORY - Track all exchanges
      ======================================== */}
    {data.conversationHistory && data.conversationHistory.length > 0 && (
      <View.Collapsible
        flat={true}
        title=<View.Text variant="h4">📜 Review History</View.Text>
      >
        <View.Flex vertical={true} gap={'1rem'}>
          <View.Text variant="small" color="secondary">
            Track of all exchanges between writer and editor for this content piece
          </View.Text>

          {data.conversationHistory.map((exchange, index) => (
            <View.Card
              flat={true}
              key={index}
              variant={exchange.role === 'writer' ? 'info' : 'warning'}
            >
              <View.Flex vertical={true} gap={'0.5rem'}>
                <View.Flex justify="space-between" align="middle">
                  <View.Text variant="small" color="secondary">
                    {exchange.role === 'writer' ? '✍️ Writer' : '📝 Editor'} - Round{' '}
                    {exchange.round}
                  </View.Text>
                  <View.Text variant="small" color="secondary">
                    {exchange.timestamp}
                  </View.Text>
                </View.Flex>
                <View.Text variant="small">{exchange.summary}</View.Text>

                {/* Show key decisions or actions */}
                {exchange.decision && (
                  <View.Text variant="small" color="secondary">
                    Decision: {exchange.decision}
                  </View.Text>
                )}
              </View.Flex>
            </View.Card>
          ))}
        </View.Flex>
      </View.Collapsible>
    )}

    {/* ========================================
      COMPLETION STATUS & SUBMISSION
      - Final status display and submission readiness
      ======================================== */}
    {(actions.get('stepStatus.step1Complete') ||
      actions.get('stepStatus.step2Complete') ||
      actions.get('stepStatus.step3Complete')) && (
      <View.Card flat={true}>
        <View.Flex vertical={true} gap={'1.5rem'}>
          {/* Main status alert */}
          <View.Alert
            variant={data.readyForSubmission ? 'success' : 'info'}
            title={
              data.readyForSubmission ? '🎉 Pipeline Complete!' : '📋 Pipeline Status'
            }
            description={
              data.readyForSubmission
                ? 'All required steps have been completed. The review process is ready for submission.'
                : `Please complete all required fields. Currently ${data.validation?.missingFields?.length || 0} field(s) remaining.`
            }
          />

          {/* Missing fields breakdown - shows which step needs attention */}
          {!data.readyForSubmission &&
            data.validation?.missingFieldsByStep &&
            Object.keys(data.validation.missingFieldsByStep).length > 0 && (
              <View.Card flat={true} variant="warning">
                <View.Flex vertical={true} gap={'1rem'}>
                  <View.Text variant="h4">⚠️ Missing Required Fields</View.Text>

                  {Object.entries(data.validation.missingFieldsByStep).map(
                    ([stepKey, stepInfo]) => (
                      <View.Card flat={true} key={stepKey}>
                        <View.Flex vertical={true} gap={'0.5rem'}>
                          <View.Text variant="small" color="secondary">
                            🔸 {stepInfo.stepName}
                          </View.Text>
                          <View.Flex vertical={true} gap={'0.25rem'}>
                            {stepInfo.fields.map((field, index) => (
                              <View.Text key={index} variant="small" color="error">
                                • {field.displayName}
                                {field.minLength
                                  ? ` (minimum ${field.minLength} characters)`
                                  : ''}
                              </View.Text>
                            ))}
                          </View.Flex>
                        </View.Flex>
                      </View.Card>
                    ),
                  )}
                </View.Flex>
              </View.Card>
            )}

          {/* Final status summary */}
          <View.Labels
            labels={[
              {
                title: 'Current Role:',
                value: data.currentUserRole === 'writer' ? 'Writer' : 'Editor',
                theme: 'default',
              },
              {
                title: 'Final Decision:',
                value: actions.get('final_decision.verdict', 'Pending'),
                theme:
                  actions.get('final_decision.verdict') === 'approve'
                    ? 'success'
                    : actions.get('final_decision.verdict') === 'revise'
                      ? 'alert'
                      : 'default',
              },
              {
                title: 'Status:',
                value: data.readyForSubmission ? 'Complete ✅' : 'In Progress ⏳',
                theme: data.readyForSubmission ? 'success' : 'alert',
              },
              {
                title: 'Round:',
                value: `${data.currentRound || 1}`,
                theme: 'default',
              },
            ]}
          />
        </View.Flex>
      </View.Card>
    )}
  </View.Flex>
</Layout.StickyHeader>
