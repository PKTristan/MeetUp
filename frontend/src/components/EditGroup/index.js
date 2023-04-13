// /frontend/src/components/EditGroup/index.js
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getGroupDetails, groupDetailsSelector } from "../../store/groups";
import GroupForm from "../GroupForm";


const EditGroup = () => {
    const dispatch = useDispatch();
    const groupDetails = useSelector(groupDetailsSelector)
    const { id } = useParams();

    useEffect(() => {
        dispatch(getGroupDetails(id));
    }, [dispatch, id]);

    return (
        <div className="edit-group">
            <GroupForm groupDetails={groupDetails} />
        </div>
    )
};

export default EditGroup;
