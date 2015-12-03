'use strict';
const Hapi = require('hapi');
const Boom = require('boom');

const server = new Hapi.Server();
server.connection({ port: 3000, labels: 'master' });
server.connection({ port: 8000, labels: 'puppet' });

let incr = 0;

server.select('master').route({
    method: 'GET',
    path: '/1',
    handler: function (request, reply) {

        request.server.select('puppet').route({
            method: 'GET',
            path: '/' + incr,
            handler: function (_request, _reply){

                return _reply('puppet');
            }
        });
        incr++;

        return reply(Boom.notFound());
    }
});



server.start(() => {

    console.log('Server running at:', server.connections[0].info);
    console.log('Server running at:', server.connections[1].info);
});
