import {CandidateDto, CandidateExperienceCollectionDTO, CandidateInfoDto} from "../../interfaces/dto/CandidateDto";
import nlp from 'compromise'

// enumerate candidate employment history sections based on Months tags
function getRelativeDatesPosition(currentParagraphPosition: number, resumeDoc: any, arrayOfDatesPositions: number[]): number[] {
    for (let currLine = currentParagraphPosition + 1; currLine < resumeDoc.document.length; currLine++) {

        resumeDoc.document[currLine].forEach(str => {
            if (str.tags?.has('Month')) {
                if (!arrayOfDatesPositions.find(currLineA => currLine === currLineA))
                    arrayOfDatesPositions.push(currLine)
            }
        })
    }
    return arrayOfDatesPositions;
}

// join lines of description
function getJobDescription(strLine: number, endLine: number, resumeDoc: any) {
    console.debug(`${strLine} - ${endLine}`);
    let jobDescription = '';
    for (let currDescLine = strLine; currDescLine < endLine; currDescLine++) {
        jobDescription = jobDescription.concat(resumeDoc.sentences(currDescLine).text());

    }
    return jobDescription
}

export function extractFeaturesFromResume(rows): CandidateDto {
    enum ResumeTaxonomy {
        MAX_PER_PERSONAL_INFO = 5,
        PERSONAL_INFO_START = 0,
    }

    let candidateInfo: CandidateInfoDto;
    let candidateExperience: CandidateExperienceCollectionDTO = [];
// NLP PART
    let resumeDoc = nlp(Object.values(rows).join(' \n'))
    // let resumeDoc = nlp(Object.values(rows).join(''))
    resumeDoc.compute('penn')


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
            // populate candidate experience
            case expectedFeatures.candidateExperience:
                try {
                    let arrayOfDatesPositions: number[] = [];
                    let currentParagraphPosition: number = <number>(resumeDoc.match("HISTORY").pointer?.at(0)!).at(0)
                    let experienceDateSection = getRelativeDatesPosition(currentParagraphPosition, resumeDoc, arrayOfDatesPositions);
                    for (let i = 0; i < experienceDateSection.length; i++) {
                        let [companyName, ...dates] = resumeDoc.sentences(experienceDateSection[i]).splitBefore("#Month #Year").out("array")
                        //dates extraction per the employment section
                        candidateExperience.push({
                            startDate: dates.length == 3 ? dates[0] : nlp(dates.join()).match("#Month #Year").text(),
                            endDate: dates.length == 3 ? dates[2] : 'present',
                            companyName: companyName.slice(0, -2), // clean 2 last trash chars
                            title: resumeDoc.sentences(experienceDateSection[i] - 1).text(),
                            description: getJobDescription(experienceDateSection[i] + 1,
                                i == experienceDateSection.length - 1 ? resumeDoc.document.length : experienceDateSection[i + 1] - 1,
                                resumeDoc)

                        })
                    }
                } catch (e) {
                    // prevent node from crashing
                    console.error(e);
                }
                break
        }

    }

    return {
        candidateInfo: candidateInfo!,
        candidateExperienceCollection: candidateExperience!
    }
}
