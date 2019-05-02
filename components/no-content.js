import {         
    Button
} from '@shopify/polaris';

//props.logo
//props.text
//props.action
//props.actionText
class NoContent extends React.Component {
    render() {         
        return(
            <div style={cardWrapper}>
                <div style={{marginTop:'40px', width: '300px'}}>
                    <img style={logoStyle} src={this.props.logo}/>
                    <p style={textStyle}>{this.props.text}</p>                    
                    {(this.props.actionText) ? (
                        <div style={{marginBottom:'10px'}}>
                            <Button primary fullWidth onClick={this.props.action}>
                                {this.props.actionText}
                            </Button>
                        </div>
                    ) : null}                    
                </div>
            </div>
        )
    }
}

const logoStyle = {
    display: 'flex',     
    paddingBottom: '30px',
    margin: 'auto',     
    width: '150px',    
}
const textStyle = { 
    marginBottom: '25px', 
    fontSize: '20px', 
    fontWeight: '300',
    textAlign: 'center' 
}
const cardWrapper = { 
    display: 'flex', 
    height: '400px', 
    justifyContent: 'center',
    alignItems: 'center'
}

export default NoContent;