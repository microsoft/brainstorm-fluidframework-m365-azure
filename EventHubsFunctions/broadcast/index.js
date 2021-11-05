module.exports = async function (context, eventHubMessages) {
    context.log(`JavaScript eventhub trigger function called for message array ${eventHubMessages}`);

    eventHubMessages.forEach((message, index) => {
        context.log(`Processed message ${message}`);
        context.log(JSON.stringify(message));



        var body = JSON.stringify(message);
        var jsonMessage = JSON.parse(body);
        context.log(jsonMessage);


        for (let i in jsonMessage.value) {

            var resourceData = jsonMessage.value[i].resourceData;

            context.log(resourceData);
            context.bindings.signalRMessages = [{
                "target": "newMessage",
                "arguments": [`{
                    "id" : "${resourceData.id}",
                    "availability" : "${resourceData.availability}"
                }`]
            }];
        }

    });
};