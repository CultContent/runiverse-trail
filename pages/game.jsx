import Layout from '../components/Layout';
import { getCookie } from 'cookies-next';
import { getGameData } from './api/game';
import OuterNav from '../components/OuterNav';
import Footer from '../components/Website/Footer/Footer';
import supabase from '../utils/supabase';
import GameChoiceCard from '../components/Game/GameChoiceCard/GameChoiceCard';
import { getSession } from 'next-auth/react';
import { getToken } from 'next-auth/jwt';

export default function GamePage({ address, session, gameData }) {
    return (
        <Layout pageTitle="Game">
            <div className="h-full">
                <OuterNav address={address} session={session} />

                {/* Main */}
                <div className="container pt-24 md:pt-36 mx-auto flex flex-wrap flex-col md:flex-row items-center">
                    <div className="flex flex-col w-full md:w-2/3 justify-center lg:items-start overflow-y-hidden">
                        <img className="mx-auto w-full md:w-4/5" src={gameData.primaryImageUri} />
                    </div>
                    <div className="flex flex-col w-full md:w-1/3 justify-center lg:items-start overflow-y-hidden">
                        <p className="text-2xl"><em>{gameData.primaryPromptText}</em></p>
                    </div>
                </div>

                {/* Choices */}
                <div className="container pt-24 md:pt-36 mx-auto flex gap-4 md:flex-nowrap flex-wrap flex-col md:flex-row items-center">
                    <div className="w-1/2 md:w-1/4 justify-center lg:items-start overflow-y-hidden items-center order-solid" >
                        <button className="p-4 w-full"><GameChoiceCard choiceTitle={gameData.choices[0].Title} choiceType={gameData.choices[0].Type} choiceFlavorText={gameData.choices[0].Flavor} /></button>
                    </div>
                    <div className="w-1/2 md:w-1/4 justify-center lg:items-start overflow-y-hidden items-center order-solid" >
                        <button className="p-4 w-full"><GameChoiceCard choiceTitle={gameData.choices[1].Title} choiceType={gameData.choices[1].Type} choiceFlavorText={gameData.choices[1].Flavor} /></button>
                    </div>
                    <div className="w-1/2 md:w-1/4 justify-center lg:items-start overflow-y-hidden items-center order-solid" >
                        <button className="p-4 w-full"><GameChoiceCard choiceTitle={gameData.choices[2].Title} choiceType={gameData.choices[2].Type} choiceFlavorText={gameData.choices[2].Flavor} /></button>
                    </div>
                    <div className="w-1/2 md:w-1/4 justify-center lg:items-start overflow-y-hidden items-center order-solid" >
                        <button className="p-4 w-full"><GameChoiceCard choiceTitle={gameData.choices[3].Title} choiceType={gameData.choices[3].Type} choiceFlavorText={gameData.choices[3].Flavor} /></button>
                    </div>
                </div>

                <Footer />
            </div>
        </Layout>
    );
}

export async function getServerSideProps(context) {
    const session = await getSession(context);
    const token = await getToken({ req: context.req });

    const address = token?.sub ?? null;

    // Get initial game data
    const game_data = await getGameData();

    return {
        props: { address, session, gameData: game_data },
    }
}