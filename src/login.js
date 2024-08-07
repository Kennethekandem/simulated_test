import {
    users as sampleUsers,
    breaches as sampleBreaches,
} from "./samples";

function authenticate(email, password) {
    const account = sampleUsers.find(a => a.email === email);
    if (account && account.password === password) {
        return account;
    } else {
        return null;
    }
}

async function handleCheck(account) {

    const { lastLogin } = account;
    const url = "https://hackcheck.woventeams.com/api/v4/breachedaccount"
    try {
        const res = await fetch(`${url}/${account.email}`);
        const data = await res.json()
        const filteredData = []
        data.forEach(value => {
            const { isSensitive, DataClasses, AddedDate } = value;

            const modifiedAddedDate = Date.parse(AddedDate)
            const modifiedLastLogin = Date.parse(lastLogin)

            if (!isSensitive && DataClasses.includes('Passwords') && modifiedAddedDate > modifiedLastLogin) {
                filteredData.push(value);
            }
        })
        return filteredData;
    } catch (e) {
        console.log(`error log: ${e}`);
        return [];
    }
}
async function login(email, password) {

    const account = authenticate(email, password)

    if (account) {
        let check = await handleCheck(account)
        if (check.length > 0) {

            const breachedAccounts = check.map((breach, index) => {
                return {
                    name: breach.Name,
                    domain: breach.Domain,
                    breachDate: breach.BreachDate,
                    addedDate: breach.AddedDate
                }
            })
            return {
                success: true,
                suggestPasswordChange: true,
                breachedAccounts
            }
        } else {
            return { success: true };
        }
    } else {
        return {
            success: false,
            message: "The username or password you entered is invalid."
        };
    }
}

export default login;