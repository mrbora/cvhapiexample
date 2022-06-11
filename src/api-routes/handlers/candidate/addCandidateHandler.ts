import Hapi from "@hapi/hapi";
import {CandidateDto} from "../../../interfaces/dto/CandidateDto";
import {createCandidate} from "../../../services/candidate/createCandidate";
import {CandidateMapper} from "../../../services/mapper/ExtendedMapper";


const logger = require("../../../services/logger").getInstance();
export const addCandidateHandler = (req: Hapi.Request, res) => {


// router.post('/', (req,res)=>{
    const inputPayload = req.payload;
    console.log("route asset")
    let candidateModel: CandidateDto = CandidateMapper.toModel(req.payload)
    logger.info("exec started")

    return new Promise((resolve, reject) => createCandidate(candidateModel, resolve, reject)).then((output: CandidateDto) => {
        return res.response(output).code(200)
    }).catch(
        err => {
            return res.response(err).code(404)
        }
    )

    // logger.info("exec stopped")
};

export function assetHandler(request, response) {
    return response.send("aaaa").status(200).send()
}

// module.exports = router;