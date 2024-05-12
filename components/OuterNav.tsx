import Link from 'next/link'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Session } from 'next-auth';

type Props = {
    address: string | null;
    session: Session;
}

export default function OuterNav({ address, session }: Props) {
    return (
        <div className="w-full container mx-auto">
            <div className="w-full flex items-center justify-between">
                <a className="flex items-center text-indigo-400 no-underline hover:no-underline font-bold text-2xl lg:text-4xl" href="/">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-pink-500 to-purple-500">Runiverse</span><span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-pink-500 to-purple-500">Trail</span>
                </a>

                <div className="flex w-1/2 justify-end content-center">

                    {session ?
                        <>
                            <Link className="inline-block text-blue-300 no-underline hover:text-pink-500 hover:text-underline text-center h-10 p-2 md:h-auto md:p-4 transform hover:scale-125 duration-300 ease-in-out" href="/profile">Profile</Link><br />
                            {/* <Link className="inline-block text-blue-300 no-underline hover:text-pink-500 hover:text-underline text-center h-10 p-2 md:h-auto md:p-4 transform hover:scale-125 duration-300 ease-in-out" href="/game">Game</Link><br /> */}
                            <span className="inline-block mt-2">
                                <ConnectButton />
                            </span>
                        </> :
                        <>
                            <span className="inline-block mt-2">
                                <ConnectButton />
                            </span>
                        </>
                    }
                </div>
            </div>
        </div>
    );
}