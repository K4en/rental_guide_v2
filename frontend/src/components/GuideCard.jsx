
function GuideCard({guideContent, setView}){

    return(
            <div
                className="card guide-card"
                onClick={()=>{
                setView("guide");
                }}
            >
            {guideContent.map((guide) => (
                <h3
                    key={guide.id}
                >{guide.title}</h3>
                ))}
            </div>
        )
}

export default GuideCard;