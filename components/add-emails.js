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
class AddEmails extends React.Component {    
    constructor(props){
        super(props)

        this.state = {
            email: '',
            emailFieldError: ''
        }
    }    

    renderEmailTags() {
        let emails = this.props.emails
        return (
            <div style={{width: '80%'}}>
                {emails.map(email => {  
                    const tag = 
                    <div key={email} style={{display: 'inline-block', margin: '10px 10px 0px 0px'}}>
                        <Tag onRemove={() => {
                            let index = emails.indexOf(email);
                            emails.splice(index, 1)                            
                            this.props.setEmails(emails)
                        }}>{email}</Tag>
                    </div>                    
                    return tag
                })}
            </div>
        )
    }

    render() {         
        return (
            <Card sectioned>
                <p style={{marginBottom: '10px'}}>Add emails to send orders to when customer purchases the products you've specified above</p>
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
                        if (this.props.emails.indexOf(this.state.email) >= 0) {
                            return this.setState({emailFieldError: "This email's already on the list"})                            
                        }
                        let emails = this.props.emails
                        emails.push(this.state.email)
                        this.props.setEmails(emails)
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

export default AddEmails;