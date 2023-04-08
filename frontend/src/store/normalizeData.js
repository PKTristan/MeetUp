const normalizeData = (data) => {
    let newData = {};

    data.forEach(group => {
        newData[group.id] = group;
    });

    return newData
};


export default normalizeData;
