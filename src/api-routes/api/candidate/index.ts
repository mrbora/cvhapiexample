'use strict'


import {resumeFeaturesExtractor} from "../../../services/resume/resumePdfToText";
import {CandidateDto} from "../../../interfaces/dto/CandidateDto";
import path from "path";
import * as os from "os";
import * as fs from "fs";

const Joi = require('joi');


export const plugin = {
        register: (server, options) => {
            server.route(
                {
                    method: 'GET',
                    path: '/candidate/demo',
                    handler: async function (request, h) {
                        let result:CandidateDto=await resumeFeaturesExtractor(path.join(path.dirname(require.main!.filename),'example', 'cv.pdf'))
                        const response = h.response(JSON.stringify(result));
                        response.type("application/json");
                        return response;
                    },
                    options: {
                        tags: ['api'],
                    }

                });
            server.route(
                {
                    method: 'POST',
                    path: '/candidate/upload-candidate-resume',
                    handler: async function (request, h) {
                        const file=request.payload['file'];
                        const tempPath = path.join(os.tmpdir(), file.hapi.filename);
                        const handleFileUpload = () => {
                            return new Promise((resolve, reject) => {
                                try {
                                    fs.writeFileSync(tempPath, file._data)
                                } catch (e) {
                                    reject(e)
                                }
                                return resolve("saved successfully")
                            })
                        }
                        let result:CandidateDto=await handleFileUpload().then(()=>resumeFeaturesExtractor(tempPath)).catch(e=> {throw new Error(e)})
                        const response = h.response(JSON.stringify(result));
                        response.type("application/json");
                        return response;
                    },

                    options: {
                        cors: true,
                        auth: false,
                        tags: ['candidate', 'api', 'getAssetInfo'],
                        description: "upload resume for NLP processing ",
                        notes: ["supported format: PDF"],
                        plugins: {
                            'hapi-swagger': {
                                payloadType: 'form'

                            },
                        },
                        validate: {
                            payload: Joi.object({file:Joi.any()?.meta({swaggerType:'file'}).required()}),
                        },
                        payload: {
                            maxBytes: 2048576,
                            parse: true,
                            multipart: {
                                output: 'stream'
                            },
                        },
                      
                    }


                }
            )
            ;

        },
        name: "candidate"
    }
;
