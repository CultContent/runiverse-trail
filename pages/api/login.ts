import Cookies from 'cookies'
import supabase from '../../utils/supabase'
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method == "POST") {

        // Collect sign-in data
        const username = req.body['username']

        // Gather user information from Database
        const { data: profiles } = await supabase.from('profiles').select().eq('username', username.toLowerCase())
        // Handle a null response
        if (profiles == null) {
            res.redirect("/login?msg=Invalid username");
            return;
        }

        const cookies = new Cookies(req, res)
        cookies.set('username', username)
        res.redirect("/")

    } else {
        res.redirect("/")
    }
}