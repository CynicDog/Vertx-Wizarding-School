const HouseDetailCard = ({house}) => {
    if (!house) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <div className="card card-cover border-0 rounded-4 shadow-sm">
                <div className="d-flex flex-column p-5 pb-3">
                    <div className="d-flex justify-content-between">
                        <div>
                            <div className="fw-lighter my-2">house rank</div>
                        </div>
                        <div>
                            <div className="btn btn-light btn-sm">enroll</div>
                        </div>
                    </div>
                    <div>
                        <h3 className="display-6 text-black fw-bold fs-3 pt-4 my-4">{house.title}</h3>
                        {/* some contents .. */}
                        <div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default HouseDetailCard;