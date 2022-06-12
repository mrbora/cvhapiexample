export interface CandidateInfoDto {
    name: string;
}

export interface CandidateExperienceDto {
    startDate: string
    endDate: string
    companyName: string
    title: string
    description: string
}
export type CandidateExperienceCollectionDTO=CandidateExperienceDto[]
export interface CandidateDto {
    candidateInfo: CandidateInfoDto;
    candidateExperienceCollection: CandidateExperienceCollectionDTO;
}
