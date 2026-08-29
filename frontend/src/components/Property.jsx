import {useState, useEffect} from "react";
import {loadProperty, loadGuide, deleteGuide} from "../services/api";
import GuideCard from "./GuideCard";
import {QRCodeSVG} from "qrcode.react";

function Property({setView, currentProperty}){
    const [property, setProperty] = useState(null);
    const [guideContent, setGuideContent] = useState([]);

    const publicUrl = `${window.location.origin}/guide/${property?.id}`;
    useEffect(() => {
        async function loadEverything(){

            const property_data = await loadProperty(currentProperty);
            setProperty(property_data);

            const guide_data = await loadGuide(currentProperty);
            setGuideContent(guide_data);
            console.log(guide_data);
        }

        loadEverything();
    }, [currentProperty]);

    return (
    <div>
        <h1>🏠{property?.name}</h1>
        <p>📍{property?.address}</p>
        {guideContent.length === 0 ? (
            <button
                className="primary-btn"
                onClick={()=>
                setView("add-guide")}
            >+ Add Guide</button>
        ):(
            <div>
            <GuideCard
                     guideContent={guideContent}
                     setView={setView}
            />
            <a href={publicUrl} target="_blank" rel="noreferrer">
                {publicUrl}
            </a>
            <button
                className="primary-btn"
                onClick={() => {
                    navigator.clipboard.writeText(publicUrl);
                }}
            >
                Copy Public Link
            </button>
            <QRCodeSVG
    value={publicUrl}
    size={200}
    marginSize={4}
/>


            <button
                className="primary-btn"
                onClick={() => {
                    window.open(`/guide/${property?.id}`, "_blank")
                }}
            >View Public Guide</button>

            <button
                className="primary-btn"
                onClick={()=>{
                    setView("edit-guide")}}
            >Edit Guide</button>
            <button
                className="primary-btn danger-btn"
                onClick={async() => {
                    await deleteGuide(currentProperty);
                    setGuideContent([]);
                    }}
            >- Delete Guide</button>

            </div>
        )}
    </div>
    )
}

export default Property;