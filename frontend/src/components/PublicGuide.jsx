import {useParams} from "react-router-dom"
import { useState, useEffect } from "react";
import { loadPublicGuide } from "../services/api";

function PublicGuide(){

    const { propertyId } = useParams();

    const [guideContent, setGuideContent] = useState([]);

    useEffect(()=>{
        async function loadPublic(){
            const data = await loadPublicGuide(propertyId);
            setGuideContent(data);
        }
        loadPublic();
    }, [propertyId]);

    return(
        <div>
            <h1>Public Guide</h1>
            {guideContent.map((section) => (
                <div key={section.id}>
                    <h2>{section.title}</h2>
                    <p>{section.content}</p>
                </div>
            ))}
        </div>
    )
}

export default PublicGuide;