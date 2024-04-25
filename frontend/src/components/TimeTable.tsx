import { useEffect, useState } from "react";

import * as  XLSX from "xlsx"

const link: string="http://localhost:3000/timetable";

export default function TimeTable() {
    const [timeTable, setTimetable] = useState([[], []]);
    useEffect(() => {
        (async () => {
            const res: ArrayBuffer = await (await fetch(link)).arrayBuffer();
            const table = XLSX.read(res, {type:"array"});
            setTimetable(XLSX.utils.sheet_to_html(table.Sheets[table.SheetNames[0]], {id:"TimeTable"}));

                // ExcelRenderer(await new File([await res.blob()], "filename"), (err: Error, resp: any) => {
                //     if(err) {console.log(err);}
                //     else{
                //         console.log(resp);
                //         setTimetable([resp.rows, resp.cols]);
                //     }
                // });
        })
    ();}, []);
    console.log(timeTable)
    return (<>
        <div className="table" dangerouslySetInnerHTML={{__html: timeTable}} />
    </>);
}
