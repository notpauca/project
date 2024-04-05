export default function PathBar() {
    const path: string[] = decodeURI(window.location.pathname).split('/').slice(1, -1);
    const openFile = decodeURI(window.location.pathname).split('/')[path.length + 1];
    return (
        <>
            <div className="container-fluid">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item active">
                            <a className="nav-link" href="/">
                                Sākums
                            </a>
                        </li>
                        {path.map((item: string, i: number) => (
                            <li className="breadcrumb-item active" key={"li-" + i}>
                                <a href={"/" + path.slice(0, i + 1).join('/') + "/"} className="nav-link">{item}</a>
                            </li>
                        ))}
                        {
                            openFile
                                ? <li className="breadcrumb-item active"><a className="nav-link" href={window.location.pathname}>{openFile}</a></li>
                                : <></>
                        }
                    </ol>
                </nav>
            </div>
        </>
    );
}
