<View.Flex vertical={true} gap={'1.5rem'} style={{ padding: '1rem 0 3rem 0', fontSize: '1.125rem' }}>
  {/* ---------- Progress breadcrumb ---------- */}
  <View.Flex gap={'0.5rem'} wrap={true} justify="center">
    {CONST.stages.map((label, i) => (
      <View.Text key={label} color={(data.stage || 0) === i ? 'primary' : 'secondary'}>
        {(i > 0 ? '→ ' : '') + label}
      </View.Text>
    ))}
  </View.Flex>

  {/* ==================== 1 · INTRO (stage 0) ==================== */}
  {(data.stage || 0) === 0 ? (
    <View.Flex vertical={true} gap={'1.5rem'} style={{ padding: '0 20%' }}>
      <View.Card flat={true} variant="info" title="What you will do">
        <View.Markdown content={CONST.intro} />
      </View.Card>
      <View.Flex justify="center">
        <View.ActionButton label="Got it! →" variant="default" action={() => actions.set('stage', 1)} />
      </View.Flex>
    </View.Flex>
  ) : null}

  {/* ==================== 2 · RULES (stage 1) ==================== */}
  {(data.stage || 0) === 1 ? (
    <View.Flex vertical={true} gap={'1.5rem'} style={{ padding: '0 20%' }}>
      <View.Card flat={true} variant="info" title="How the onboarding works">
        <View.Markdown content={CONST.rules} />
      </View.Card>
      <View.Flex justify="center">
        <View.ActionButton label="Let's go! →" variant="default" action={() => actions.set('stage', 2)} />
      </View.Flex>
    </View.Flex>
  ) : null}

  {/* ==================== 3 · DEMO (stage 2) ==================== */}
  {(data.stage || 0) === 2 ? (() => {
    const step = data.demo_step || 0;
    const lbl = (v) => v === 'a' ? '🅰️ Video A' : v === 'b' ? '🅱️ Video B' : '🟰 Tie / Equal';
    const watched = data.__playedFullyVideosMap
      && data.__playedFullyVideosMap[encodeURIComponent(CONST.demo.video_a)]
      && data.__playedFullyVideosMap[encodeURIComponent(CONST.demo.video_b)];
    return (
      <View.Flex vertical={true} gap={'1.5rem'}>
        <View.Flex vertical={true} style={{ padding: '0 20%' }}>
          <View.Card flat={true} title="Video description">
            <View.Text>{CONST.demo.prompt}</View.Text>
          </View.Card>
        </View.Flex>

        <View.Flex gap={'1rem'} align="stretch" wrap={true} style={{ padding: '0 10%' }}>
          <View.Card flat={true} title="🅰️ Video A" style={{ flex: 1, minWidth: '260px' }}>
            <View.Video url={CONST.demo.video_a} ratio={16 / 9} validation={{ playedFully: true }} />
          </View.Card>
          <View.Card flat={true} title="🅱️ Video B" style={{ flex: 1, minWidth: '260px' }}>
            <View.Video url={CONST.demo.video_b} ratio={16 / 9} validation={{ playedFully: true }} />
          </View.Card>
        </View.Flex>

        {watched ? (
          <View.Flex vertical={true} gap={'1.5rem'} style={{ padding: '0 20%' }}>
            {step < 4 ? (() => {
              const m = CONST.metrics[step];
              return (
                <View.Card flat={true} title={'Demo · Metric ' + (step + 1) + ' of 4 — ' + m.title}>
                  <View.Flex vertical={true} gap={'0.75rem'}>
                    <View.Alert variant="info" title={m.question} description={m.example} />
                    <View.Alert variant="success" title={'Correct answer: ' + lbl(CONST.demo.gt[m.path])} description={CONST.demo.reasons[m.path]} />
                  </View.Flex>
                </View.Card>
              );
            })() : (
              <View.Card flat={true} title="Demo · Final step — your comment">
                <View.Flex vertical={true} gap={'0.75rem'}>
                  <View.Alert variant="info" title="Every pair ends with a short comment" description={CONST.comment_intro} />
                  <View.Alert variant="success" title="Example comment" description={CONST.demo.comment} />
                </View.Flex>
              </View.Card>
            )}

            <View.Flex gap={'1rem'} justify="center">
              <View.ActionButton label="← Back" variant="outline" disabled={step === 0} action={() => actions.set('demo_step', step - 1)} />
              {step < 4 ? (
                <View.ActionButton label="Next →" variant="default" action={() => actions.set('demo_step', step + 1)} />
              ) : (
                <View.ActionButton label="Start practice →" variant="default" action={() => actions.set('stage', 3)} />
              )}
            </View.Flex>
          </View.Flex>
        ) : (
          <View.Flex vertical={true} style={{ padding: '0 20%' }}>
            <View.Alert variant="warning" title="Watch both videos in full to continue" />
          </View.Flex>
        )}
      </View.Flex>
    );
  })() : null}

  {/* ==================== 4-6 · TASKS (stage 3..5) ==================== */}
  {((data.stage || 0) >= 3 && (data.stage || 0) <= 5) ? (() => {
    const stage = data.stage || 0;
    const t = stage - 2;
    const task = CONST.tasks[t - 1];
    const step = data['t' + t + '_step'] || 0;
    const lbl = (v) => v === 'a' ? '🅰️ Video A' : v === 'b' ? '🅱️ Video B' : '🟰 Tie / Equal';
    const watched = data.__playedFullyVideosMap
      && data.__playedFullyVideosMap[encodeURIComponent(task.video_a)]
      && data.__playedFullyVideosMap[encodeURIComponent(task.video_b)];
    return (
      <View.Flex vertical={true} gap={'1.5rem'}>
        <View.Flex vertical={true} style={{ padding: '0 20%' }}>
          <View.Card flat={true} title="Video description">
            <View.Text>{task.prompt}</View.Text>
          </View.Card>
        </View.Flex>

        <View.Flex gap={'1rem'} align="stretch" wrap={true} style={{ padding: '0 10%' }}>
          <View.Card flat={true} title="🅰️ Video A" style={{ flex: 1, minWidth: '260px' }}>
            <View.Video url={task.video_a} ratio={16 / 9} validation={{ playedFully: true }} />
          </View.Card>
          <View.Card flat={true} title="🅱️ Video B" style={{ flex: 1, minWidth: '260px' }}>
            <View.Video url={task.video_b} ratio={16 / 9} validation={{ playedFully: true }} />
          </View.Card>
        </View.Flex>

        {watched ? (
          <View.Flex vertical={true} gap={'1.5rem'} style={{ padding: '0 20%' }}>
            {step < 4 ? (() => {
              const m = CONST.metrics[step];
              const status = data['t' + t + '_' + m.path + '_status'] || '';
              const editable = status === '' || status === 'wrong1';
              return (
                <View.Flex vertical={true} gap={'1.5rem'}>
                  <View.Card flat={true} title={'Task ' + t + ' · Metric ' + (step + 1) + ' of 4 — ' + m.title}>
                    <View.Flex vertical={true} gap={'0.75rem'}>
                      <Field.RadioGroup path={'t' + t + '_' + m.path} validation={[{ required: true }]}
                        disabled={!editable}
                        label={m.question}
                        hint={'Example: ' + m.example}
                        options={CONST.choice_options}
                        onChange={(v) => actions.set(
                          't' + t + '_' + m.path + '_status',
                          v === task.gt[m.path] ? 'pass' : (status === 'wrong1' ? 'fail' : 'wrong1')
                        )}
                      />
                      {status === 'pass' ? (
                        <View.Alert variant="success" title={'✅ Correct — ' + lbl(task.gt[m.path])} />
                      ) : null}
                      {status === 'wrong1' ? (
                        <View.Alert variant="error" title="❌ Not quite — pick another option (last try)" description={m.hint} />
                      ) : null}
                      {status === 'fail' ? (
                        <View.Alert variant="error" title={'❌ Incorrect — correct answer: ' + lbl(task.gt[m.path])} description={m.hint} />
                      ) : null}
                    </View.Flex>
                  </View.Card>

                  <View.Flex gap={'1rem'} justify="center">
                    <View.ActionButton label="← Back" variant="outline" disabled={step === 0} action={() => actions.set('t' + t + '_step', step - 1)} />
                    <View.ActionButton label="Next →" variant="default" disabled={editable} action={() => actions.set('t' + t + '_step', step + 1)} />
                  </View.Flex>
                </View.Flex>
              );
            })() : (() => {
              const passedAll = CONST.metrics.every((m) => data['t' + t + '_' + m.path + '_status'] === 'pass');
              const commentOk = ((data['t' + t + '_comment'] || '').trim().length) >= 30;
              return (
                <View.Flex vertical={true} gap={'1.5rem'}>
                  <View.Alert
                    variant={passedAll ? 'success' : 'error'}
                    title={passedAll ? 'This pair: all 4 metrics correct ✅' : 'This pair is marked incorrect ❌'}
                    description={passedAll ? undefined : 'Finish your comment and continue — the result is recorded.'}
                  />
                  <View.Card flat={true} title={'Task ' + t + ' · Final step — your comment'}>
                    <Field.Textarea path={'t' + t + '_comment'} validation={[{ required: true, min: 30, message: 'Describe your reasoning in at least 30 characters.' }]}
                      label="Justify your choices — what looked better and why."
                      hint="e.g. Video A stays sharper and moves more smoothly, while Video B flickers in the background."
                    />
                  </View.Card>
                  <View.Flex gap={'1rem'} justify="center">
                    <View.ActionButton label="← Back" variant="outline" action={() => actions.set('t' + t + '_step', step - 1)} />
                    <View.ActionButton
                      label={t < 3 ? 'Continue →' : 'See results →'}
                      variant="default"
                      disabled={!commentOk}
                      action={() => actions.set('stage', stage + 1)}
                    />
                  </View.Flex>
                </View.Flex>
              );
            })()}
          </View.Flex>
        ) : (
          <View.Flex vertical={true} style={{ padding: '0 20%' }}>
            <View.Alert variant="warning" title="Watch both videos in full to unlock the questions" />
          </View.Flex>
        )}
      </View.Flex>
    );
  })() : null}

  {/* ==================== 7 · RESULTS (stage 6) ==================== */}
  {(data.stage || 0) === 6 ? (() => {
    const results = CONST.tasks.map((task, i) =>
      CONST.metrics.every((m) => data['t' + (i + 1) + '_' + m.path + '_status'] === 'pass')
    );
    const passedCount = results.filter(Boolean).length;
    const passedAll = passedCount === CONST.tasks.length;
    return (
      <View.Flex vertical={true} gap={'1.5rem'} style={{ padding: '0 20%' }}>
        <View.Alert
          variant={passedAll ? 'success' : 'error'}
          title={passedAll ? '🎉 Onboarding passed' : '❌ Onboarding not passed'}
          description={passedAll
            ? 'All 3 pairs correct. You are qualified for the task.'
            : (passedCount + ' of 3 pairs correct — all 3 are required. Ask your team to reset the onboarding to try again.')}
        />
        <View.Card flat={true} title="Per-task result">
          <View.Flex vertical={true} gap={'0.75rem'}>
            {CONST.tasks.map((task, i) => (
              <View.Alert
                key={i}
                variant={results[i] ? 'success' : 'error'}
                title={'Task ' + (i + 1) + ': ' + (results[i] ? 'Correct ✅' : 'Incorrect ❌')}
                description={task.prompt}
              />
            ))}
          </View.Flex>
        </View.Card>
        <View.Card flat={true} variant="info" title="You are done">
          <View.Text>You now know the task UI, the A / B / Tie selection on each quality metric, and the comment requirement — exactly how the real task works.</View.Text>
        </View.Card>
      </View.Flex>
    );
  })() : null}
</View.Flex>
