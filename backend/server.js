// node
import Hapi from "@hapi/hapi";
import Inert from "@hapi/inert";
import Vision from "@hapi/vision";
import HapiSwagger from "hapi-swagger";
import HapiAuthBearerToken from "hapi-auth-bearer-token";
import HapiAuthorization from "hapi-authorization";
import HapiBasic from "@hapi/basic";
import HapiRateLimit from "hapi-rate-limit";
import Hapii18 from "hapi-i18n";
import Handlebars from "handlebars";

// controller
import dbconnection from "./utils/dbconnection.js";

import AuthController from "./modules/auth/authcontroller.js";
import UserController from "./modules/user/usercontroller.js";
import TodoController from "./modules/todo/todocontroller.js";

import configEnv from "./config/config.js";
import AuthService from "./modules/auth/authservice.js";

const env = process.env.NODE_ENV || "local",
    config = configEnv[env],
    authService = new AuthService(),
    init = async () => {
        const server = Hapi.server({
            "port": config.port,
            "routes": {
                "cors": {
                    "origin": ["*"],
                    "additionalHeaders": ["if-modified-since", "accept", "expiry", "access-token", "Accept-Language",
                        "app_version", "os_version", "device_name", "time_zone", "cache-control", "x-requested-with",
                        "Authorization", "Content-Type"]
                },
                "files": {
                    "relativeTo": "./templates"
                }
            }
        }),
            swaggerOptions = {
                "securityDefinitions": {
                    "Bearer": {
                        "type": "apiKey",
                        "name": "Authorization",
                        "in": "header"
                    }
                },
                "security": [{
                    "Bearer": []
                }],
                "info": {
                    "title": "todo API Documentation",
                    "version": "1.0.0"
                }
            };
        await server.register([
            Inert,
            Vision,
            {
                "plugin": HapiSwagger,
                "options": swaggerOptions
            }
        ]);
        // eslint-disable-next-line one-var
        const plugins = [
            {
                "plugin": HapiAuthBearerToken
            },
            {
                "plugin": HapiAuthorization
            },
            {
                "plugin": HapiBasic
            }
        ];
        await server.register(plugins);
        server.auth.strategy("token", "bearer-access-token", {
            "allowQueryToken": true, // optional, false by default
            "validate": authService.validate
        });
        server.auth.default("token");
        server.auth.strategy("simple", "basic", {
            "validate": authService.basicAuth
        });
        await server.register({
            "plugin": HapiRateLimit,
            "options": {
                "enabled": false,
                "pathLimit": 10,
                "userCache": {
                    "expiresIn": 300000// 5 minutes
                }
            }
        });
        await server.register({
            "plugin": Hapii18,
            "options": {
                "locales": ["en"],
                "directory": "./locales",
                "defaultLocale": "en-US",
                "languageHeaderField": "accept-language"
            }
        });
        await server.register(Vision);
        server.views({
            "engines": {
                "html": Handlebars
            },
            "relativeTo": "./",
            "path": "templates"
        });
        try {
            await server.register({
                "plugin": AuthController,
                "options": {
                }
            });
            await server.register({
                "plugin": UserController,
                "options": {
                }
            });
            await server.register({
                "plugin": TodoController,
                "options": {
                }
            });

            // --next controller registration will go here--    
        } catch (error) {
            console.log("error-----", error);
        }
        console.log("Server before running at:");
        try {
            await server.start();
            dbconnection();
            console.log("Server running at:", server.info.uri);
        } catch (error) {
            console.log("error0000", error);
        }
        server.events.on("response", (request) => {
            console.log(`${request.info.remoteAddress}: ${request.method.toUpperCase()} ${request.path} --> ${request.response.statusCode}`);
        });
        // if all modules found, initialize db connection
    };
init();
