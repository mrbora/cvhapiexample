'use strict'


import {addCandidateHandler} from "../../handlers/candidate/addCandidateHandler";
import {pdfToText} from "../../../services/resume/resumePdfToCandidate";
import {CandidateDto} from "../../../interfaces/dto/CandidateDto";

const Joi = require('joi');


export const plugin = {
        register: (server, options) => {
            server.route(
                {
                    method: 'GET',
                    path: '/candidate/{assetId*}',
                    handler: async function (request, h) {
                        let result:CandidateDto=await pdfToText("c:\\tmp\\cv.pdf")
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
                    path: '/candidate/add-candidate',
                    handler: addCandidateHandler,

                    options: {
                        cors: true,
                        auth: false,
                        tags: ['candidate', 'api', 'getAssetInfo'],
                        description: "provide information on asset state",
                        notes: ["asset state and metadata"],
                        plugins: {
                            'hapi-swagger': {
                                payloadType: 'form'
                            },
                        },
                        validate: {
                            payload: Joi.object({
                                licensePlate: Joi.string().max(10).required().description("car license plate")
                            }),
                        },
                        // response: {
                        //     // schema: {},
                        //     // schema: Joi.object().tailor("AssetCarModel"),
                        //
                        //     status:
                        //         {
                        //             200: ["OK"]
                        //         }
                        //
                        // }
                    }


                }
            )
            ;

        },
        name: "candidate"
    }
;
