const dynamicShape = {
    async dot() {
        await $('#dynamic-shape')
            .animate(
                {
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%'
                },
                700
            )
            .promise();
    },
    async line() {
        await $('#dynamic-shape')
            .animate(
                {
                    width: '70vw',
                    height: '3px',
                    borderRadius: '0'
                },
                700
            )
            .promise();
    },
    async disappear() {
        await $('#dynamic-shape')
            .animate(
                {
                    width: '0',
                    height: '0'
                },
                700
            )
            .promise();
    },
    async header() {
        await $('#dynamic-shape')
            .animate(
                {
                    top: '20%'
                },
                700
            )
            .promise();
    },
    async center() {
        await $('#dynamic-shape')
            .animate(
                {
                    top: '50%'
                },
                700
            )
            .promise();
    }
};
const headerText = {
    async calcSize() {
        let maxWidth = $('#dynamic-shape').width();
        await $('#header-text').css('font-size', 'var(--header-size)');
        let headerSize = $('#header-text').css('font-size');
        let headerWidth = $('#header-text').width();
        let newSize = Math.min(maxWidth / headerWidth, 1) * parseFloat(headerSize);
        $('#header-text').css('font-size', newSize);
    },
    async text(s) {
        await $('#header-text').text(s).promise();
    },
    async float() {
        await $('#header-text')
            .css({
                transform: 'translateY(100%)',
                opacity: 0
            })
            .promise();
        await headerText.calcSize();
        await $('#header-text')
            .animate(
                {
                    dummy: 0
                },
                0
            )
            .promise();
        await $('#header-text')
            .animate(
                {
                    dummy: 1
                },
                {
                    duration: 700,
                    step: function (value) {
                        $(this).css('transform', 'translateY(' + (1 - value) * 100 + '%)');
                        $(this).css('opacity', value);
                    }
                }
            )
            .promise();
        addEventListener('resize', headerText.calcSize);
    },
    async sink() {
        await $('#header-text')
            .animate(
                {
                    dummy: 0
                },
                0
            )
            .promise();
        await $('#header-text')
            .animate(
                {
                    dummy: 1
                },
                {
                    duration: 700,
                    step: function (value) {
                        $(this).css('transform', 'translateY(' + value * 100 + '%)');
                        $(this).css('opacity', 1 - value);
                    }
                }
            )
            .promise();
        removeEventListener('resize', headerText.calcSize);
    }
};

const taskInput = {
    async show() {
        await $('#task-input').css('display', 'block').promise();
        await $('#task-input')
            .animate(
                {
                    opacity: 1
                },
                700
            )
            .promise();
        await sleep(400);
        await $('#task-input').focus().promise();
    },
    async lock() {
        await $('#task-input').prop('readonly', true).promise();
        await sleep(400);
        await $('#task-input')
            .animate(
                {
                    padding: 0
                },
                700
            )
            .promise();
    },
    async update(s) {
        await $('#task-input')
            .animate(
                {
                    opacity: 0
                },
                350
            )
            .promise();
        await $('#task-input').val(s).promise();
        await $('#task-input')
            .animate(
                {
                    opacity: 1
                },
                350
            )
            .promise();
    },
    async hide() {
        await $('#task-input').animate({ opacity: 0 }, 700).promise();
        await $('#task-input').css('display', 'none').promise();
    }
};

const hintsList = {
    existElements: [],
    async display(hints) {
        if (hintsList.existElements.length !== hints.length) {
            await $('#hints-list')
                .animate(
                    {
                        opacity: 0
                    },
                    350
                )
                .promise();
            await $('#hints-list').empty().promise();
            for (let i = 0; i < hints.length; i++) {
                await $('#hints-list').append(`<li class="hint" hint-id="${i}">${hints[i]}</li>`).promise();
            }
            await $('#hints-list').css('display', 'block').promise();
            await $('#hints-list')
                .animate(
                    {
                        opacity: 1
                    },
                    700
                )
                .promise();
            hintsList.existElements = hints;
        } else {
            let oldHints = hintsList.existElements;
            hintsList.existElements = matcher(hintsList.existElements, hints);
            for (let i = 0; i < hintsList.existElements.length; i++) {
                let oldContent = oldHints[i];
                let newContent = hintsList.existElements[i];
                if (oldContent !== newContent) {
                    await $('#hints-list li[hint-id="' + i + '"]')
                        .animate(
                            {
                                opacity: 0
                            },
                            350
                        )
                        .promise();
                    await $('#hints-list li[hint-id="' + i + '"]')
                        .text(newContent)
                        .promise();
                    await $('#hints-list li[hint-id="' + i + '"]')
                        .animate(
                            {
                                opacity: 1
                            },
                            350
                        )
                        .promise();
                }
            }
        }
    }
};

