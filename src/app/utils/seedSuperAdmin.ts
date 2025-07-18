import { envVars } from "../confiq/env"
import { IAuthProviders, IUser, Role } from "../confiq/modules/user/user.interface"
import { User } from "../confiq/modules/user/user.model"
import bcryptjs from "bcryptjs"

export const seedSuperAdmin = async () => {
    try {
        const superAdmin = await User.findOne({email : envVars.SUPER_ADMIN_EMAIL})

        if(superAdmin) {
            console.log("Super admin already exists");
            return;
        }

    const hashedPassword = await bcryptjs.hash(envVars.SUPER_ADMIN_PASSWORD, Number(envVars.BCRYPT_SALT_ROUND));
    const authProvider : IAuthProviders = {
        provider : "credentials",
        providerId : envVars.SUPER_ADMIN_EMAIL
    }
    const payload : IUser = {
        name : "Super_Admin",
        role : Role.SUPER_ADMIN,
        email : envVars.SUPER_ADMIN_EMAIL,
        password : hashedPassword,
        isVerified : true,
        auths : [authProvider]

        
    }
    const createSuperAdmin = await User.create(payload)
    console.log(createSuperAdmin);
        
    } catch (error) {
        console.log(error)
        
    }
}