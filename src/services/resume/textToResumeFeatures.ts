import {CandidateDto, CandidateExperienceCollectionDTO, CandidateInfoDto} from "../../interfaces/dto/CandidateDto";
import nlp from 'compromise'
import datePlugin from 'compromise-dates'

export function extractFeaturesFromResume(rows): CandidateDto {
    enum ResumeTaxonomy {
        MAX_PER_PERSONAL_INFO = 5,
        PERSONAL_INFO_START = 0
    }

    let candidateInfo: CandidateInfoDto;
    let candidateExperience: CandidateExperienceCollectionDTO;
// NLP PART
    let resumeDoc = nlp(Object.values(rows).join(' \n'))
    // let resumeDoc = nlp(Object.values(rows).join(''))
    nlp.plugin(datePlugin)
    resumeDoc.compute('penn')

    let m = resumeDoc.match("HISTORY").docs;

    // @ts-ignore
    let dates = resumeDoc.dates().get()
    const expectedFeatures = {candidateName: "candidateName", candidateExperience: "candidateExperience"}
    for (const exKey in expectedFeatures) {
        console.log("infeerence for:" + exKey)
        switch (exKey) {
            case expectedFeatures.candidateName:
                /// execute inference
                let candidateName: string = ""
                for (let i = ResumeTaxonomy.PERSONAL_INFO_START; i < ResumeTaxonomy.MAX_PER_PERSONAL_INFO; i++) {
                    resumeDoc.document[i].forEach(str => {
                            if (str.tags?.has('Person') === true) {
                                if (candidateName === "") candidateName = str.text
                                else
                                    candidateName = `${candidateName} ${str.text}`
                                console.dir(str)
                            }
                        }
                    )
                }
                candidateInfo = {
                    name: candidateName
                }
                break
            case expectedFeatures.candidateExperience:
                candidateExperience = [
                    {
                        startDate: new Date(),
                        endDate: new Date(),
                        companyName: "aaa",
                        title: "aaaa",
                        description: "string"
                    }
                ]
                break
        }

    }

    return {
        candidateInfo: candidateInfo!,
        candidateExperienceCollection: candidateExperience!
    }
}
