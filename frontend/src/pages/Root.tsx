import NavigationBar from '../components/NavigationBar';
import View from './FileView';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import LoginPage from './LoginPage';

const api: string = "http://localhost:3000";
const headers: RequestInit = { method: "GET", mode: "cors" };

export class FileInfo {
    public name: string;
    public type: string;
    public path: string;
    public time: string;
    constructor(name: string, type: string, path: string, time: string) {
        this.name = name;
        this.type = type;
        this.path = path;
        this.time = new Date(time).toString();
    }
}

export const Fetcher = async (path: string) => (await fetch(api + path, headers));

export default function Root() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<><NavigationBar/><Outlet/></>}>
                        <Route path='' element={<View/>}/>
                        <Route path='*' element={<View/>}/>
                        <Route path="login" element={<LoginPage/>}/>
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    );
}