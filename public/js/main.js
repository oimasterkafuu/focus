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
    await runAll(async () => {
        await hintsList.display([]);
    }, headerText.sink);
    await headerText.text('请稍等……');
    await waitCursor();
    await runAll(taskInput.lock, headerText.float);

    let mainTask = $('#task-input').val();

    let steps = [];
    (async () => {
        $.ajax({
            type: 'POST',
            url: '/api/fetchSteps/',
            data: {
                task: mainTask
            },
            success: async (data) => {
                await defaultCursor();
                await headerText.sink();
                await headerText.text('规划具体步骤');
                if (data.success) {
                    steps = data.steps;
                } else {
                    steps = [
                        {
                            detail: mainTask,
                            time: 25
                        }
                    ];
                }
                await todoTable.display(data.steps, (newTasks) => {
                    steps = newTasks;
                });
                await runAll(headerText.float, todoTable.show);
                taskInput.update('按下 Enter 键进入下一步');
            }
        });
    })();

    await waitUserEnter();
    await runAll(headerText.sink, todoTable.hide);
    await headerText.text('专注马上开始');
    await focusTable.display(steps);
    await runAll(headerText.float, focusTable.show, async () => {
        await waitCursor();
        await taskInput.update('正在打开全屏模式');
        requestFullscreen();
        window.onbeforeunload = () => {
            return '你的专注将被丢弃！';
        };
        await sleep(1000);
        await defaultCursor();
        await taskInput.update('全屏模式已打开');
        await taskInput.update('按下 Enter 开始专注');
    });

    for (let i = 0; i < steps.length; i++) {
        await waitUserEnter();
        await runAll(headerText.sink, focusTable.hide);
        await headerText.text(steps[i].detail);
        await headerText.float();
        await waitUserEnter();
        await headerText.sink();
        if (i + 1 < steps.length) {
            await headerText.text('准备下一个步骤');
        } else {
            await headerText.text('查看专注报告');
        }
        await focusTable.finish(i, steps[i].time);
        await runAll(headerText.float, focusTable.show);
    }

    await taskInput.update('你的任务已经完成，恭喜！');
    await sleep(2000);
    await waitCursor();
    await taskInput.update('正在关闭全屏模式');
    window.onbeforeunload = null;
    exitFullscreen();
    await defaultCursor();
    await taskInput.update('全屏模式已关闭');
    await sleep(2000);
    await taskInput.update('按下 Enter 退出');

    await waitUserEnter();

    await runAll(headerText.sink, focusTable.hide, taskInput.hide);
    await headerText.text('感谢使用 Focus');
    await headerText.float();

    await sleep(1500);
    await headerText.sink();
    await dynamicShape.center();
    await dynamicShape.dot();
    await dynamicShape.disappear();

    await pointCursor();
    $(document.body).click(async () => {
        await defaultCursor();
        location.reload();
    });
});
