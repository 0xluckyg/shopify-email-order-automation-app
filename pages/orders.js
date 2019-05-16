import {
    Card,            
    Layout,
    Tabs,    
    Button
} from '@shopify/polaris';
import pageHeader from '../components/page-header'
import DatePicker from '../components/date-picker'
import AllOrders from './all-orders'
import OrdersByDay from './orders-by-day'
import axios from 'axios';

class Orders extends React.Component {    
    constructor(props) {
        super(props)  
        let today = new Date()      
        today.setHours(0,0,0,0);
        this.state = {        
            selectedTab: 0,
            selectedDate: {
                start: today,
                end: today
            }
        };
    }

    formatDate(date) {
        return `${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()}`
    }

    getDateText() {
        const selectedDate = this.state.selectedDate.start
        return (this.state.selectedTab == 1) ? undefined : this.formatDate(selectedDate)
    }

    renderDatePicker() {
        if (this.state.selectedTab == 1) {
            return undefined
        } else {
            return <DatePicker
                selectedDate={this.state.selectedDate}
                setDate={selectedDate => this.setState({selectedDate})}
            />  
        }
    }

    handleTabChange = (selectedTab) => {
        this.setState({selectedTab});
    }

    changeDate(num) {
        let date = this.state.selectedDate.start                                                    
        date = new Date(date).setDate(date.getDate() + num)
        date = new Date(date)
        this.setState({selectedDate: {
            start: date, end: date
        }})
    }

    render() {
        const {selectedTab} = this.state;
        const tabs = [
            {
                id: 'by-day',
                content: 'By Day',
            },
            {
                id: 'all-orders',
                content: 'All Orders',
            },
        ];
        return (
        <Layout>
            <Layout.Section>
                {pageHeader(
                    'Orders', 
                    this.getDateText(),
                    this.renderDatePicker()
                )}
                <Card>
                    <Tabs tabs={tabs} selected={selectedTab} onSelect={this.handleTabChange}>                              
                        {(selectedTab == 0) ? <OrdersByDay 
                                                date={this.state.selectedDate.start}
                                                dayBefore={() => this.changeDate(-1)}
                                                dayAfter={() => this.changeDate(1)}
                                            /> : null}
                        {(selectedTab == 1) ? <AllOrders/> : null}
                    </Tabs>
                </Card>                
            </Layout.Section>  
        </Layout>                
        );
    }
}

export default Orders