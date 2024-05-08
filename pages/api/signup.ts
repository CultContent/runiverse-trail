import Cookies from 'cookies'
import supabase from '../../utils/supabase'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method == "POST") {

        // Collect user signup required data
        const username = req.body['username']
        const wallet = req.body['wallet']

        console.log("Usersname %s, Wallet %s", username, wallet);

        // Check if the user already exists
        const { data: profiles } = await supabase.from('profiles').select().eq('username', username)
        if (profiles != null && profiles.length > 0) {
            res.redirect("/signup?msg=A user already has this username");
            return;
        }

        // Inser the new user profile
        const { error } = await supabase
            .from('profiles')
            .insert({ username: username, wallet_address: wallet })

        // Check for insert errors
        if (error != null) {
            console.log("Database Error:", error)
            res.redirect("/signup?msg=There was a database error");
            return;
        }

        const cookies = new Cookies(req, res)
        cookies.set('username', username)
        res.redirect("/")
    } else {
        res.redirect("/")
    }
}