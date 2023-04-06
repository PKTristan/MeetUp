// /frontend/src/components/Navigation/index.js
import ProfileButton from "./ProfileButton";
import './Navigation.css';

const Navigation = () => {

    return (
        <div>
            <ul className="navigation">
                <ProfileButton />
            </ul>
        </div>
    );

};

export default Navigation;
