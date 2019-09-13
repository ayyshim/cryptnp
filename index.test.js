const CryptNp = require('./index')

/*
    => Creating an instance

    "deepestsecret" or anything you
    can think of is a secret key
    used to rail or derail your data.
*/
const cnp = new CryptNp("deepestsecret")

/*
    .rail(data, expiresAt?)
    data : data can be object, string, integer or anything.
    expiresAt : It is an optional. If you leave it blank then your
                railed data will never expire. Expiry time limit should
                be set in minutes value.
*/
const railed = cnp.rail({msg: "Hello world!"}, 20) // 20 =  20 minutes

/*
    .derailed(railed)
    railed: railed data
*/
const derailed = cnp.derail(railed) 

console.log(railed)
console.log(derailed) // this will return undefined after 20minutes since it is generated