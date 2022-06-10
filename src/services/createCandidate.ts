import {CandidateDto} from "../interfaces/dto/CandidateDto";

const logger = require("../logger").getInstance()

class CandidateModel {

    static toDto(candidateModel:CandidateModel): any {
        return this;
    }
}

export async function createCandidate(candidateModel: CandidateModel): Promise<CandidateDto | undefined|Error> {
    return new Promise<CandidateDto | undefined>((resolve, reject) => {
        logger.info("start")
        let candidateDto: CandidateDto = CandidateModel.toDto(candidateModel);
        let candidateCreated:boolean=false;
        // Object.apply(candidateDto,)
        if (candidateCreated) {
            resolve(candidateDto)
        }
        else {
            reject(candidateDto)
        }
        logger.info("end")

        return;
    })
}