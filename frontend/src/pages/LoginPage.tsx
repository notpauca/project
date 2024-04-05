import React, { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"


const api: string = "http://localhost:3000";

export default function LoginPage(): JSX.Element {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');

    const navigate = useNavigate();

    async function submit() {
        setLoginError("");
        if ('' == password || '' == username) {
            setLoginError("nepareizs lietotājvārds / parole!");
        }
        const result = fetch(api+"/auth", {
            method: "POST", 
            headers: {
                "Content-Type": "text/plain", 
            },
            body: JSON.stringify({"username":username, "password":password})
        }).then(result => {
            return result.text();
        })
        if (await result == "wowsers") {
            setLoginError("works!");
        }
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
