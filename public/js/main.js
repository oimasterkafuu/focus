$(async () => {
    await sleep(1000);
    await dynamicShape.dot();
    await dynamicShape.line();
    await dynamicShape.header();
    await headerText.text('欢迎使用 Focus');
    await headerText.float();
    await sleep(1000);
    await headerText.sink();
    await headerText.text('现在想做什么？');
    (() => {
        let taskChangedTimeout,
            headerChanged = false;
        $('#task-input').on('input', async () => {
            if (taskChangedTimeout) {
                clearTimeout(taskChangedTimeout);
            }

            if ($('#task-input').val().trim().length < 7) {
                if ($('#task-input').val().trim().length === 0) {
                    await hintsList.display([]);
                    if (headerChanged) {
                        headerChanged = false;
                        await headerText.sink();
                        await headerText.text('现在想做什么？');
                        await headerText.float();
                    }
                }
                return;
            }

            taskChangedTimeout = setTimeout(async () => {
                if ($('#task-input').prop('readonly')) return;
                taskChangedTimeout = null;
                await $('#task-input').val($('#task-input').val().trim()).promise();
                $.ajax({
                    type: 'POST',
                    url: '/api/fetchHints/',
                    data: {
                        task: $('#task-input').val(),
                        oldHints: hintsList.existElements
                    },
                    success: async (data) => {
                        if ($('#task-input').prop('readonly')) return;
                        if (data.success) {
                            let promises = [
                                async () => {
                                    await hintsList.display(data.hints);
                                }
                            ];
                            if (!headerChanged) {
                                headerChanged = true;
                                await headerText.sink();
                                await headerText.text('让任务更清晰！');
                                promises.push(headerText.float);
                            }
                            await runAll(...promises);
                        }
                    }
                });
            }, 2000);
        });
    })();
    await runAll(
        headerText.float,
        async () => {
            await sleep(400);
            await taskInput.show();
        },
        async () => {
            while (true) {
                await waitUserEnter();
                await $('#task-input').val($('#task-input').val().trim()).promise();
                if ($('#task-input').val()) {
                    break;
                }
            }
        }
    );
    $('#task-input').off('input');
    await hintsList.display([]);
    await headerText.sink();
    await headerText.text('请稍等……');
    await runAll(taskInput.lock, headerText.float);

    let steps = [];
    (async () => {
        $.ajax({
            type: 'POST',
            url: '/api/fetchSteps/',
            data: {
                task: $('#task-input').val()
            },
            success: async (data) => {
                if (data.success) {
                    await headerText.sink();
                    await headerText.text('规划具体步骤');
                    steps = data.steps;
                    await todoTable.display(data.steps, (newTasks) => {
                        steps = newTasks;
                    });
                    await runAll(headerText.float, todoTable.show);
                }
            }
        });
    })();

    await waitUserEnter();
    console.log('done');
});
