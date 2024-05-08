import Cookies from 'cookies'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method == "GET") {
        const cookies = new Cookies(req, res)
        cookies.set('username')
        res.redirect("/")
    } else {
        res.redirect("/")
    }
}