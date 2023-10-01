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
    }
};

const hintsList = {
    existElements: [],
    async display(hints) {
        if (this.existElements.length !== hints.length) {
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
            this.existElements = hints;
        } else {
            let oldHints = this.existElements;
            this.existElements = matcher(this.existElements, hints);
            for (let i = 0; i < this.existElements.length; i++) {
                let oldContent = oldHints[i];
                let newContent = this.existElements[i];
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
        this.existTodos = todos;
        for (let i = 0; i < this.existTodos.length; i++) {
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
                <td><input type="text" id="addDetail" placeholder="按下 Enter 进入下一步"></td>
                <td><input type="number" id="addTime" placeholder="25"></td>
                <td><button id="addButton">添加</button></td>
            </tr>`
        );
        $('.detail').on('change', (e) => {
            let id = $(e.target).attr('todo-id');
            if ($(e.target).val() === '') {
                $(e.target).val(this.existTodos[id].detail);
            } else {
                this.existTodos[id].detail = $(e.target).val();
            }
            changeFn(this.existTodos);
        });
        $('.time').on('change', (e) => {
            let id = $(e.target).attr('todo-id');
            if ($(e.target).val() <= 0) {
                $(e.target).val(this.existTodos[id].time);
            } else {
                this.existTodos[id].time = $(e.target).val();
            }
            changeFn(this.existTodos);
        });
        $('.delete').on('click', async (e) => {
            if (this.existTodos.length === 1) {
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
            for (let i = id + 1; i <= this.existTodos.length; i++) {
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

            this.existTodos.splice(id, 1);
            changeFn(this.existTodos);
            this.display(this.existTodos, changeFn);
        });
        $('#addButton').on('click', async () => {
            if (!$('#addDetail').val().trim() || !$('#addTime').val() || $('#addTime').val() <= 0) {
                return;
            }

            this.existTodos.push({
                detail: $('#addDetail').val(),
                time: $('#addTime').val()
            });

            let height = $('#todo-list tr[todo-id="' + (this.existTodos.length - 1) + '"]').height();
            let newItem = $(`<tr>
                <th></th>
                <td><input type="text" placeholder="按下 Enter 进入下一步"></td>
                <td><input type="number" placeholder="25"></td>
                <td><button>添加</button></td>
            </tr>`);
            newItem.attr('todo-id', this.existTodos.length);
            newItem.css('opacity', 0);
            newItem.css('transform', 'translateY(-' + height + 'px)');
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
                    await $('#todo-list tr[todo-id="' + (this.existTodos.length - 1) + '"] th')
                        .text(this.existTodos.length)
                        .promise();
                },
                async () => {
                    await $('#todo-list tr[todo-id="' + (this.existTodos.length - 1) + '"] button')
                        .text('删除')
                        .promise();
                }
            );

            changeFn(this.existTodos);
            this.display(this.existTodos, changeFn);
        });
    },
    async hide() {
        await $('.detail').off('change');
        await $('.time').off('change');
        await $('.delete').off('click');
        await $('#addButton').off('click');
        await $('#todo-list').empty();
        await $('#todo-table').animate({ opacity: 0 }, 700).promise();
        await $('#todo-table').css('display', 'none').promise();
    }
};
