import {CandidateDto} from "../../interfaces/dto/CandidateDto";
import {CandidateMapper, CandidateModel} from "../mapper/ExtendedMapper";
const logger = require("../logger").getInstance()



export async function createCandidate(candidateModel: CandidateModel,resolve,reject): Promise<CandidateDto | undefined|Error> {
    return new Promise<CandidateDto | undefined>((resolve, reject) => {
        logger.info("start")
        let candidateDto: CandidateDto = CandidateMapper.toDto(candidateModel);
        // let candidateCreated:boolean=false;
        // Object.apply(candidateDto,)
        if (candidateDto) {
            logger.info("candidate processed successfully")
            resolve(candidateDto)
        }
        else {
            logger.error("candidate processed with  error")
            reject(candidateDto)
        }
        logger.info("end")

        return;
    })
}