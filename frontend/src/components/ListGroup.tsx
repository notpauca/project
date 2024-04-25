import { ReactElement, useContext, useEffect, useState } from 'react';
import { DeviceHdd, Window, Archive, CardImage, FileEarmarkPdf, FileMusic, Film, Folder2, File, FileEarmarkEasel, FileEarmarkText } from 'react-bootstrap-icons';
import { FileInfo } from "../pages/Root";
import Markdown from 'react-markdown';
import { Link, redirect } from 'react-router-dom';
import { pathProvider } from '../pages/Root';

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
        case ("image/jpeg"):
        case ("image/webp"):
        case ("image/png"): {
            return (<CardImage className='icon' />);
        }
        case "video/mp4":
        case "video/ogg":
        case "video/webm": {
            return (<Film className='icon' />);
        }
        case "text/markdown":
        case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        case "application/msword":
        case "application/rtf":
        case "text/plain": {
            return (<FileEarmarkText className='icon' />);
        }
        case "application/vnd.ms-powerpoint":
        case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
        case "application/vnd.openxmlformats-officedocument.presentationml.template": 
        case "application/vnd.ms-powerpoint.presentation.macroenabled.12": {
            return (<FileEarmarkEasel className='icon' />)
        }
        case "audio/mpeg":
        case "audio/wav": {
            return (<FileMusic className='icon' />)
        }
        case "application/x-msdos-program": {
            return <Window className='icon'/>
        }

        case "application/x-iso9660-image":
        case "application/octet-stream":
        case "application/x-apple-diskimage": {
            return (<DeviceHdd className='icon' />)
        }

        case "application/pdf": {
            return (<FileEarmarkPdf className='icon' />)
        }
        case "application/zip":
        case "application/vnd.rar":
        case "application/gzip":
        case "application/x-xz": {
            return (<Archive className='icon' />)
        }
        default: {
            return (<File className='icon' />);
        }

    }
}

const api: string = "http://localhost:3000/file";

function ListGroup() {
    const [CurrentPath, setCurrentPath] = pathProvider();
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
                    if (nameA > nameB || nameB == PrevDirectoryEntryName.toUpperCase()) {
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
        if (isSortAscending != true) {
            setSortAscending(true);
            //@ts-ignore
            if (ls[0].name == PrevDirectoryEntryName) {
                setLs([].concat(ls[0], ls.slice(1).reverse()));
            }
            else {
                setLs(ls.reverse());
            }
        }
    }


    const [ls, setLs] = useState([]);
    const [readme, setReadme] = useState<string>("");
    const [contentType, setContentType] = useState<string>("");
    const [SortBy, setSortBy] = useState<SortOpts>(SortOpts.none);
    const [isSortAscending, setSortAscending] = useState<boolean>(true);
    useEffect(() => {
        (async () => {
            window.history.replaceState(null, "", CurrentPath);
            const result: Response = await fetch(api + CurrentPath, { method: "GET", mode: "cors" });
            if (result.ok) {
                const blob: Blob = await result.blob();
                setContentType(blob.type);
                try {
                    setLs(JSON.parse(await blob.text())["content"]);
                    setReadme(JSON.parse(await blob.text())["readme"]);
                } catch (err) { }
            }
        })
    ();
    }, [CurrentPath]);
    useEffect(() => { Sort() }, [SortBy])
    useEffect(() => { SwitchSortDirection(), [isSortAscending] })

    switch (contentType) {
        case ("application/json"): {
            return (
                <>
                    <ul className="list-group">
                        <li className="list-group-item" style={{ display: "flex", left: "0", cursor: "auto" }}>
                            <p style={{ marginTop: "auto", marginBottom: "auto", marginRight: "5px" }}>Kārtot pēc:</p>
                            <button style={{ columnGap: 10 }} {...(SortBy == SortOpts.byName) ? { className: "btn btn-primary" } : { className: "btn btn-outline-primary" }} type="button" onClick={SwitchName}>vārda</button>
                            <p style={{ margin: "2px" }}></p>
                            <button style={{ columnGap: 10 }} {...(SortBy == SortOpts.byDate) ? { className: "btn btn-primary" } : { className: "btn btn-outline-primary" }} type="button" onClick={SwitchDate}>datuma</button>
                        </li>
                        {
                            ls.map((item: FileInfo, i: number) => (
                                <li className="list-group-item" key={"li-" + i}>
                                    <Link onClick={() => {
                                        setCurrentPath(item.path);
                            }} className='Application-List-Entry' style={{ display: "flex", width: "100%", justifyContent: "left", textAlign: "center" }}>
                                        {makeIcon(item.type)}
                                        <p style={{ marginBottom: 0 }}>{item.name}</p>
                                        {
                                            item.time
                                                ? <p style={{ marginLeft: "auto", marginBottom: 0 }}>{new Date(item.time).toLocaleDateString("lv")}</p>
                                                : <></>
                                        }
                                    </Link>
                                </li>
                            ))
                        }
                    </ul>
                    {
                        readme
                            ? <div className='card' style={{marginTop: 8, marginBottom: 8, padding: 8}}><Markdown>{readme}</Markdown></div>
                            : <></>
                    }

                </>
            );
        }
    }
}
export default ListGroup;
