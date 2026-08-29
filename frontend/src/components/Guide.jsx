import {useState, useEffect} from "react";
import {loadGuide} from "../services/api";

function Guide({currentProperty}){
    const [guideContent, setGuideContent] = useState([]);
    useEffect(() => {
        async function getGuide(){

            const data = await loadGuide(currentProperty);
            setGuideContent(data);
        }
        getGuide();
    }, [currentProperty]);
    return(
        <div className="guide-document">
            <h1>Guide</h1>
            {guideContent.map((guide, index) => (
                <div
                    className="guide-section"
                    key={guide.id}>
                    <h3>{guide.title}</h3>
                    <p>{guide.content}</p>
                    {index < guideContent.length - 1 &&
                        (<hr />)}
                </div>
            ))}
        </div>
    )

}

export default Guide;