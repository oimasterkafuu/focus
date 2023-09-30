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
    async flow() {
        await $('#header-text')
            .css({
                transform: 'translateY(100%)'
            })
            .promise();
        await $('#header-text')
            .animate(
                {
                    dummy: 1
                },
                {
                    duration: 700,
                    step: function (value, fx) {
                        $(this).css('transform', 'translateY(' + (1 - value) * 100 + '%)');
                    }
                }
            )
            .promise();
    }
};
