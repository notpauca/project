import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { pathProvider } from "../pages/Root";


export default function PathBar(props: any) {
    const [currentPath, setCurrentPath] = pathProvider();
    const path = currentPath.split("/").slice(1);

    return (
        <>
            <div className="container-fluid">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item active">
                            <Link className="nav-link" to="/">
                                Sākums
                            </Link>
                        </li>
                        {path.map((item: string, i: number) => (
                            <li className="breadcrumb-item active" key={"li-" + i}>
                                <Link to={path.join('/')} onClick={() => {setCurrentPath(path.join('/')); return true;}} className="nav-link">{item}</Link>
                            </li>
                        ))}
                    </ol>
                </nav>
            </div>
        </>
    );
}
