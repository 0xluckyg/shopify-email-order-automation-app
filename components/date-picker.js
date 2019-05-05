import {
    DatePicker,
    Button,
    Popover
} from '@shopify/polaris';

class DatePickerMarkup extends React.Component {
    
    state = {
        active: false,
        month: new Date().getMonth(),
        year: new Date().getFullYear()        
    };

    togglePopover = () => {
        this.setState({active: !this.state.active})            
    };

    handleChange = (selectedDate) => {
        this.setState({active: false})
        this.props.setDate(selectedDate)
    };

    handleMonthChange = (month, year) => {
        this.setState({
            month,
            year,
        });
    };

    renderActivator = () => {        
        const selectedDate = this.props.selectedDate
        let date = (selectedDate.start) ? selectedDate.start : selectedDate
        date = `${date.getFullYear()}/${date.getMonth()}/${date.getDate()}`
        return <Button onClick={this.togglePopover}>{date}</Button>
    }

    render() {
        const {month, year} = this.state;
        return (
            <Popover
                active={this.state.active}
                activator={this.renderActivator()}
                onClose={this.togglePopover}
                preferredAlignment="right"                
                onClose={() => {}}
            >                 
                <div style={{margin: '20px'}}>
                    <DatePicker
                        allowRange={false}
                        month={month}
                        year={year}
                        onChange={this.handleChange}
                        onMonthChange={this.handleMonthChange}
                        selected={this.props.selectedDate}
                    />
                </div>
            </Popover>
        );
    }
}

export default DatePickerMarkup