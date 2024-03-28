import { file } from "bun";
import { parseJsonText } from "typescript";
const path = require('path');

const fs = require("fs").promises;

const root_path = "/Users/pauca/Desktop/";

Bun.serve({
    port: 3000,
    async fetch(req) {
        const path: string = decodeURI(new URL(req.url).pathname);
        return await GetFileButtonArray(path);
    }
});

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
            return new Response(await Bun.file(root_path + path), { headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "*" } });
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
            return new Response(JSON.stringify(res), {
                headers: { "content-type": "application/json", "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "*" }
            });
        }
    }
    catch (err) {
        return new Response(null, { status: 404 });
    }
    return new Response(null, { status: 404 });

}

console.log("running!\n");
