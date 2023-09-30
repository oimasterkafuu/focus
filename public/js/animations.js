const dynamicShape = {
    async dot() {
        await $('#dynamic-shape').animate(
            {
                width: '10px',
                height: '10px',
                borderRadius: '50%'
            },
            1000
        );
    },
    async line() {
        await $('#dynamic-shape').animate(
            {
                width: '70vw',
                height: '3px',
                borderRadius: '0'
            },
            1000
        );
    },
    async header() {
        await $('#dynamic-shape').animate(
            {
                top: '30%'
            },
            1000
        );
    },
    async center() {
        await $('#dynamic-shape').animate(
            {
                top: '50%'
            },
            1000
        );
    }
};
