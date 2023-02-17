
// backend/utils/auth.js
const jwt = require('jsonwebtoken');

const { jwtConfig } = require('../config');
const { User, Group } = require('../db/models');

const { secret, expiresIn } = jwtConfig;

// sendsa jwt cookie
const setTokenCookie = (res, user) => {
    // create the token.
    const token = jwt.sign(
        { data: user.toSafeObject() },
        secret,
        { expiresIn: parseInt(expiresIn) }
    );

    const isProduction = process.env.NODE_ENV === 'production';

    //Set the token cookie
    res.cookie('token', token, {
        maxAge: expiresIn * 1000, //maxAge in milliseconds
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction && 'Lax'
    });

    return token;
}

//restore user
const restoreUser = (req, res, next) => {
    //token parsed from cookies
    const { token } = req.cookies;
    req.user = null;

    return jwt.verify(token, secret, null, async (err, jwtPayload) => {
        if (err) {
            return next();
        }

        try {
            const { id } = jwtPayload.data;
            req.user = await User.scope('currentUser').findByPk(id);
        } catch (e) {
            res.clearCookies('token');
            return next();
        }

        if (!req.user) res.clearCookie('token');

        return next();
    });
};


// if not current user, then return error
const requireAuthentication = async function (req, _res, next, ) {
    const { token } = req.cookies;

    //create err for unauthorized
    const err = new Error('Unauthorized');
    err.title = 'Unauthorized';
    err.errors = ['Unauthorized'];
    err.status = 401;

    if (!token) {
        return next(err);
    }

    try {
        const decodedToken = jwt.verify(token, secret);
        const user = await User.scope('currentUser').findByPk(decodedToken.id);

        if (!user) {
            return next(err);
        }

        req.user = user;        //set current auth user
        return next();
    } catch(error) {
        error.status = 401;
        return next(error);
    }
};

//permissions and roles
const requireAuthorization = async function (reqRoles) {
    return async (req, res, next) => {
        const user = req.user; // get the authenticated user from the request
        const hasRequiredRoles = true;

        const { organizer, member, attendee} = reqRoles;

        if(organizer) {
            const isOrganizer = await Group.findByPk(groupId, {
                where: {
                    organizerId: user.id
                }
            });

            if(!isOrganizer) {hasRequiredRoles = false};
        }

        if (member) {
            const status = await Membership.findOne({
                where: {
                    userId: user.id,
                    groupId: member.groupId
                },
                attributes: ['status']
            });

            if(!status || (status.status !== member.status)) {
                hasRequiredRoles = false;
            }
        }

        if(attendee) {
            const status = await Attendence.findOne({
                where: {
                    userId: user.id,
                    eventId: attendee.eventId
                },
                attributes: ['status']
            });

            if (!status || (status.status !== attendee.status)) {
                hasRequiredRoles = false;
            }
        }

        // If the user has the required roles and permissions, allow them to access the endpoint
        if (hasRequiredRoles) {
            return next();
        }

        // If the user does not have the required roles and permissions, respond with a 403 error
        res.status(403).json({ error: 'Unauthorized' });
    }
};

module.exports = { setTokenCookie, restoreUser, requireAuthentication, requireAuthorization };
