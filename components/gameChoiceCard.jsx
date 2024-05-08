export default function GameChoiceCard({ choiceTitle, choiceType, choiceFlavorText }) {

    return (
        <div class="card-container">

            <div class="card-background">

                <div class="card-frame">

                    <div class="frame-header">
                        <h1 class="name">{choiceTitle}</h1>
                    </div>

                    <div class="frame-text-box">
                        <p class="flavour-text">"{choiceFlavorText}"</p>
                    </div>
                </div>

            </div>

        </div>
    )
}