import Layout from '../components/Layout';
import { getSession } from 'next-auth/react';
import { getToken } from 'next-auth/jwt';



export default function HomePage({ address, session }) {
    return (
        <Layout pageTitle="Home">
            <div className="flex flex-col items-center gap-3 justify-center w-full h-full min-h-screen bg-custom-pattern bg-no-repeat bg-center bg-[length:800px_700px]">
                <div className="flex flex-col gap-3 items-center justify-cenver mt-20">
                    <h1 className="uppercase text-9xl w-[900px] text-center font-atirose text-yellow">Runiverse.Ai</h1>
                    <p className="text-md uppercase w-[400px] text-center leading-[24px] font-ocra">A never ending, community driven, AI backed Web3 game!</p>
                </div>
                <div>
                <form className="flex flex-col items-center justify-center">
                            <div className="">
                                <input
                                    className="font-ocra text-yellow border border-white bg-transparent px-3 py-2 rounded-xl"
                                    id="emailaddress"
                                    type="text"
                                    placeholder="you@somewhere.com"
                                />
                            </div>

                            <div className="flex items-center justify-between pt-4">
                                <button
                                    className="bg-yellow px-6 py-2 font-ocra uppercase text-sm rounded-xl text-black"
                                    type="button"
                                >
                                    Sign Up
                                </button>
                            </div>
                        </form>
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
};