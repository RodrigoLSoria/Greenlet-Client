import "./UserExchanges.css"
import ExchangeCard from "../ExchangeCard/ExchangeCard"
import Loader from "../Loader/Loader"
import { Row, Col } from "react-bootstrap"


const UserExchanges = ({ exchanges }) => {


    return (
        < div className='user-badges' >
            <h4>My pending exchanges</h4>
            <>
                {exchanges.length === 0 ? (
                    <p>Ready for more exchanges? <a href="/">Keep exploring</a> to find your next plant buddy! </p>) : (
                    <Row>
                        {exchanges.map((exchange) => (
                            <Col key={exchange._id} xs={4} sm={4} md={3} xl={3}>
                                <ExchangeCard key={exchange._id} previousExchangeData={exchange} onExchangeUpdate={onExchangeUpdate} />
                            </Col>
                        ))}
                    </Row>
                )}
            </>
        </div >
    )
}

export default UserExchanges