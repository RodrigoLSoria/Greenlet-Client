import "./UserExchanges.css"
import ExchangeCard from "../ExchangeCard/ExchangeCard"
import Loader from "../Loader/Loader"



const UserExchanges = ({ exchanges }) => {


    return (
        !exchanges ? (
            <Loader />
        ) : (
            <div className="userExchanges">
                {exchanges.map((exchange) => (
                    <ExchangeCard key={exchange._id} previousExchangeData={exchange} onExchangeUpdate={onExchangeUpdate} />
                ))}
            </div>
        )
    )
}

export default UserExchanges