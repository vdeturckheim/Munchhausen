'use strict';
const Hapi = require('hapi');
const Boom = require('boom');

const server = new Hapi.Server();
server.connection({ port: 3000, labels: 'master' });
server.connection({ port: 8000, labels: 'puppet' });

let incr = 0;

const routeStore = {};
const Route = require('./lib/route');

server.select('master')
    .route([
        {
            method: 'POST',
            path: '/routes',
            handler: function (request, reply) {

                const route = new Route(request.payload.method, request.payload.path, request.payload.responseCode,
                    request.payload.responseContent);
                const uniqueId = request.payload.method + '_' + request.payload.path;

                if (routeStore[uniqueId]){
                    return reply(Boom.conflict());
                }

                routeStore[uniqueId] = route;
                console.log(routeStore);

                server.select('puppet').route(route.getRoute());
                reply(route.getId()).code(201);

            }
        },
        {
            method: 'GET',
            path: '/routes',
            handler: function (request, reply){

                const keys = Object.keys(routeStore);
                const resp = [];
                keys.forEach((key) => {

                    resp.push(routeStore[key].print());
                });

                reply(resp);
            }
        },
        {
            method: 'PUT',
            path: '/routes/{id}',
            handler: function (request, reply){
                const uniqueId = request.payload.method + '_' + request.payload.path;
                const route = routeStore[uniqueId];
                console.log(routeStore);
                console.log(route);
                if (request.payload.responseCode){
                    route.setResponseCode(request.payload.responseCode);
                }
                if (request.payload.responseContent){
                    route.setResponseContent(request.payload.responseContent);
                }

                reply(route.print());
            }
        }
    ]);


server.start(() => {

    console.log('Server running at:', server.connections[0].info);
    console.log('Server running at:', server.connections[1].info);
});
