
// backend/utils/auth.js
const jwt = require('jsonwebtoken');

const { jwtConfig } = require('../config');
const { User, Group, Membership, Attendance } = require('../db/models');

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
const requireAuthentication = async function (req, _res, next,) {
    const { token } = req.cookies;

    //create err for unauthorized
    const err = new Error('Unauthorized');
    err.title = 'Unauthorized';
    err.errors = ['Unauthorized'];
    err.status = 401;

    console.log(token);

    if (!token) {
        return next(err);
    }

    try {
        const decodedToken = jwt.verify(token, secret);
        const { data: { id } } = decodedToken;
        const tokenId = (id ? id : decodedToken.id);
        //console.log(tokenId)
        const user = await User.scope('currentUser').findByPk(tokenId);

        if (!user) {
            return next(err);
        }

        req.user = user;        //set current auth user
        return next();
    } catch (error) {
        error.status = 401;
        return next(error);
    }
};

//permissions and roles
const requireAuthorization = async function (req, res, next) {

    const user = req.user; // get the authenticated user from the reques
    let hasRequiredRoles = true;
    let isOrganizer = false;
    let isMember = false;
    let isAttendee = false;
    const { organizer, member, attendee, groupId, eventId } = req.roles;


    if (organizer) {
        const group = await Group.findByPk(groupId);
        const {organizerId} = group;
        isOrganizer = (organizerId === user.id);

        // if (!isOrganizer) {
        //     hasRequiredRoles = false;
        // };

    }

    if (member && !isOrganizer) {
        // hasRequiredRoles = true;
        const membership = await Membership.findOne({
            where: {
                userId: user.id,
                groupId: groupId
            },
            attributes: ['status']
        });

        isMember = (membership.status === member.status);

        // if (!membership || !isMember) {
        //     hasRequiredRoles = false;
        // }
    }

    if (attendee && !isOrganizer && !isMember) {
        // hasRequiredRoles = true;
        const attendance = await Attendance.findOne({
            where: {
                userId: user.id,
                eventId: eventId
            },
            attributes: ['status']
        });

        const isUnauth = () => {
            let status = true;

            for (stat in attendee) {
                if (!attendance || attendance.status === stat) {
                    status = false;
                }
            }

            return status;
        };

        if (!isUnauth()) {
            isAttendee = true;
        }
    }

    hasRequiredRoles = isOrganizer || isMember || isAttendee;

    // If the user has the required roles and permissions, allow them to access the endpoint
    if (hasRequiredRoles) {
        return next();
    }

    // If the user does not have the required roles and permissions, respond with a 403 error
    // return res.status(403).json({ error: 'Unauthorized' })
    const err = new Error('Unauthorized');
    err.status = 403;
    err.message = 'Unauthorized';
    throw err;
};


module.exports = { setTokenCookie, restoreUser, requireAuthentication, requireAuthorization };
