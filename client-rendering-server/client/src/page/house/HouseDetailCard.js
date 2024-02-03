import AvatarOther from "../../component/avatar/AvatarOther";
import {useEffect, useState} from "react";
import eventbus, {registerHandler} from "../../module/eventbus";

const HouseDetailCard = ({house, users}) => {

    const [presenceMessage, setPresenceMessage] = useState(null);

    useEffect(() => {

        registerHandler("EB.updates.user.presence", (err, message) => {
            setPresenceMessage({
                username: message.body.username,
                newPresence: message.body.newPresence
            });
        });
    }, [presenceMessage]);

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
                            <AvatarOther username={house.head} presenceMessage={presenceMessage}/>
                        </div>
                    </div>
                    <div>
                        <div className="border rounded p-3 m-2">
                            <span className="fw-lighter fs-5">People</span>
                            <hr className="mt-1 mb-2" />
                            <div>
                                {users && users.map((user, index) => (
                                    <AvatarOther key={index} username={user.username} presenceMessage={presenceMessage} />
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