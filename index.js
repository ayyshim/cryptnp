const crypto = require('crypto')

function Cryptnp(SECRET_KEY) {
    this._sk = SECRET_KEY.trim()

    if(this._sk === undefined) throw new Error("Please provide a secret key.")

    if(this._sk === "") throw new Error("Empty secret key is not acceptable.")

    if(typeof this._sk !== "string") throw new Error("Secret key must be a string.")

    const key = crypto.createHash('sha256').update(String(this._sk)).digest()

    this.rail = (data, expiresAt = null) => {
        if(!data) {
            throw new Error("Data can not be undefined or null.")
        }

        const four = crypto.randomBytes(16)
        const cipher = crypto.createCipheriv("aes-256-ctr", key, four)

        const obj = {
            data,
            expiresAt: expiresAt ? Date.now() + expiresAt * 60000 : null
        }

        const encrypted = cipher.update(JSON.stringify(obj), 'utf8', 'hex') + cipher.final('hex')

        return four.toString('hex') + encrypted
    }

    this.derail = (railed_data) => {
        if(!railed_data) {
            throw new Error("Railed data can not be undefined or null.")
        }

        const stringVal = String(railed_data)
        const iv_buff = Buffer.from(stringVal.slice(0, 32), 'hex')
        const encrypted = stringVal.slice(32)

        const derailed = crypto.createDecipheriv("aes-256-ctr", key, iv_buff)

        var returnable = derailed.update(encrypted, 'hex', 'utf8') + derailed.final('utf8')
        
        returnable = JSON.parse(returnable)

        if(returnable.expiresAt) {
            if(returnable.expiresAt < Date.now()) {
                return undefined
            } else {
                return returnable.data
            }
        } else {
            return returnable.data
        }
    
    }

}

module.exports = Cryptnp
