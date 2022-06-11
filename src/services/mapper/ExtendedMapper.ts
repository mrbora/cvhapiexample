import {BaseMapper} from "./BaseMapper";
import {CandidateDto, CandidateExperienceCollectionDTO, CandidateInfoDto} from "../../interfaces/dto/CandidateDto";
import * as stream from "stream";

export interface CandidateModel {
    candidateInfo: CandidateInfoDto;
    candidateExperienceCollection: CandidateExperienceCollectionDTO;
}

export class CandidateMapper implements BaseMapper
{
    public static toDto(candidateModel:CandidateModel):CandidateDto {
        return {
            candidateInfo:candidateModel.candidateInfo,
            candidateExperienceCollection:candidateModel.candidateExperienceCollection
        }
    }

    static toModel(payload: stream.Readable | Buffer | string | object):CandidateModel {
        return {
            candidateInfo:payload['cccc'],
            candidateExperienceCollection:payload['dsda']
        }

    }
}