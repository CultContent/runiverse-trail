import Layout from '../components/Layout';
import OuterNav from '../components/OuterNav';
import { getCookie } from 'cookies-next';
import Link from 'next/link'
import { getSession } from 'next-auth/react';
import { getToken } from 'next-auth/jwt';

export default function ProfilePage({ address, session }) {
    return (
        <Layout pageTitle="Profile">
            <div className="h-full">
                <OuterNav address={address} session={session} />
                {/* Main */}
                <div className="container pt-24 md:pt-36 mx-auto flex flex-wrap flex-col md:flex-row items-center">
                    <div className="flex flex-col w-full md:w-2/3 justify-center lg:items-start overflow-y-hidden">
                        <h1 className="my-4 text-3xl md:text-5xl text-white opacity-75 font-bold leading-tight text-center md:text-left">Character List</h1>
                    </div>
                    <div className="flex flex-col w-full md:w-1/3 justify-center lg:items-start overflow-y-hidden">
                        <a href="/game"><button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded">Play the Game</button></a>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export async function getServerSideProps(context) {
    const session = await getSession(context);
    const token = await getToken({ req: context.req });

    const address = token?.sub ?? null;

    return {
        props: {
            address,
            session,
        },
    };
}