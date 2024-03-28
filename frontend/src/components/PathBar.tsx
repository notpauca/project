export function PathBar() {
    const path: string[] = decodeURI(window.location.pathname).split('/').slice(1,-1);
    const openFile = decodeURI(window.location.pathname).split('/')[path.length+1];
    return (
        <>
            <nav className="navbar navbar-expand-lg shadow-5-strong bg-body-tertiary">
                <div className="container-fluid">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <a className="nav-link" href="/"> 
                                Sākums
                            </a>
                        </li>
                        {path.map((item: string, i: number) => (
                            <li className="nav-item" key={"li-"+i}>
                                <a className="nav-link" href={"/"+path.slice(0, i+1).join('/')+"/"}>{item}</a>
                            </li>
                        ))}   
                        {
                        openFile
                        ? <li className="nav-item"><a className="nav-link" href={window.location.pathname}>{openFile}</a></li>
                        : <></>
                        }
                    </ul>
                </div>
            </nav>
        </>
    );
}