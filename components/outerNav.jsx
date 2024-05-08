import Link from 'next/link'

export default function OuterNav({ username }) {
    return (
        <div class="w-full container mx-auto">
            <div class="w-full flex items-center justify-between">
                <a class="flex items-center text-indigo-400 no-underline hover:no-underline font-bold text-2xl lg:text-4xl" href="/">
                    <span class="bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-pink-500 to-purple-500">Runiverse</span><span class="bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-pink-500 to-purple-500">Trail</span>
                </a>

                <div class="flex w-1/2 justify-end content-center">

                    {username ?
                        <>
                            <h2 class="inline-block text-blue-300 no-underline hover:text-pink-500 hover:text-underline text-center h-10 p-2 md:h-auto md:p-4 transform hover:scale-125 duration-300 ease-in-out">Hi {username}</h2>
                            <Link class="inline-block text-blue-300 no-underline hover:text-pink-500 hover:text-underline text-center h-10 p-2 md:h-auto md:p-4 transform hover:scale-125 duration-300 ease-in-out" href="/profile">Profile</Link><br />
                            <Link class="inline-block text-blue-300 no-underline hover:text-pink-500 hover:text-underline text-center h-10 p-2 md:h-auto md:p-4 transform hover:scale-125 duration-300 ease-in-out" href="/game">Game</Link><br />
                            <Link class="inline-block text-blue-300 no-underline hover:text-pink-500 hover:text-underline text-center h-10 p-2 md:h-auto md:p-4 transform hover:scale-125 duration-300 ease-in-out" href="/api/logout">Logout</Link>
                        </> :
                        <>
                            <Link class="inline-block text-blue-300 no-underline hover:text-pink-500 hover:text-underline text-center h-10 p-2 md:h-auto md:p-4 transform hover:scale-125 duration-300 ease-in-out" href="/login">Login</Link><br />
                            <Link class="inline-block text-blue-300 no-underline hover:text-pink-500 hover:text-underline text-center h-10 p-2 md:h-auto md:p-4 transform hover:scale-125 duration-300 ease-in-out" href="/signup">Signup</Link>
                        </>
                    }
                </div>
            </div>
        </div>
    );
}