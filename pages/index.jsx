import Layout from '../components/Layout';
import OuterNav from '../components/OuterNav';
import Footer from '../components/Website/Footer/Footer';
import { Image } from '@nextui-org/image';
import { getSession } from 'next-auth/react';
import { getToken } from 'next-auth/jwt';
import styles from '../app/pixelbutton.module.css'

export default function HomePage({ address, session }) {
    return (
        <Layout pageTitle="Home">
            <div className="flex flex-col items-center  h-full bg-[#622aff]">
                <div className="flex flex-col items-center justify-cenver mt-20">
                    <h1 className="uppercase text-8xl w-[900px] text-center leading-[60px] font-upheav">Welcome to Runiverse Trail <br/>the game</h1>
                    <p className="mt-8 font-vcr text-2xl w-[400px] text-center leading-[24px]">A never ending, community driven, AI backed Web3 game!</p>
                </div>
                <div>
                <form className="flex flex-col items-center justify-center mt-6">
                            <div className="">
                                <input
                                    className={styles.pixel_input}
                                    id="emailaddress"
                                    type="text"
                                    placeholder="you@somewhere.com"
                                />
                            </div>

                            <div className="flex items-center justify-between pt-4">
                                <button
                                    className={styles.pixel_button}
                                    type="button"
                                >
                                    Sign Up
                                </button>
                            </div>
                        </form>
                </div>

                <img src="/img/bg.png" alt="bg"/>
            </div>

            <div className="w-full bg-[#e3ff37] flex flex-row justify-center gap-10">
                <h1 className="uppercase text-3xl p-3 text-[#222044] font-upheav">Coming soon!</h1>
                <h1 className="uppercase text-3xl p-3 text-[#222044] font-upheav">Coming soon!</h1>
                <h1 className="uppercase text-3xl p-3 text-[#222044] font-upheav">Coming soon!</h1>
                <h1 className="uppercase text-3xl p-3 text-[#222044] font-upheav">Coming soon!</h1>
                <h1 className="uppercase text-3xl p-3 text-[#222044] font-upheav">Coming soon!</h1>
                <h1 className="uppercase text-3xl p-3 text-[#222044] font-upheav">Coming soon!</h1>
                <h1 className="uppercase text-3xl p-3 text-[#222044] font-upheav">Coming soon!</h1>
            </div>

            <div className="bg-[url('/img/border.png')] h-[130px] bg-auto w-full">
            </div>

            <div className="bg-[#622aff] py-10 flex flex-col items-center justify-center">
                <div className="flex flex-row gap-6 w-[50%] ">
                    <div className="w-full  flex flex-col justify-center items-center">
                        <h1 className="w-[400px] text-[#E3FF37] text-4xl font-upheav">Where communities come to life</h1>
                        <p className="w-[400px] font-vcr">A never ending, community driven, AI backed Web3 game! A never ending, community driven, AI backed Web3 game!</p>
                    </div>
                    <div className="flex justify-center w-full">
                        <Image src="/img/image.png" alt="char" width={200}/>
                    </div>
                </div>

                <div className="flex flex-row gap-6 items-center mt-12 mb-12">
                    <div className="flex flex-col justify-between w-[250px] ease-in-out duration-300 h-[330px] hover:w-[330px] bg-[#222044] px-4 py-8 hover:bg-[#403c7f] cursor-pointer container_div">
                        <Image className="container_div rounded-none" src="/img/bs.png" alt="blacksand"/>
                        <p className="font-upheav text-4xl">Blacksand</p>
                    </div>
                    <div className="flex flex-col justify-between w-[250px] ease-in-out duration-300 h-[330px] hover:w-[330px] bg-[#222044] px-4 py-8 hover:bg-[#403c7f] cursor-pointer container_div">
                        <Image className="container_div rounded-none" src="/img/bs.png" alt="blacksand"/>
                        <p className="font-upheav text-4xl">Blacksand</p>
                    </div>
                    <div className="flex flex-col justify-between w-[250px] ease-in-out duration-300 h-[330px] hover:w-[330px] bg-[#222044] px-4 py-8 hover:bg-[#403c7f] cursor-pointer container_div">
                        <Image className="container_div rounded-none" src="/img/bs.png" alt="blacksand"/>
                        <p className="font-upheav text-4xl">Blacksand</p>
                    </div>
                    <div className="flex flex-col justify-between w-[250px] ease-in-out duration-300 h-[330px] hover:w-[330px] bg-[#222044] px-4 py-8 hover:bg-[#403c7f] cursor-pointer container_div">
                        <Image className="container_div rounded-none" src="/img/bs.png" alt="blacksand"/>
                        <p className="font-upheav text-4xl">Blacksand</p>
                    </div>
                </div>

                <button
                                    className={styles.pixel_button}
                                    type="button"
                                >
                                    Play Now!
                </button>
            </div>

            <div className="bg-[url('/img/border1.png')] h-[135px] bg-auto w-full">
            </div>

            <div className="bg-[#28248c] h-screen">

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