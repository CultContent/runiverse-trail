import Layout from '../components/layout'
import { getCookie } from 'cookies-next';
import { getGameData } from './api/game';
import OuterNav from '../components/OuterNav';
import Footer from '../components/Website/Footer/Footer';
import supabase from '../utils/supabase';
import GameChoiceCard from '../components/gameChoiceCard';

export default function GamePage({ username, gameData }) {
    return (
        <Layout pageTitle="Game">
            <div class="h-full">
                <OuterNav username={username} />

                {/* Main */}
                <div class="container pt-24 md:pt-36 mx-auto flex flex-wrap flex-col md:flex-row items-center">
                    <div class="flex flex-col w-full md:w-2/3 justify-center lg:items-start overflow-y-hidden">
                        <img class="mx-auto w-full md:w-4/5" src={gameData.primaryImageUri} />
                    </div>
                    <div class="flex flex-col w-full md:w-1/3 justify-center lg:items-start overflow-y-hidden">
                        <p class="text-2xl"><em>{gameData.primaryPromptText}</em></p>
                    </div>
                </div>

                {/* Choices */}
                <div class="container pt-24 md:pt-36 mx-auto flex gap-4 md:flex-nowrap flex-wrap flex-col md:flex-row items-center">
                    <div class="w-1/2 md:w-1/4 justify-center lg:items-start overflow-y-hidden items-center order-solid" >
                        <button class="p-4 w-full"><GameChoiceCard choiceTitle={gameData.choices[0].Title} choiceType={gameData.choices[0].Type} choiceFlavorText={gameData.choices[0].Flavor} /></button>
                    </div>
                    <div class="w-1/2 md:w-1/4 justify-center lg:items-start overflow-y-hidden items-center order-solid" >
                        <button class="p-4 w-full"><GameChoiceCard choiceTitle={gameData.choices[1].Title} choiceType={gameData.choices[1].Type} choiceFlavorText={gameData.choices[1].Flavor} /></button>
                    </div>
                    <div class="w-1/2 md:w-1/4 justify-center lg:items-start overflow-y-hidden items-center order-solid" >
                        <button class="p-4 w-full"><GameChoiceCard choiceTitle={gameData.choices[2].Title} choiceType={gameData.choices[2].Type} choiceFlavorText={gameData.choices[2].Flavor} /></button>
                    </div>
                    <div class="w-1/2 md:w-1/4 justify-center lg:items-start overflow-y-hidden items-center order-solid" >
                        <button class="p-4 w-full"><GameChoiceCard choiceTitle={gameData.choices[3].Title} choiceType={gameData.choices[3].Type} choiceFlavorText={gameData.choices[3].Flavor} /></button>
                    </div>
                </div>

                <Footer />
            </div>
        </Layout>
    );
}

export async function getServerSideProps(context) {
    const req = context.req
    const res = context.res
    var username = getCookie('username', { req, res });
    if (username == undefined) {
        return {
            redirect: {
                permanent: false,
                destination: "/"
            }
        }
    }

    // Get user by username
    const { data: profiles } = await supabase.from('profiles').select().eq('username', username.toLowerCase())
    if (profiles == null) {
        res.redirect("/");
        return;
    }

    // Get initial game data
    const game_data = await getGameData();

    const user = profiles[0]
    return {
        props: { username: username, gameData: game_data },
    }
}