export default {
    checkout(req, res, next) {
        return res.status(200).send("You should only be here if authenticated")
    }
}