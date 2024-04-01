import { useEffect, useState } from "react";
import { Fetcher } from "../App";

const XLSX = require("xlsx"); 

const link: string="https://rtucloud1-my.sharepoint.com/:x:/r/personal/skola_rtu_lv/Documents/aaa_process_2023_24/M%C4%81c%C4%ABbu%20process/Izmai%C5%86as%202.sem.%20.xlsx";

function TimeTable() {
    const [ExcelFile, setExcelFile] = useState("");

    useEffect(() => {
        (async() => {
            let res: Response; 
            res = await(Fetcher(link)); 
            if (await (res).ok) {
                setExcelFile(URL.createObjectURL(await (res).blob()));
            }
        })
    })
}