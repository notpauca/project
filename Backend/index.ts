import { file, password } from "bun";
import { parseJsonText } from "typescript";
import bcrypt from 'bcryptjs'
const path = require('path');
import * as sqlite3 from 'sqlite3';
const db = new sqlite3.Database('psw.db');


const headers = {
    "content-type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*"
};

const fs = require("fs").promises;

const root_path = "/Users/pauca/Desktop/";

function getSalt(username: string) {
    return new Promise<string>((resolve, reject) => {
        db.get('SELECT salt FROM users WHERE username = ?', [username], (err, row) => {
            if (err) {
                reject(err);
            } else {
                if (row) {
                    resolve(row.salt);
                } else {
                    resolve(null);
                }
            }
        });
    });
}

function checkPassword(username: string, password: string) {
    return new Promise<boolean>((resolve, reject) => {
        db.get('SELECT salt FROM users WHERE username = ? AND password = ?', [username, password], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row?true:false);
            }
        });
    });
}

Bun.serve({
    port: 3000,
    async fetch(req) {
        const path: string = decodeURI(new URL(req.url).pathname);
        console.log(path);
        if (path == "/auth") {
            const Credientials = JSON.parse(await (await req.blob()).text());
            return new Response(await getSalt(Credientials["username"]), { headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "*" } });
        }
        else if (path == "/verify") {
            const body = JSON.parse(await (await req.blob()).text());
            console.log(body);
            if (await checkPassword(body["username"], body["password"])) {
                return new Response("YOU STILL HAVE TO MAKE SESSIONS WORK, DIPSHIT!", { headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "*" } });
            }
            return new Response(null, { headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "*" } });
        }
        else if (path == "/timetable") {
            return new Response("not ready!");
        }
        return await GetFileButtonArray(path);
        }
    }
);

class FileInfo {
    private name: string;
    private type: string;
    private path: string;
    private time: string;
    constructor(name: string, type: string, path: string, time: string) {
        this.name = name;
        this.type = type;
        this.path = path;
        this.time = time;
    }
}

async function GetFileButtonArray(path: string): Promise<Response> {
    try {
        const fileInfo = await fs.stat(root_path + path);
        if (fileInfo.isFile()) {
            return new Response(Bun.file(root_path + path), { headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "*" } });
        }
        else if (fileInfo.isDirectory()) {
            if (path[path.length - 1] != '/') {
                path = path.concat("/");
            }
            const res = [];
            const Names: string[] = await fs.readdir(root_path + path);
            if (path != "/".repeat(path.length)) {
                res.push(new FileInfo("Previous directory", "folder", path + "../", ""));
            }
            for (const element of Names) {
                const childInfo = await fs.stat(root_path + path + element);
                if (childInfo.isDirectory()) {
                    res.push(new FileInfo(element, "folder", path + element + "/", childInfo.birthtime));
                }
                else if (childInfo.isFile()) {
                    res.push(new FileInfo(element, element.substring(element.lastIndexOf('.') + 1), path + element, childInfo.birthtime));
                }
            }

            if (Names.indexOf("readme.md") != -1) {
                const readme: string = await fs.readFile(root_path + "readme.md", "utf-8");
                return new Response(JSON.stringify({
                    "content": res,
                    "readme": readme
                }), {
                    headers: headers
                });
            }
            return new Response(JSON.stringify({
                "content": res,
                "readme": null
            }), {
                headers: headers
            });
        }
    }
    catch (err) {
        return new Response(null, { status: 404 });
    }
    return new Response(null, { status: 404 });

}

console.log("running!\n");
