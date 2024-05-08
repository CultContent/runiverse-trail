import Layout from '../components/Layout';
import { getCookie } from 'cookies-next';
import OuterNav from '../components/OuterNav';
import Footer from '../components/Website/Footer/Footer';
import { useRouter } from 'next/router'

export default function LoginPage({ username }) {
    const router = useRouter()
    const { msg } = router.query
    return (
        <Layout pageTitle="Login">
            <div class="h-full">

                {msg ?
                    <div class="w-full container mx-auto bg-red-600">
                        <h3>{msg}</h3>
                    </div>
                    :
                    <></>
                }

                <OuterNav username={username} />

                <div class="container pt-24 md:pt-36 mx-auto flex flex-wrap flex-col md:flex-row items-center">
                    <div class="w-full container mx-auto">
                        <div class="w-full flex items-center justify-between">
                            <h1 class="my-4 text-3xl md:text-5xl text-white opacity-75 font-bold leading-tight text-center md:text-left">
                                <span class="bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-pink-500 to-purple-500">
                                    Login
                                </span>
                            </h1>
                        </div>
                        <div class="w-full flex items-center justify-between">

                            <form class="bg-gray-900 opacity-75 w-full shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4" action='/api/login' method='POST'>
                                <div class="mb-4">
                                    <label class="block text-blue-300 py-2 font-bold mb-2" for="username">
                                        Enter Username
                                    </label>
                                    <input
                                        class="shadow appearance-none border rounded w-full p-3 text-gray-700 leading-tight focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
                                        id="username"
                                        type="text"
                                        placeholder="username"
                                        name="username"
                                        minLength="3"
                                        required
                                    />
                                </div>
                                <div class="flex items-center justify-between pt-4">
                                    <button
                                        class="bg-gradient-to-r from-purple-800 to-green-500 hover:from-pink-500 hover:to-green-500 text-white font-bold py-2 px-4 rounded focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
                                        type="submit"
                                    >
                                        Submit
                                    </button>
                                </div>
                            </form>
                        </div>
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
    if (username != undefined) {
        return {
            redirect: {
                permanent: false,
                destination: "/"
            }
        }
    }
    return { props: { username: false } };
};