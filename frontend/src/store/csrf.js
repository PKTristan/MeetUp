import Cookies from 'js-cookie';

export const csrfFetch = async(url, options = {}) => {
    //if the options.headers is undefined, set to an empty object
    options.headers = options.headers || {};

    //if options.method is undefined, set to GET
    options.method = options.method || 'GET';

    //if options.method is any other method than a GET, set the XSRF-TOKEN cookie
    if (options.method.toUpperCase() !== 'GET') {
        options.headers['Content-Type'] =
            options.headers['Content-Type'] || 'application/json';
        options.headers['XSRF-Token'] = Cookies.get('XSRF-TOKEN');
    }

    //call and await the window.fetch with the url and the options object to get the response
    const response = await window.fetch(url, options);

    if (response.status >= 400) throw response;

    return response;
};

export const restoreCSRF = () => {
    return csrfFetch('/api/csrf/restore');
};
