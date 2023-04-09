
// backend/utils/auth.js
const jwt = require('jsonwebtoken');

const { jwtConfig } = require('../config');
const { User, Group, Membership, Attendance, Event } = require('../db/models');

let authGroup = null;
let authStatus = null;
let authAttendee = null;


const ORGANIZER = "ORGANIZER";
const HOST = "HOST";
const CO_HOST = "CO_HOST";
const MEMBER = "MEMBER";
const ID_MATCH = 'ID_MATCH';
const ATTENDEE = "ATTENDEE";

const addGroupImg = '/api/groups/:id/images';
const editDelGroup = '/api/groups/:id';
const getCreateVenues = '/api/groups/:id/venues';
const createEvent = '/api/groups/:id/events';
const addEventImg = '/api/events/:id/images';
const editDelEvent = '/api/events/:id';
const changeDelMembership = '/api/groups/:id/membership';
const attendanceChangeDelReq = '/api/events/:id/attendance';
const delGroupImg = '/api/group-images/:id';
const delEventImg = '/api/event-images/:id';
const editVenue = ' /api/venues/:venueId';

const PERMISSIONS = {
    [addGroupImg]: [ORGANIZER, HOST],
    [editDelGroup]: [ORGANIZER, HOST],
    [getCreateVenues]: [ORGANIZER, HOST, CO_HOST],
    [createEvent]: [ORGANIZER, HOST, CO_HOST],
    [addEventImg]: [ATTENDEE, ORGANIZER, CO_HOST],
    [editDelEvent]: [ORGANIZER, CO_HOST, HOST],
    [changeDelMembership]: [[[ORGANIZER, HOST, CO_HOST], [ORGANIZER, HOST]], [ORGANIZER, HOST, ID_MATCH]],
    [attendanceChangeDelReq]: [[ORGANIZER, HOST, CO_HOST], [ORGANIZER, HOST, ID_MATCH], [MEMBER]],
    [delGroupImg]: [ORGANIZER, HOST, CO_HOST],
    [delEventImg]: [ORGANIZER, HOST, CO_HOST],
    [editVenue]: [ORGANIZER, HOST, CO_HOST],
};

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
    const err = new Error('Authentication required');
    err.title = 'Authentication required';
    err.errors = ['Authentication required'];
    err.status = 401;

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

const findPermissions = (reqUrl, req, url = '', id = {}) => {
    const [curr, ...next] = reqUrl;

    if (next.length === 0) {

        let isChangeDelMembership = changeDelMembership === url;
        let permissions = PERMISSIONS[url];

        if ((isChangeDelMembership) || (attendanceChangeDelReq === url)) {

            //check if we are updating/ changing something
            if (req.method === 'PUT') {

                //check if we are dealing with memberships or attendance
                if (isChangeDelMembership) {

                    if (req.body.status === 'member') {
                        //we are changing a membership to a group to a member
                        permissions = permissions[0][0];
                    }
                    else {
                        //changing a membership to group to co-host
                        permissions = permissions[0][1];
                    }
                }
                else {
                    //changing a member from pending to attending an event
                    permissions = permissions[0];
                }
            } else if (req.method === 'DELETE') {
                permissions = permissions[1];
            } else if (req.method === 'POST') {
                //requesting attendance
                permissions = permissions[2];
            }

        }


        return { permissions, url, id };
    }

    if (/\d/.test(next[0])) {
        id[curr] = parseInt(next[0]);

        return findPermissions(next, req, url + '/:id', id);
    }
    else {
        return findPermissions(next, req, url + `/${next[0]}`, id);
    }
};


//populate the data for use in checking functions
const populateData = async (user, id) => {
    if (id.groups !== undefined) {
        const group = await Group.findByPk(id.groups);
        const status= await Membership.findOne({
            where: {
                groupId: id.groups,
                userId: user.id
            },
            attributes: ['status']
        });


        authGroup = group;
        if (status) authStatus = status;
    }
    else if (id.events !== undefined) {
        const event = await Event.findByPk(id.events);
        const group = await Group.findByPk(event.groupId);
        const memStatus= await Membership.findOne({
            where: {
                groupId: group.id,
                userId: user.id
            },
            attributes: ['status']
        });

        const attStatus= await Attendance.findOne({
            where: {
                eventId: id.events,
                userId: user.id
            },
            attributes: ['status']
        });

        authGroup = group;
        if (memStatus) authStatus = memStatus;
        if (attStatus) authStatus = attStatus;
    }
};


//functions to check for roles
const isOrganizer = (userId) => {
    return authGroup && (authGroup.organizerId === userId);
};

const isHost = () => {
    return authStatus && (authStatus === 'host');
};

const isCoHost = () => {
    return authStatus && (authStatus === 'co-host');
};

const isMember = () => {
    return authStatus && (authStatus === 'member');
};

const doesIdMatch = (userId, { groups, events }) => {
    return (groups !== undefined) ? (userId === groups) : (userId === events);
};

const isAttendee = () => {
    return authAttendee && (authAttendee === 'member');
}



//permissions and roles
//require authorization
/// look here!!!
const requireAuthorization = async function (req, res, next) {

    const {user} = req; // get the authenticated user from the reques
    const reqUrl = req.originalUrl.split('/');
    let hasRequiredRoles = false;

    const {permissions, url, id} = findPermissions(reqUrl, req);

    await populateData(user, id);

    //for every permission or until we get a true, check these roles
    let i = 0;

    while ((!hasRequiredRoles) && (i < permissions.length)) {
        switch(permissions[i]) {
            case ORGANIZER:
                hasRequiredRoles = isOrganizer(user.id);
                break;

            case HOST:
                hasRequiredRoles = isHost();
                break;

            case CO_HOST:
                hasRequiredRoles = isCoHost();
                break;

            case MEMBER:
                hasRequiredRoles = isMember();
                break;

            case ID_MATCH:
                hasRequiredRoles = doesIdMatch(user.id, id);
                break;

            case ATTENDEE:
                hasRequiredRoles = isAttendee();
                break;

            default:
                break;
        }

        i++;
    }


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
