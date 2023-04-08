//mongoose error handle 하는 미들웨어

module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next);
    }
}