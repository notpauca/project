import React, { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"

import bcrypt from 'bcryptjs'

const api: string = "http://localhost:3000";

export default function LoginPage(): React.JSX.Element {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loginError, setLoginError] = useState<string>('');

    const navigate = useNavigate();

    async function submit() {
        setLoginError("");
        if ('' == password || '' == username) {
            setLoginError("nepareizs lietotājvārds / parole!");
        }
        const salt = await fetch(api+"/auth", {
            method: "POST", 
            headers: {
                "Content-Type": "text/plain", 
            },
            body: JSON.stringify({"username":username})
        }).then(result => {
            return result.text();
        })
        if (!salt) {setLoginError("Nepareizs lietotājvārds!"); return; }
        console.log(salt);
        const passwd = bcrypt.hashSync(password, await salt);
        console.log(passwd);
        const userID = fetch(api+"/verify", {
            method: "POST", 
            headers: {
                "Content-Type": "text/plain", 
            },
            body: JSON.stringify({"username":username, "password":passwd})
        }).then(result => {
            return result.text();
        });

    }

    return (
        <form>
            <div className="mb-3">
                <label className="form-label">Lietotājvārds:</label>
                <input value={username} onChange={(e) => setUsername(e.target.value)} type="username" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"/>
            </div>
            <div className="mb-3">
                <label className="form-label">Parole:</label>
                <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"/>
            </div>
            <input type="button" onClick={submit} className="btn btn-primary" value={"Ieiet"}/>
            <label className="loginError">{loginError}</label>
        </form>
    )
};
