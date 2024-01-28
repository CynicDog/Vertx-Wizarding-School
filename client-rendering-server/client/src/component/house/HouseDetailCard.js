import AvatarOther from "../user-page/AvatarOther";
import {useEffect} from "react";

const HouseDetailCard = ({house, users}) => {

    if (!house) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <div className="card card-cover border-0 rounded-4 shadow-sm">
                <div className="d-flex flex-column p-3">
                    <div className="d-flex justify-content-between my-2">
                        <div className="text-black fw-bold fs-3">
                            <span className="mx-3">{house.title}</span>
                            <AvatarOther username={house.head}/>
                        </div>
                    </div>
                    <div>
                        <div className="border rounded p-3 m-2">
                            <span className="fw-lighter fs-5">People</span>
                            <hr className="mt-1 mb-2" />
                            <div>
                                {users && users.map((user, index) => (
                                    <AvatarOther key={index} username={user.username} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default HouseDetailCard;