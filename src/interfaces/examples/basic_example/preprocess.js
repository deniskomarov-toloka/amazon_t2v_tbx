let countAnswersWithAtLeast7Words = 0;

for (let i = 0; i < data.answers.length; i++) {
    const item = data.answers[i];

    if (item.text.trim().split(' ').length > 7) {
        countAnswersWithAtLeast7Words++;
    }
}

return {
    hasOneOrMoreAnswersWithAtLeast7Words: countAnswersWithAtLeast7Words >= 1
};
