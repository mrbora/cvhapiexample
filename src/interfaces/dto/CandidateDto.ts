export interface CandidateInfo {
    name: string;
}

export interface CandidateExperienceDto {
    startDate: Date
    endDate: Date
    companyName: string
    title: string
    description: string
}

export interface CandidateDto {
    candidateInfo: CandidateInfo;
    candidateExperience: CandidateExperienceDto[];
}