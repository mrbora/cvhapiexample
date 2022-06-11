export interface CandidateInfoDto {
    name: string;
}

export interface CandidateExperienceDto {
    startDate: Date
    endDate: Date
    companyName: string
    title: string
    description: string
}
export type CandidateExperienceCollectionDTO=CandidateExperienceDto[]
export interface CandidateDto {
    candidateInfo: CandidateInfoDto;
    candidateExperienceCollection: CandidateExperienceCollectionDTO;
}
