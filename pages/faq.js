import {             
    TextContainer,
    Heading
} from '@shopify/polaris';

//Lets users email the admin through a form.
class Faq extends React.Component {

    render() {
        return (                                        
            <div>
                <TextContainer>
                    <Heading>App doesn't load</Heading>
                    <p>
                    1. Try refreshing the page
                    </p>
                    <p>
                    2. Try closing the app and open the app again from Shopify apps
                    </p>
                    <p>
                    3. If the app still does not work, try deleting the app and reinstalling
                    </p>
                </TextContainer>
            </div>                                     
        )
    }
}

export default Faq