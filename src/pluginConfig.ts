import { PluginObject} from "@hapi/glue";
import {SecuritySchemeType} from "hapi-swagger";


export const manifestPlugins: PluginObject[] =
    [

        {
            plugin: 'hapi-cors'
        },
        // swagger
        {
            plugin: '@hapi/inert'
        },
        {
            plugin: '@hapi/vision'
        },
        {
            plugin: 'hapi-swagger',
            options: {
                info: {
                    title: 'Test API Documentation',
                    // version: Pack.version,
                },

            }
        },
        {
            plugin: "vision",
            options: {
                engines: {
                    html: require('handlebars')
                },
                relativeTo: __dirname,
                path: 'public'
            }


        }
    ]


