import {PdfReader} from "pdfreader";
import {
    CandidateDto,
} from "../../interfaces/dto/CandidateDto";
import {extractFeaturesFromResume} from "./textToResumeFeatures";

const fs = require('fs')

let rows = {}; // indexed by y-position
function printRow(y) {
    // @ts-ignore
    if (rows[y].length>0) rows[y]=rows[y].join('');
    console.log(`->${(rows[y] || [])}<-`);

}


function printRows() {
    Object.keys(rows) // => array of y-positions (type: float)
        .sort((y1, y2) => parseFloat(y1) - parseFloat(y2)) // sort float positions
        .forEach(y => {
                printRow(y);
            }
        );
}

export async function pdfToText(bufferPDF): Promise<CandidateDto | any> {
    let result: CandidateDto | undefined;
    let inProgress: boolean = true
    return new Promise((resolve, reject) => {
        new PdfReader().parseFileItems(bufferPDF,
            function (err, item) {
                // while (inProgress) {
                if (err) {
                    console.error(err);
                    // return Promise.reject(err)
                } else if (!item || item.page) {
                    // end of file, or page
                    printRows();
                    console.log('-- PAGE', item ? item.page : "END", '--');
                    if (!item && rows) {
                        result = extractFeaturesFromResume(rows);
                        rows = {}; // clear rows for next page

                        resolve(result)
                        return
                    }
                } else if (item.text) {
                    // accumulate text items into rows object, per line
                    (rows[item.y] = rows[item.y] || []).push(item.text);
                } else {
                    // return Promise.resolve(result!)
                    console.dir("<==>");
                }
                // return Promise.reject("fuck")
                // }
                // if (!item)

            })

    })
}

