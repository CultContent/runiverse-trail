import Layout from '../components/Layout';
import { getCookie } from 'cookies-next';
import Link from 'next/link'
import supabase from '../../utils/supabase'

export default function ProfilePage({ username, created }) {
    return (
        <Layout pageTitle="Profile">
            <Link href="/">Home</Link><br />
            <h2>{username}'s Profile</h2>
            <p>Account created at <strong>{created}</strong></p>
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

    const user = profiles[0]
    const created = user.created_at;
    return {
        props: { username: username, created: created },
    }
}