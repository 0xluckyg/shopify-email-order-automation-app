import React from 'react';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {showAuthorizeModalAction} from '../../redux/actions';

class Features extends React.Component {
  render() {
  	return (
        <section className="section bg-light" id="features">
        <div className="container">
            <div className="row vertical-content">
                <div className="col-lg-5">
                    <div className="features-box">
                        <h3>Did you know that there are <b className="text-custom">235</b> holidays just in the US, including <b className="text-custom">42</b> major ones? </h3>
                        <p className="text-muted web-desc">New Year's, MLK Jr Day, Super Bowl, Chiense New Year, Valentines, Presidents' Day, Holi, Veterans Day, Boston Marathon, Easter, Mother's Day, Memorial Day, Father's Day, Columbus Day, Halloween, Thanksgiving, Black Friday, President's Day, and Christmas to just name a few.</p>
                        <ul className="text-muted list-unstyled margin-t-30 features-item-list">
                            <li className="">We put a lot of effort in design.</li>
                            <li className="">No holiday during some days? No problem. <b className="text-custom">Seasons</b> exist all year.</li>
                            <li className="">Study suggests that ecommerce websites make up to <b className="text-custom">27.9%</b> more revenue on average on holidays.</li>
                            <li className="">Don't miss out on opportunities to make your customers feel cared!</li>
                        </ul>
                        <button onClick={() => this.props.showAuthorizeModalAction(true)} className="btn btn-custom margin-t-30 waves-effect waves-light">Learn More <i className="mdi mdi-arrow-right"></i></button>
                    </div>
                </div>
                <div className="col-lg-7">
                    <div className="features-img features-right text-right">
                        <img src="../../static/landing-page/images/online-world.svg" alt="macbook image" className="img-fluid" />
                    </div>
                </div>
            </div>
        </div>
    </section>
  	);
  }
}

function mapDispatchToProps(dispatch){
    return bindActionCreators(
        {showAuthorizeModalAction},
        dispatch
    );
}

export default connect(null, mapDispatchToProps)(Features);