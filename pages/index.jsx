import Layout from '../components/Layout';
import OuterNav from '../components/OuterNav';
import Footer from '../components/Website/Footer/Footer';
import { getSession } from 'next-auth/react';
import { getToken } from 'next-auth/jwt';

export default function HomePage({ address, session }) {
    return (
        <Layout pageTitle="Home">
            <div className="h-full">
                <OuterNav address={address} session={session} />

                {/* Main */}
                <div className="container pt-24 md:pt-36 mx-auto flex flex-wrap flex-col md:flex-row items-center">
                    {/* Left-col */}
                    <div className="flex flex-col w-full xl:w-2/5 justify-center lg:items-start overflow-y-hidden">
                        <h1 className="my-4 text-3xl md:text-5xl text-white opacity-75 font-bold leading-tight text-center md:text-left">
                            Welcome to
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-pink-500 to-purple-500">
                                Runiverse Trail
                            </span>
                            the game!
                        </h1>
                        <p className="leading-normal text-base md:text-2xl mb-8 text-center md:text-left">
                            A never ending, community driven, AI backed Web3 game!
                        </p>

                        <form className="bg-gray-900 opacity-75 w-full shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4">
                            <div className="mb-4">
                                <label className="block text-blue-300 py-2 font-bold mb-2" htmlFor="emailaddress">
                                    Signup to receive updates on game progress
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full p-3 text-gray-700 leading-tight focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
                                    id="emailaddress"
                                    type="text"
                                    placeholder="you@somewhere.com"
                                />
                            </div>

                            <div className="flex items-center justify-between pt-4">
                                <button
                                    className="bg-gradient-to-r from-purple-800 to-green-500 hover:from-pink-500 hover:to-green-500 text-white font-bold py-2 px-4 rounded focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
                                    type="button"
                                >
                                    Sign Up
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Right-col */}
                    <div className="w-full xl:w-3/5 p-12 overflow-hidden">
                        <img className="mx-auto w-full md:w-4/5 transform -rotate-6 transition hover:scale-105 duration-700 ease-in-out hover:rotate-6" src="https://zork.nyc3.cdn.digitaloceanspaces.com/runiverse-sample-1.png" />
                    </div>

                    {/* Footer */}
                    <Footer />
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