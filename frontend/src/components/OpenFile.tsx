import { Link } from "react-router-dom";
const api = "http://localhost:3000"


export default function FilePreview(props: any) {
    switch (props.fileType) {
        case ("image/jpeg"):
        case ("image/webp"):
        case ("image/png"): {
            return (
                <img className="rounded mx-auto d-block" src={api + props.Path} />
            );
        }
        case ("audio/mpeg"):
        case ("audio/wav"): {
            return (
                <audio className="rounded mx-auto d-block" controls>
                    <source src={props.Path} type={props.fileType} />
                </audio>
            );
        }
        case ("video/mp4"):
        case ("video/ogg"):
        case ("video/webm"): {
            return (
                <video className="rounded mx-auto d-block" controls>
                    <source src={props.Path} type={props.fileType} />
                </video>
            );
        }
        case ("application/pdf"): {
            return (
                <Link to={props.Path}>open file</Link>
            );
        }
        case (""): {
            return (
                <p style={{ color: "white" }}>Loading...</p>

            )
        }
        default: {
            return (
                <Link to={props.Path}>Download file</Link>
            );
        }
    }
};