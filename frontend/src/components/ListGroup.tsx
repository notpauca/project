import React, { ReactElement, useEffect, useState } from 'react';
import { Fetcher } from "../App";
import { DeviceHdd, Archive, CardImage, FileEarmarkPdf, FileMusic, Film, Folder2, File, FileEarmarkEasel, FileEarmarkText } from 'react-bootstrap-icons';
import { FileInfo } from "../App";

enum SortOpts {
    none = 0,
    byName, 
    byDate
}

function makeIcon(type: string): ReactElement {
    switch (type) {
        case "folder": {
            return (<Folder2 className='icon' />);
        }
        case "jpg": 
        case "webp": 
        case "png": 
        case "jpeg": {
            return(<CardImage className='icon' />);
        }
        case "ogg": 
        case "mp4": 
        case "mov": {
            return(<Film className='icon' />);
        }
        case "md": 
        case "markdown": 
        case "docx": 
        case "txt": {
            return(<FileEarmarkText className='icon' />);
        }
        case "ppt": 
        case "pptx": 
        case "pptm": {
            return(<FileEarmarkEasel className='icon' />)
        }
        case "mp3": 
        case "flac": 
        case "m4a": {
            return(<FileMusic className='icon' />)
        }
        case "iso": 
        case "img": 
        case "dmg": {
            return(<DeviceHdd className='icon' />)
        }
        case "pdf": {
            return(<FileEarmarkPdf className='icon' />)
        }
        case "zip": 
        case "gz": 
        case "bz": {
            return(<Archive className='icon' />)
        }
        default: {
            return(<File className='icon' />);
        }

    }
}



const api: string = "http://localhost:3000"; 

function ListGroup() {
    function SwitchName() {
        if (SortBy == SortOpts.byName) {
            console.log("switching directions!");
            setSortAscending(!isSortAscending); 
        }
        setSortBy(SortOpts.byName);
    }
    
    function SwitchDate() {
        if (SortBy == SortOpts.byDate) {
            console.log("switching directions!");
            setSortAscending(!isSortAscending); 
        }
        setSortBy(SortOpts.byDate);
    }

    function Sort() {
        switch (SortBy) {
            case (SortOpts.byName): {
                ls.sort((a: FileInfo, b: FileInfo) => {
                    const nameA = a.name.toUpperCase();
                    const nameB = b.name.toUpperCase();
                    if (nameA < nameB) {
                        return -1;
                    }
                    if (nameA > nameB) {
                        return 1;
                    }
                    return 0;
                });
                break;
            }
            case (SortOpts.byDate): {
                ls.sort((a: FileInfo, b: FileInfo) => {
                    const nameA = a.time;
                    const nameB = b.time;
                    if (nameA < nameB) {
                        return -1;
                    }
                    if (nameA > nameB) {
                        return 1;
                    }
                    return 0;
                });
                break;
            }
            case (SortOpts.none): {
                break; 
            }
        }
        if (isSortAscending!=true) {setLs(ls.reverse());}
    }

    const [ls, setLs] = useState([]);
    const [fileURL, setFileURL] = useState("");
    const [contentType, setContentType] = useState(""); 
    const [SortBy, setSortBy] = useState(SortOpts.none); 
    const [isSortAscending, setSortAscending] = useState(false); //true for first-last, false for last-first
    useEffect(() => {
        (async () => {
            let result: Response;
            result = await Fetcher(window.location.pathname);
            if (await (result).ok) {
                const blob: Blob = await result.blob();
                setFileURL(URL.createObjectURL(blob));
                setContentType(blob.type);
                console.log(contentType);
                try {
                    setLs(JSON.parse(await blob.text()));
                } catch(err) {}
            }
        })
        ();
    }, []);

    useEffect(() => {Sort()}, [isSortAscending, SortBy, ls])

    switch (contentType) {
    case ("application/json"): {
        return (
            <>
                <ul className="list-group" style={{margin: 16}}>
                    <li className="list-group-item">
                        <button onClick={SwitchName}>name</button>
                        <button onClick={SwitchDate}>date</button>

                    </li>
                    {ls.map((item: FileInfo, i: number) => (
                        <li className="list-group-item" key={"li-"+i}>
                            <a href={item.path} className='Application-List-Entry' style={{display:"flex", width:"100%", justifyContent:"left", textAlign:"center"}}>
                                {makeIcon(item.type)}
                                <p style={{marginBottom:0}}>{item.name}</p>
                                {
                                item.time
                                ? <p style={{marginLeft:"auto", marginBottom:0}}>{new Date(item.time).toLocaleDateString("lv")}</p>
                                : <></>
                                }
                            </a>
                        </li>
                    ))}
                </ul>
            </>
        );
    }
    case ("image/jpeg"): 
    case ("image/webp"): 
    case ("image/png"): {
        return (
            <img className="rounded mx-auto d-block" src={api+window.location.pathname} />
        );
    }
    case ("audio/mpeg"): 
    case ("audio/wav"):{
        return (
            <audio className="rounded mx-auto d-block" controls> 
                <source src={fileURL} type={contentType}/>
            </audio>
        );
    }
    case ("video/mp4"): 
    case ("video/ogg"): 
    case ("video/webm"): {
        return ( 
        <video className="rounded mx-auto d-block" controls>
            <source src = {fileURL} type={contentType}/>
        </video>
        );
    }
    case ("application/pdf"): {
        return ( 
            <a href={fileURL}>open file</a>
        );
    }
    case (""): {
        // window.location.reload();
        return (
            <p style={{color:"white"}}>Loading...</p>

        )
    }
    default: {
        return ( 
            <a href={fileURL}>Download file</a>
        );
    }
    }
}
export default ListGroup; 