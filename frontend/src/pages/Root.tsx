import NavigationBar from '../components/NavigationBar';
import View from './ContentView';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginPage from './LoginPage';
import FilePreview from '../components/OpenFile';
import TimeTable from '../components/TimeTable';
import { Context, createContext, useContext, useState } from 'react';


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

export function pathProvider() {
    if(window.location.pathname!="/login") {
        const [globalPath, setGlobalPath] = useState<string>(window.location.pathname);
        console.log(globalPath);
        return [globalPath, setGlobalPath];
    }
}

export default function Root() {
    return (
        <>
            <BrowserRouter>
                <NavigationBar/>
                <Routes>
                    <Route path="/login" element={<LoginPage/>}/>
                    <Route path='/file/*' element={<FilePreview />}/>
                    <Route path='/' element={<View />}/>
                    <Route path='/*' element={<View />}/>
                    <Route path='/timetable' element={<TimeTable/>}/>
                </Routes>
            </BrowserRouter>
        </>
    );
}