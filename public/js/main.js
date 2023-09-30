$(async () => {
    await sleep(1000);
    await dynamicShape.dot();
    await dynamicShape.line();
    await dynamicShape.header();
    await headerText.text('现在想做什么?');
    await headerText.flow();
    console.log('done');
});
