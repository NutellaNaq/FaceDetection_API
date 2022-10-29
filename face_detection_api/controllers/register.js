
const handleRegister = (db, bcrypt) => (req, res) => {
    const { mail, name, password} = req.body;
    if(!mail || !name || !password) {
       return res.status(400).json('incorrect form submission')
    }
    var hash = bcrypt.hashSync(password);
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: mail
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
                return trx('users')
                .returning('*')
                .insert({
                email: loginEmail[0].email,
                name: name,
                joined: new Date()
            }).then(user => {
                res.json(user[0]);
                console.log(loginEmail[0])
            })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(err => res.status(400).json('unable to register'))
}

export default {
    handleRegister
}