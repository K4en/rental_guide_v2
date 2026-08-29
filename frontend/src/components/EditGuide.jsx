import {useState, useEffect} from "react";
import {updateGuide, loadGuide} from "../services/api";

function EditGuide({currentProperty, setView}){
    const [guideContent, setGuideContent] = useState([]);

    useEffect(() => {
        async function loadEverything(){

            const guide_data = await loadGuide(currentProperty);
            setGuideContent(guide_data);
            console.log(guide_data);
        }

        loadEverything();
    }, [currentProperty]);

     return(
        <div>
            <h1>Edit Guide</h1>

            <div>
                {guideContent.map((guide) => (
                        <div key={guide.sort_order}>
                            <label>{guide.title}</label>
                            <input
                                type="text"
                                value={guide.content}
                                onChange={(e) => {
                                    setGuideContent(
                                        guideContent.map((g) =>
                                            g.sort_order === guide.sort_order
                                                ? { ...g, content: e.target.value }
                                                : g
                                        )
                                    );
                                }}
                            />
                        </div>
                    ))}
            </div>

        <button
            onClick={ async ()=> {
                await updateGuide(currentProperty, guideContent);
                setView("property");
                }}
        >Save guide</button>
        </div>
    );

}

export default EditGuide;