const todoTable = {
    existTodos: [],
    async show() {
        await $('#todo-table').css('display', 'block').promise();
        await $('#todo-table').animate({ opacity: 1 }, 700).promise();
    },
    async display(todos, changeFn) {
        await $('.detail').off('change');
        await $('.time').off('change');
        await $('.delete').off('click');
        await $('#addButton').off('click');
        await $('#todo-list').empty();
        todoTable.existTodos = todos;
        for (let i = 0; i < todoTable.existTodos.length; i++) {
            await $('#todo-list').append(
                `<tr todo-id="${i}">
                    <th>${i + 1}</th>
                    <td><input type="text" value="${todos[i].detail}" class="detail" todo-id="${i}"></td>
                    <td><input type="number" value="${todos[i].time}" class="time" todo-id="${i}"></td>
                    <td><button class="delete" todo-id="${i}">删除</button></td>
                </tr>`
            );
        }
        await $('#todo-list').append(
            `<tr todo-id="${todos.length}">
                <th></th>
                <td><input type="text" id="addDetail" placeholder="创建新步骤"></td>
                <td><input type="number" id="addTime" placeholder="25"></td>
                <td><button id="addButton">添加</button></td>
            </tr>`
        );
        $('.detail').on('change', (e) => {
            let id = $(e.target).attr('todo-id');
            if ($(e.target).val() === '') {
                $(e.target).val(todoTable.existTodos[id].detail);
            } else {
                todoTable.existTodos[id].detail = $(e.target).val();
            }
            changeFn(todoTable.existTodos);
        });
        $('.time').on('change', (e) => {
            let id = $(e.target).attr('todo-id');
            if ($(e.target).val() <= 0) {
                $(e.target).val(todoTable.existTodos[id].time);
            } else {
                todoTable.existTodos[id].time = $(e.target).val();
            }
            changeFn(todoTable.existTodos);
        });
        $('.delete').on('click', async (e) => {
            if (todoTable.existTodos.length === 1) {
                return;
            }

            let id = $(e.target).attr('todo-id');
            id = parseInt(id);

            let height = $('#todo-list tr[todo-id="' + id + '"]').height();
            let floatPromises = [
                async () => {
                    await $('#todo-list tr[todo-id="' + id + '"]')
                        .animate(
                            {
                                opacity: 0
                            },
                            350
                        )
                        .promise();
                }
            ];
            for (let i = id + 1; i <= todoTable.existTodos.length; i++) {
                await $('#todo-list tr[todo-id="' + i + '"]')
                    .animate(
                        {
                            dummy: 0
                        },
                        0
                    )
                    .promise();
                floatPromises.push(async () => {
                    if ($('#todo-list tr[todo-id="' + i + '"] th').text())
                        await $('#todo-list tr[todo-id="' + i + '"] th')
                            .text(i)
                            .promise();
                    await $('#todo-list tr[todo-id="' + i + '"]')
                        .animate(
                            {
                                dummy: 1
                            },
                            {
                                duration: 700,
                                step: function (value) {
                                    $(this).css('transform', 'translateY(-' + value * height + 'px)');
                                }
                            }
                        )
                        .promise();
                });
            }

            await runAll(...floatPromises);

            todoTable.existTodos.splice(id, 1);
            changeFn(todoTable.existTodos);
            todoTable.display(todoTable.existTodos, changeFn);
        });
        $('#addButton').on('click', async () => {
            if (!$('#addDetail').val().trim() || !$('#addTime').val() || $('#addTime').val() <= 0) {
                return;
            }

            todoTable.existTodos.push({
                detail: $('#addDetail').val(),
                time: $('#addTime').val()
            });

            let height = $('#todo-list tr[todo-id="' + (todoTable.existTodos.length - 1) + '"]').height();
            let newItem = $(`<tr>
                <th></th>
                <td><input type="text" placeholder="创建新步骤"></td>
                <td><input type="number" placeholder="25"></td>
                <td><button>添加</button></td>
            </tr>`);
            await newItem.attr('todo-id', todoTable.existTodos.length).promise();
            await newItem.css('opacity', 0).promise();
            await newItem.css('transform', 'translateY(-' + height + 'px)').promise();
            await $('#todo-list').append(newItem).promise();
            await runAll(
                async () => {
                    await newItem
                        .animate(
                            {
                                dummy: 1
                            },
                            {
                                duration: 700,
                                step: function (value) {
                                    $(this).css('opacity', value);
                                    $(this).css('transform', 'translateY(-' + (1 - value) * height + 'px)');
                                }
                            }
                        )
                        .promise();
                },
                async () => {
                    await $('#todo-list tr[todo-id="' + (todoTable.existTodos.length - 1) + '"] th')
                        .text(todoTable.existTodos.length)
                        .promise();
                },
                async () => {
                    await $('#todo-list tr[todo-id="' + (todoTable.existTodos.length - 1) + '"] button')
                        .text('删除')
                        .promise();
                }
            );

            changeFn(todoTable.existTodos);
            todoTable.display(todoTable.existTodos, changeFn);
        });
    },
    async hide() {
        await $('.detail').off('change');
        await $('.time').off('change');
        await $('.delete').off('click');
        await $('#addButton').off('click');
        await $('#todo-table').animate({ opacity: 0 }, 700).promise();
        await $('#todo-table').css('display', 'none').promise();
    }
};

const focusTable = {
    async show() {
        await $('#focus-table').css('display', 'block').promise();
        await $('#focus-table').animate({ opacity: 1 }, 700).promise();
    },
    async display(todos) {
        for (let i = 0; i < todos.length; i++) {
            await $('#focus-table')
                .append(
                    `<tr>
                <th>${i + 1}</th>
                <td><div class="detail">${todos[i].detail}</div></td>
                <td><div class="time">${todos[i].time}</div></td>
                <td><div class="time" focus-time-id="${i}">——</div></td>
            </tr>`
                )
                .promise();
        }
    },
    async finish(index, time) {
        await $('#focus-table div[focus-time-id="' + index + '"]')
            .text(time)
            .promise();
    },
    async hide() {
        await $('#focus-table').animate({ opacity: 0 }, 700).promise();
        await $('#focus-table').css('display', 'none').promise();
    }
};
