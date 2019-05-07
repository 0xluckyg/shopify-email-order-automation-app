import {
    Card,    
    Button,    
    TextField,
    Tag,    
} from '@shopify/polaris';
import emailValidator from "email-validator";

//Props: 
//emails (array)
//setEmails (func)
class AddEmail extends React.Component {    
    constructor(props){
        super(props)

        this.state = {
            email: '',
            emailFieldError: ''
        }
    }    

    renderEmailTags() {
        let email = this.props.email
        if (!email) return null
        return (
            <div style={{width: '80%'}}>
                <div style={{display: 'inline-block', margin: '10px 10px 0px 0px'}}>
                    <Tag onRemove={() => {
                        this.props.setEmail(null)
                    }}>{email}</Tag>
                </div>          
            </div>
        )
    }

    render() {         
        return (
            <Card sectioned>
                <p style={{marginBottom: '10px'}}>Add an email to send orders to when customer purchases the products you've specified above</p>
                <div style={{display:'flex', justifyContent: 'space-between'}}>
                <div style={{width:'80%'}}>                
                    <TextField     
                        placeholder="Email (eg. kroco@gmail.com)"
                        value={this.state.email}
                        onChange={(email) => this.setState({email})}
                        error={this.state.emailFieldError}
                    />
                </div>
                <div style={{width:'15%'}}>
                    <Button primary fullWidth onClick={() => {
                        if (!emailValidator.validate(this.state.email)) {
                            return this.setState({emailFieldError: "Please provide a valid email"})                            
                        }                                       
                        this.props.setEmail(this.state.email)
                        this.setState({email:'', emailFieldError: ''})
                    }}>
                        Add
                    </Button>
                </div>
                </div>
                {this.renderEmailTags()}
            </Card>            
        )
    }
}

export default AddEmail;