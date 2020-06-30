let http = require('http');
let request = require('request');

let config = require('./config.json');

let send = ({field, motioneye, homeassistant}) => new Promise((resolve, reject) => {

    let formData = {};

    formData[field] = request.get(motioneye, (error, response, body) => {

        if (error) reject(error);

    });

    request.post(homeassistant, {
        formData: formData
    }, (error, response, body) => {

        if (error) reject(error);
        else resolve();

    });

});

let streams = config.streams.filter(stream => !stream.disabled);

for (let i = 0; i < streams.length; i++) {

    let stream = streams[i];

    setInterval(() => send(stream), stream.timeout);

}

let server = http.createServer((req, res) => {

    let motions = config.motions.filter(motion => motion.webhook === req.url && !motion.disabled);

    for (let i = 0; i < motions.length; i++) {

        let motion = motions[i];

        send(motion);

    }

    res.end(JSON.stringify(motions, null, 2));

});

server.listen(config.port, () => {
    console.log('http://localhost:' + config.port);
});