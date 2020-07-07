let request = require('request');

let {source, stream, field, delay} = require('./config.json');

setInterval(() => {

    try {

        let formData = {};

        formData[field] = request.get(source, (error, response, body) => {

            if (error) console.error(error);

        });

        request.post(stream, {

            formData: formData

        }, (error, response, body) => {

            if (error) console.error(error);

        });

    } catch (error) {

        console.error(error);

    }

}, delay);