export default function GameChoiceCard({ choiceTitle, choiceType, choiceFlavorText }) {

    return (
        <div className="card-container">

            <div className="card-background">

                <div className="card-frame">

                    <div className="frame-header">
                        <h1 className="name">{choiceTitle}</h1>
                    </div>

                    <div className="frame-text-box">
                        <p className="flavour-text">"{choiceFlavorText}"</p>
                    </div>
                </div>

            </div>

        </div>
    )
}