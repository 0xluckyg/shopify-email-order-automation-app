import {         
    Badge
} from '@shopify/polaris';

const sentStatus = (line_items) => {
    let sentCount = 0
    let emailCount = 0        
    line_items.forEach(item => {
        if (!item.email_rules) return            
        item.email_rules.forEach(email => {
            if (email.sent) sentCount ++
        })
        emailCount += item.email_rules.length
    })
    if (emailCount == 0) {
        return <Badge progress="incomplete">No emails</Badge>
    }
    if (sentCount == emailCount) {
        return <Badge status="success" progress="complete">All sent</Badge>
    }
    if (sentCount < emailCount && sentCount != 0) {
        return <Badge status="attention" progress="partiallyComplete">Partially sent</Badge>
    }
    if (sentCount == 0) {
        return <Badge status="info" rogress="incomplete">Not sent</Badge>
    } 
}

export default sentStatus