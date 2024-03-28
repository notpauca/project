import { ReactElement, useEffect, useState } from 'react';
import { Fetcher } from "../App";
import { DeviceHdd, Archive, CardImage, FileEarmarkPdf, FileMusic, Film, Folder2, File, FileEarmarkEasel, FileEarmarkText } from 'react-bootstrap-icons';
import { FileInfo } from "../App";

const PrevDirectoryEntryName = "Previous directory";

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
            setSortAscending(false); 
        }
        setSortBy(SortOpts.byName);
    }
    
    function SwitchDate() {
        if (SortBy == SortOpts.byDate) {
            setSortAscending(false); 
        }
        setSortBy(SortOpts.byDate);
    }

    function Sort() {
        switch (SortBy) {
            case (SortOpts.byName): {
                ls.sort((a: FileInfo, b: FileInfo) => {
                    const nameA: string = a.name.toUpperCase();
                    const nameB: string = b.name.toUpperCase();
                    if (nameA < nameB || nameA == PrevDirectoryEntryName.toUpperCase()) {
                        return 1;
                    }
                    if (nameA > nameB || nameB == PrevDirectoryEntryName.toUpperCase())  {
                        return -1;
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
                return; 
            }
        }
        setSortAscending(!isSortAscending);
    }

function SwitchSortDirection() {
    if (isSortAscending!=true) {
        setSortAscending(true);
        if (ls[0].name == PrevDirectoryEntryName) {
            //@ts-ignore
            setLs([].concat(ls[0], ls.slice(1).reverse()));
        }
        else {
            setLs(ls.reverse());
        }
    }
}


    const [ls, setLs] = useState<FileInfo[]>([]);
    const [fileURL, setFileURL] = useState<string>("");
    const [contentType, setContentType] = useState<string>(""); 
    const [SortBy, setSortBy] = useState<SortOpts>(SortOpts.none); 
    const [isSortAscending, setSortAscending] = useState<boolean>(true);
    useEffect(() => {
        (async () => {
            let result: Response;
            result = await Fetcher(window.location.pathname);
            if (await (result).ok) {
                const blob: Blob = await result.blob();
                setFileURL(URL.createObjectURL(blob));
                setContentType(blob.type);
                try {
                    setLs(JSON.parse(await blob.text()));
                } catch(err) {}
            }
        })
        ();
    }, []);

    useEffect(() => {Sort()}, [SortBy])
    useEffect(() => {SwitchSortDirection(), [isSortAscending]})

    switch (contentType) {
    case ("application/json"): {
        return (
            <>
                <ul className="list-group" style={{margin: 16}}>
                    <li className="list-group-item" style={{display:"flex", left:"0", cursor:"auto"}}>
                        <p style={{marginTop:"auto", marginBottom:"auto", marginRight:"5px"}}>Kārtot pēc:</p>
                        <button style={{columnGap:10}} {...(SortBy==SortOpts.byName)?{className:"btn btn-primary"}:{className:"btn btn-outline-primary"}} type="button" onClick={SwitchName}>vārda</button>
                        <p style={{margin:"2px"}}></p>
                        <button style={{columnGap:10}} {...(SortBy==SortOpts.byDate)?{className:"btn btn-primary"}:{className:"btn btn-outline-primary"}} type="button" onClick={SwitchDate}>datuma</button>
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