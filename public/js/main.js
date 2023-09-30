$(async () => {
    await sleep(1000);
    await dynamicShape.dot();
    await dynamicShape.line();
    await dynamicShape.header();
    await headerText.text('欢迎使用 Focus');
    await headerText.float();
    await sleep(1000);
    await headerText.sink();
    await headerText.text('现在想做什么?');
    await runAll(headerText.float, async () => {
        await sleep(400);
        await taskInput.show();
    });

    (() => {
        let taskChangedTimeout;
        $('#task-input').on('input', () => {
            if (taskChangedTimeout) {
                clearTimeout(taskChangedTimeout);
            }
            if ($('#task-input').val().trim().length < 7) {
                return;
            }

            taskChangedTimeout = setTimeout(async () => {
                taskChangedTimeout = null;
                await $('#task-input').val($('#task-input').val().trim()).promise();
                $.ajax({
                    type: 'POST',
                    url: '/api/fetchHints/',
                    data: {
                        task: $('#task-input').val()
                    },
                    success: (data) => {
                        if (data.success) {
                            hintsList.display(data.hints);
                        }
                    }
                });
            }, 2000);
        });
    })();

    console.log('done');
});
