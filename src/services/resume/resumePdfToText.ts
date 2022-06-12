import {PdfReader} from "pdfreader";
import {
    CandidateDto,
} from "../../interfaces/dto/CandidateDto";
import {extractFeaturesFromResume} from "./textToResumeFeatures";


let rows = {}; // indexed by y-position
function mergeRow(y) {
    // @ts-ignore
    try {
        if (rows[y].length > 0) rows[y] = rows[y].join(' ');
        console.log(`->${(rows[y] || [])}<-`);
    } catch (e) {
        console.error('cannot merge rows')
    }

}


function arrangeRows() {
    Object.keys(rows) // => array of y-positions (type: float)
        .sort((y1, y2) => parseFloat(y1) - parseFloat(y2)) // sort float positions
        .forEach(y => {
                mergeRow(y);
            }
        );
}

export async function resumeFeaturesExtractor(bufferPDF): Promise<CandidateDto | any> {
    let result: CandidateDto | undefined;
    let inProgress: boolean = true
    return new Promise((resolve, reject) => {
        new PdfReader().parseFileItems(bufferPDF,
            function (err, item) {
                if (err) {
                    console.error(err);
                } else if (!item || item.page) {
                    // end of file, or page
                    arrangeRows();
                    console.log('-- PAGE', item ? item.page : "END", '--');
                    if (!item && rows) {
                        result = extractFeaturesFromResume(rows);
                        rows = {}; // clear rows for next page

                        resolve(result)
                        return
                    }
                } else if (item.text) {
                    // accumulate text items into rows object, per line
                    try {
                        (rows[item.y] = rows[item.y] || []).push(item.text);
                    }
                    catch (e)
                    {
                        console.error("can't push rows:"+e.message)
                    }
                } else {
                    console.dir("<==>");
                }


            })

    })
}

