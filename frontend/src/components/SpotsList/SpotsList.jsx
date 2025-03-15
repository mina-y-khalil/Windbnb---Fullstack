import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllSpots } from "../../store/spots";
import { Link } from "react-router-dom";
import "./SpotsList.css";

const SpotsList = () => {
    const dispatch = useDispatch();
    const spots = useSelector((state) => state.spots);

    useEffect(() => {
        dispatch(fetchAllSpots());
    }, [dispatch]);

    console.log("Redux Store State:", spots);

    return (
        <div>
            <h1>All Spots</h1>
            <div className="spotList">
                {spots.allIds.length > 0 ? (
                    spots.allIds.map((spotId) => {
                        const spot = spots.byId[spotId];
                        return (
                            <Link to={`/spots/${spot.id}`} key={spot.id} className="spotItem">
                                <h3>{spot.name}</h3>
                                <img src={spot.previewImage || "https://via.placeholder.com/150"} alt={spot.name} />
                                <p>{spot.city}, {spot.state}</p>
                                <p>${spot.price} per night</p>
                            </Link>
                        );
                    })
                ) : (
                    <p style={{ color: "red" }}>No spots available</p>
                )}
            </div>
        </div>
    );
};

export default SpotsList;
