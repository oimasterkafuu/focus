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
                transform: 'translateY(100%)'
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
                    }
                }
            )
            .promise();
    }
};

const taskInput = {
    async show() {
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
