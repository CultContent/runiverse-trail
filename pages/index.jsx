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

                <img className="-mt-[180px]" src="/img/bg1.png" alt="bg"/>
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

            <div className="bg-[#28248c]  flex flex-col gap-12 h-full">
                <div className="mt-24 h-[500px] flex flex-row justify-center gap-6 p-12">
                    <div className="w-[600px] flex items-center justify-center ">
                        <Image className="rounded-none container_img hover:rotate-0 ease-in-out duration-300 rotate-[-9deg] cursor-pointer" width={600} src="/img/bs.png" alt="pic"/>
                    </div>
                    <div className="w-[600px] flex flex-col items-center justify-center">
    
                        <h1 className="w-[500px] text-[#E3FF37] text-4xl font-upheav">PLAY WITH FRIENDS</h1>
                        <p className="w-[500px] font-vcr">Give life to your land by managing crops and raising animals. Get energy from your harvest and use it to expand the universe.</p>
               
                    </div>
                </div>

                <div className="h-[500px] flex flex-row-reverse justify-center gap-6 p-12">
                    <div className="w-[600px] flex items-center justify-center ">
                        <Image className="rounded-none container_img rotate-[9deg] hover:rotate-0 ease-in-out duration-300 cursor-pointer" width={600} src="/img/bs.png" alt="pic"/>
                    </div>
                    <div className="w-[600px] flex flex-col items-center justify-center">
    
                        <h1 className="w-[500px] text-[#E3FF37] text-4xl font-upheav">EARN REWARDS</h1>
                        <p className="w-[500px] font-vcr">Co-operation makes the world go round. You can collaborate with your friends or conspire against them. The choice is yours.</p>
               
                    </div>
                </div>

                <div className="mb-24 h-[500px] flex flex-row justify-center gap-6 p-12">
                    <div className="w-[600px] flex items-center justify-center ">
                        <Image className="rounded-none container_img rotate-[-9deg] hover:rotate-0 ease-in-out duration-300 cursor-pointer" width={600} src="/img/bs.png" alt="pic"/>
                    </div>
                    <div className="w-[600px] flex flex-col items-center justify-center">
    
                        <h1 className="w-[500px] text-[#E3FF37] text-4xl font-upheav">BUILD YOUR OWN WORLD</h1>
                        <p className="w-[500px] font-vcr">Every pixel holds the potential to be something amazing. Use the energy in the land to give life to your imagination.</p>
               
                    </div>
                </div>
            </div>
            
            <div className="bg-[url('/img/border2.png')] h-[225px] bg-auto w-full">
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