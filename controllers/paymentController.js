export default {
    checkout(req, res, next) {
        return res.status(200).send("If you see this, it means you are a logged in user")
    }
}