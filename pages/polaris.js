import {
Card,
AccountConnection,
Button,
InlineError,
ButtonGroup,
DropZone,
SettingToggle,
TextStyle,
CalloutCard,
PageActions,
Stack,
Heading,
Badge,
Autocomplete,
Checkbox,
ChoiceList,
ColorPicker,
DatePicker,
Layout,
FormLayout,
TextField,
RadioButton,
RangeSlider,
Select,
Tag,
Avatar,
Icon,
Banner,
ProgressBar,
SkeletonBodyText,
TextContainer,
Link,
SkeletonDisplayText,
SkeletonThumbnail,
Spinner,
List,
DisplayText,
Caption,
Subheading,
Collapsible,
Scrollable,
DataTable,
DescriptionList,
ExceptionList,
OptionList,
ResourceList,
FilterType,
FooterHelp,
Pagination,
Tabs,
Tooltip

} from '@shopify/polaris';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isDirtyAction } from '../redux/actions';

class Page1 extends React.Component {
state = {
value1: "value1",
value2: "value2",
open: true
}

render() {
return (
<Layout>
<Layout.Section>

1. https://polaris.shopify.com/components/actions/account-connection#navigation
<AccountConnection
accountName="Account Connection Name"
connected={true}
title="AccountConnection Example App"
action={{
content: "Button",
onAction: () => { },
}}
details="details"
termsOfService="Terms of service description"
/>
<br />

2. https://polaris.shopify.com/components/actions/button#navigation
<Card sectioned>
<Button>Add product</Button><br />
<Button outline>Add product</Button><br />
<div style={{ color: '#bf0711' }}>
<Button monochrome outline>
Retry
</Button>
</div><br />
<Button plain>View shipping settings</Button><br />
<InlineError
message={
<React.Fragment>
An error occurred. &nbsp;
<Button plain monochrome>
Try again
</Button>
</React.Fragment>
}
/><br />
<Button primary>Save theme</Button><br />
<Button destructive>Delete theme</Button><br />
<Button size="slim">Save variant</Button><br />
<Button size="large">Create store</Button><br />
<Button fullWidth>Add customer</Button><br />
<Button disabled>Buy shipping label</Button><br />
<Button loading>Save product</Button><br />
<ButtonGroup>
<Button>Cancel</Button>
<Button primary>Save</Button>
</ButtonGroup><br />
<ButtonGroup segmented>
<Button>Bold</Button>
<Button>Italic</Button>
<Button>Underline</Button>
</ButtonGroup>
</Card>
<br />

3. https://polaris.shopify.com/components/actions/drop-zone#navigation
<Card sectioned>
<DropZone label="Theme files">
<DropZone.FileUpload />
</DropZone>
<div style={{ width: 114, height: 114 }}>
<DropZone>
<DropZone.FileUpload />
</DropZone>
</div>
<div style={{ width: 50, height: 50 }}>
<DropZone>
<DropZone.FileUpload />
</DropZone>
</div>
</Card>
<br />

4. https://polaris.shopify.com/components/actions/setting-toggle#navigation
<SettingToggle
action={{
content: "Enabled",
onAction: () => { }
}}
enabled={true}
>
This setting is <TextStyle variation="strong">Example Text</TextStyle>.
</SettingToggle>
<br />

5. https://polaris.shopify.com/components/structure/callout-card#navigation
<CalloutCard
title="Customize the style of your checkout"
illustration="https://cdn.shopify.com/s/assets/admin/checkout/settings-customizecart-705f57c725ac05be5a34ec20c05b94298cb8afd10aac7bd9c7ad02030f48cfa0.svg"
primaryAction={{
content: 'Customize checkout',
url: 'https://www.shopify.com',
}}
>
<p>Upload your store’s logo, change colors and fonts, and more.</p>
</CalloutCard>
<br />

6. https://polaris.shopify.com/components/structure/card#navigation
<Card title="Online store dashboard" sectioned>
<p>View a summary of your online store’s performance.</p>
</Card>
<br />

7. https://polaris.shopify.com/components/structure/page-actions#navigation
<PageActions
primaryAction={{
content: 'Save',
}}
secondaryActions={[
{
content: 'Delete',
},
]}
/>
<br />

8. https://polaris.shopify.com/components/structure/stack#navigation
<Card sectioned>
<Stack>
<Badge>Paid</Badge>
<Badge>Processing</Badge>
<Badge>Fulfilled</Badge>
<Badge>Completed</Badge>
</Stack><br />
<Stack distribution="fill">
<Heading>Order #1136</Heading>
<Badge>Paid</Badge>
<Badge>Fulfilled</Badge>
</Stack><br />
<Stack distribution="fillEvenly">
<Heading>Order #1136</Heading>
<Badge>Paid</Badge>
<Badge>Fulfilled</Badge>
</Stack><br />
<Stack>
<Stack.Item fill>
<Heading>Order #1136</Heading>
</Stack.Item>
<Stack.Item>
<Badge>Paid</Badge>
</Stack.Item>
<Stack.Item>
<Badge>Fulfilled</Badge>
</Stack.Item>
</Stack>
</Card>
<br />

9. https://polaris.shopify.com/components/forms/autocomplete#navigation
<Card sectioned>
<div style={{ height: '80px' }}>
<Autocomplete
options={[]}
selected={[]}
onSelect={() => { }}
textField={<Autocomplete.TextField
onChange={() => { }}
label="Tags"
value={"text"}
prefix={<Icon source="search" color="inkLighter" />}
placeholder="Search"
/>}
/>
</div>
</Card>
<br />

10. https://polaris.shopify.com/components/forms/checkbox#navigation
<Card sectioned>
<Checkbox
checked={true}
label="Basic checkbox"
onChange={() => { }}
/>
</Card>
<br />

11. https://polaris.shopify.com/components/forms/choice-list#navigation
<Card sectioned>
<ChoiceList
title={'Company name'}
choices={[
{ label: 'Hidden', value: 'hidden' },
{ label: 'Optional', value: 'optional' },
{ label: 'Required', value: 'required' },
]}
selected={[]}
onChange={() => { }}
/>
<ChoiceList
allowMultiple
title={'While the customer is checking out'}
choices={[
{
label: 'Use the shipping address as the billing address by default',
value: 'shipping',
helpText:
'Reduces the number of fields required to check out. The billing address can still be edited.',
},
{
label: 'Require a confirmation step',
value: 'confirmation',
helpText:
'Customers must review their order details before purchasing.',
},
]}
selected={[]}
onChange={() => { }}
/>
<ChoiceList
title={'Discount minimum requirements'}
choices={[
{ label: 'None', value: 'none' },
{ label: 'Minimum purchase', value: 'minimum_purchase' },
{
label: 'Minimum quantity',
value: 'minimum_quantity',
renderChildren: () => {
return (
<TextField
label="Minimum Quantity"
labelHidden
onChange={() => { }}
value="value"
/>
);
},
},
]}
selected={[]}
onChange={() => { }}
/>

</Card>
<br />

12. https://polaris.shopify.com/components/forms/color-picker#navigation
<Card sectioned>
<ColorPicker onChange={() => { }} color={{
hue: 300,
brightness: 1,
saturation: 0.7,
alpha: 0.7,
}} allowAlpha />
</Card>
<br />

13. https://polaris.shopify.com/components/forms/date-picker#navigation
<Card sectioned>
<DatePicker
month={1}
year={2019}
onChange={() => { }}
onMonthChange={() => { }}
selected={{
start: new Date('Wed Feb 07 2018 00:00:00 GMT-0500 (EST)'),
end: new Date('Wed Feb 07 2018 00:00:00 GMT-0500 (EST)'),
}}
/>
</Card>
<br />

14. https://polaris.shopify.com/components/forms/form-layout#navigation
<Card sectioned>
<FormLayout>
<TextField
label="label1"
value={this.state.value1}
onChange={(text) => {
this.setState({ value1: text })
this.props.isDirtyAction(true, () => { console.log('save action call') })
}}
/>
<TextField
type="email"
label="label2"
value={this.state.value2}
onChange={(text) => {
this.setState({ value2: text })
this.props.isDirtyAction(true, () => { console.log('save action call') })
}}
/>
</FormLayout>
</Card>
<br />

15. https://polaris.shopify.com/components/forms/inline-error#navigation
<Card sectioned>
<InlineError message="Store name is required" fieldID="myFieldID" />
</Card>
<br />

16. https://polaris.shopify.com/components/forms/radio-button#navigation
<Card sectioned>
<Stack vertical>
<RadioButton
label="Accounts are disabled"
helpText="Customers will only be able to check out as guests."
checked={true}
id="disabled"
name="accounts"
onChange={() => { }}
/>
<RadioButton
label="Accounts are optional"
helpText="Customers will be able to check out with a customer account or as a guest."
id="optional"
name="accounts"
checked={false}
onChange={() => { }}
/>
</Stack>
</Card>
<br />

17. https://polaris.shopify.com/components/forms/range-slider#navigation
<Card sectioned>
<RangeSlider
label="Opacity percentage"
value={12}
onChange={() => { }}
/>
</Card>
<br />

18. https://polaris.shopify.com/components/forms/select#navigation
<Card sectioned>
<Select
label="Date range"
options={[
{ label: 'Today', value: 'today' },
{ label: 'Yesterday', value: 'yesterday' },
{ label: 'Last 7 days', value: 'lastWeek' },
]}
onChange={() => { }}
value={'today'}
/>
</Card>
<br />

19. https://polaris.shopify.com/components/forms/tag#navigation
<Card sectioned>
<Tag>Wholesale</Tag>
</Card>
<br />

20. https://polaris.shopify.com/components/forms/text-field#navigation
<Card sectioned>
<TextField
label="Store name"
value={'Value example'}
onChange={() => { }}
/>
</Card>
<br />

21. https://polaris.shopify.com/components/images-and-icons/avatar#navigation
<Card sectioned>
<Avatar customer name="Farrah" />
</Card>
<br />

22. https://polaris.shopify.com/components/images-and-icons/badge#navigation
<Card sectioned>
<Badge>Fulfilled</Badge>
<Badge status="info">Published</Badge>
<Badge status="success">Funds recovered</Badge>
<Badge status="attention">Unfulfilled</Badge>
<Badge status="warning">SSL unavailable</Badge>
<Badge progress="incomplete">Unfulfilled</Badge>
<Badge progress="partiallyComplete">Partially fulfilled</Badge>
<Badge progress="complete">Fulfilled</Badge>
</Card>
<br />

23. https://polaris.shopify.com/components/images-and-icons/icon#navigation
<Card sectioned>
<Icon source="circlePlus" />
<Icon source="<svg viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'><path d='M10.707 17.707l5-5a.999.999 0 1 0-1.414-1.414L11 14.586V3a1 1 0 1 0-2 0v11.586l-3.293-3.293a.999.999 0 1 0-1.414 1.414l5 5a.999.999 0 0 0 1.414 0' /></svg>" />
</Card>
<br />

24. https://polaris.shopify.com/components/feedback-indicators/banner#navigation
<Card sectioned>
<Banner title="Order archived" onDismiss={() => { }}>
<p>This order was archived on March 7, 2017 at 3:12pm EDT.</p>
</Banner>
<Banner
title="Some of your product variants are missing weights"
status="warning"
action={{ content: 'Edit variant weights' }}
onDismiss={() => { }}
>
<p>
Add weights to show accurate rates at checkout and when buying shipping
labels in Shopify.
</p>
</Banner>
<Banner
title="USPS has updated their rates"
action={{ content: 'Learn more' }}
status="info"
onDismiss={() => { }}
>
<p>Make sure you know how these changes affect your store.</p>
</Banner>
<Banner
title="Your shipping label is ready to print."
status="success"
action={{ content: 'Print label' }}
onDismiss={() => { }}
/>
<Banner
title="High risk of fraud detected"
action={{ content: 'Review risk analysis' }}
status="critical"
>
<p>
Before fulfilling this order or capturing payment, please{' '}
<Link url="">review the Risk Analysis</Link> and determine if this order is
fraudulent.
</p>
</Banner>
<Banner
title="High risk of fraud detected"
onDismiss={() => { }}
status="critical"
ref={React.createRef()}
>
<p>
Before fulfilling this order or capturing payment, please review the
fraud analysis and determine if this order is fraudulent
</p>
</Banner>
<Card title="Online store dashboard" sectioned>
<TextContainer>
<Banner onDismiss={() => { }}>
<p>
Use your finance report to get detailed information about your business.{' '}
<Link url="">Let us know what you think.</Link>
</p>
</Banner>

<p>View a summary of your online store’s performance.</p>
</TextContainer>
</Card>
</Card>
<br />

25. https://polaris.shopify.com/components/feedback-indicators/progress-bar#navigation
<Card sectioned>
<ProgressBar progress={75} />
<ProgressBar progress={40} size="small" />
</Card>
<br />

26. https://polaris.shopify.com/components/feedback-indicators/skeleton-body-text#navigation
<Card sectioned>
<SkeletonBodyText />
<SkeletonBodyText lines={1} />
</Card>
<br />

27. https://polaris.shopify.com/components/feedback-indicators/skeleton-display-text#navigation
<Card sectioned>
<SkeletonDisplayText size="small" />
<SkeletonDisplayText size="extraLarge" />
<SkeletonDisplayText size="medium" />
</Card>
<br />

28. https://polaris.shopify.com/components/feedback-indicators/skeleton-thumbnail#navigation
<Card sectioned>
<SkeletonThumbnail size="medium" />
</Card>
<br />

29. https://polaris.shopify.com/components/feedback-indicators/spinner#navigation
<Card sectioned>
<Spinner size="large" color="teal" />
<Spinner size="small" color="teal" />
</Card>
<br />

30. https://polaris.shopify.com/components/titles-and-text/caption#navigation
<Card sectioned>
<List>
<List.Item>
Order #1001 <Caption>Received April 21, 2017</Caption>
</List.Item>
<List.Item>
Order #1002 <Caption>Received April 22, 2017</Caption>
</List.Item>
</List>
</Card>
<br />

31. https://polaris.shopify.com/components/titles-and-text/display-text#navigation
<Card sectioned>
<DisplayText size="extraLarge">Good evening, Dominic.</DisplayText>
<DisplayText size="large">Good evening, Dominic.</DisplayText>
<DisplayText size="medium">Good evening, Dominic.</DisplayText>
<DisplayText size="small">Good evening, Dominic.</DisplayText>
</Card>
<br />

32. https://polaris.shopify.com/components/titles-and-text/heading#navigation
<Card sectioned>
<Heading>Online store dashboard</Heading>
</Card>
<br />

33. https://polaris.shopify.com/components/titles-and-text/subheading#navigation
<Card sectioned>
<Subheading>Accounts</Subheading>
</Card>
<br />

34. https://polaris.shopify.com/components/titles-and-text/text-container#navigation
<Card sectioned>
<TextContainer>
<Heading>Install the Shopify POS App</Heading>
<p>
Shopify POS is the easiest way to sell your products in person. Available
for iPad, iPhone, and Android.
</p>
</TextContainer>
</Card>
<br />

35. https://polaris.shopify.com/components/titles-and-text/text-style#navigation
<Card sectioned>
<TextStyle variation="subdued">No supplier listed</TextStyle>
<TextStyle variation="strong">Total</TextStyle>
<TextStyle variation="positive">Orders increased</TextStyle>
<TextStyle variation="negative">Orders decreased</TextStyle>
<p>
New URL that visitors should be forwarded to. If you want your store’s
homepage, enter <TextStyle variation="code"> / </TextStyle> (a forward slash).
</p>
</Card>
<br />

36. https://polaris.shopify.com/components/behavior/collapsible#navigation
<Card sectioned>
<div style={{ height: '200px' }}>
<Card sectioned>
<Stack vertical>
<Button onClick={() => {
this.setState((state) => {
const open = !state.open;
return {
open,
};
});
}} ariaExpanded={this.state.open}>
Toggle
</Button>
<Collapsible open={this.state.open} id="basic-collapsible">
<TextContainer>
Your mailing list lets you contact customers or visitors who
have shown an interest in your store. Reach out to them with
exclusive offers or updates about your products.
</TextContainer>
</Collapsible>
</Stack>
</Card>
</div>
</Card>
<br />

37. https://polaris.shopify.com/components/behavior/scrollable#navigation
<Card title="Terms of service" sectioned>
<Scrollable shadow style={{ height: '100px' }}>
<p>
By signing up for the Shopify service (“Service”) or any of the services
of Shopify Inc. (“Shopify”) you are agreeing to be bound by the following
terms and conditions (“Terms of Service”). The Services offered by Shopify
under the Terms of Service include various products and services to help
you create and manage a retail store, whether an online store (“Online
Services”), a physical retail store (“POS Services”), or both. Any new
features or tools which are added to the current Service shall be also
subject to the Terms of Service. You can review the current version of the
Terms of Service at any time at https://www.shopify.com/legal/terms.
Shopify reserves the right to update and change the Terms of Service by
posting updates and changes to the Shopify website. You are advised to
check the Terms of Service from time to time for any updates or changes
that may impact you.
</p>
</Scrollable>
</Card>
<br />

38. https://miraekomerco.myshopify.com/admin/apps/boilerplate-3
<Card sectioned>
<Card>
<DataTable
columnContentTypes={[
'text',
'numeric',
'numeric',
'numeric',
'numeric',
]}
headings={[
'Product',
'Price',
'SKU Number',
'Net quantity',
'Net sales',
]}
rows={[
['Emerald Silk Gown', '$875.00', 124689, 140, '$122,500.00'],
['Mauve Cashmere Scarf', '$230.00', 124533, 83, '$19,090.00'],
[
'Navy Merino Wool Blazer with khaki chinos and yellow belt',
'$445.00',
124518,
32,
'$14,240.00',
],
]}
totals={['', '', '', 255, '$155,830.00']}
footerContent={`Showing 10 of 10 results`}
/>
</Card>
</Card>
<br />

39. https://polaris.shopify.com/components/lists-and-tables/description-list#navigation
<Card sectioned>
<DescriptionList
items={[
{
term: 'Logistics',
description:
'The management of products or other resources as they travel between a point of origin and a destination.',
},
{
term: 'Sole proprietorship',
description:
'A business structure where a single individual both owns and runs the company.',
},
{
term: 'Discount code',
description:
'A series of numbers and/or letters that an online shopper may enter at checkout to get a discount or special offer.',
},
]}
/>
</Card>
<br />

40. https://polaris.shopify.com/components/lists-and-tables/exception-list#navigation
<Card sectioned>
<ExceptionList
items={[
{
icon: 'notes',
description: 'This customer is awesome. Make sure to treat them right!',
},
]}
/>
</Card>
<br />

41. https://polaris.shopify.com/components/lists-and-tables/list#navigation
<Card sectioned>
<List type="bullet">
<List.Item>Yellow shirt</List.Item>
<List.Item>Red shirt</List.Item>
<List.Item>Green shirt</List.Item>
</List>
<List type="number">
<List.Item>First item</List.Item>
<List.Item>Second item</List.Item>
<List.Item>Third Item</List.Item>
</List>
</Card>
<br />

42. https://miraekomerco.myshopify.com/admin/apps/boilerplate-3
<Card sectioned>
<OptionList
title="Inventory Location"
onChange={() => { }}
options={[
{ value: 'byward_market', label: 'Byward Market' },
{ value: 'centretown', label: 'Centretown' },
{ value: 'hintonburg', label: 'Hintonburg' },
{ value: 'westboro', label: 'Westboro' },
{ value: 'downtown', label: 'Downtown' },
]}
selected={[]}
/>

<OptionList
title="Manage sales channels availability"
onChange={() => { }}
options={[
{ value: 'online_store', label: 'Online Store' },
{ value: 'messenger', label: 'Messenger' },
{ value: 'facebook', label: 'Facebook' },
{ value: 'wholesale', label: 'Wholesale' },
{ value: 'buzzfeed', label: 'BuzzFeed' },
]}
selected={[]}
allowMultiple
/>

<OptionList
onChange={() => { }}
sections={[
{
options: [
{ value: 'type', label: 'Sale item type' },
{ value: 'kind', label: 'Sale kind' },
],
},
{
title: 'Traffic',
options: [
{ value: 'source', label: 'Traffic referrer source' },
{ value: 'host', label: 'Traffic referrer host' },
{ value: 'path', label: 'Traffic referrer path' },
],
},
]}
selected={[]}
allowMultiple
/>
</Card>
<br />

43. https://polaris.shopify.com/components/lists-and-tables/resource-list#navigation
<Card sectioned>
<ResourceList
resourceName={{ singular: 'customer', plural: 'customers' }}
items={[
{
id: 341,
url: 'customers/341',
name: 'Mae Jemison',
location: 'Decatur, USA',
},
{
id: 256,
url: 'customers/256',
name: 'Ellen Ochoa',
location: 'Los Angeles, USA',
},
]}
renderItem={(item) => {
const { id, url, name, location } = item;
const media = <Avatar customer size="medium" name={name} />;

return (
<ResourceList.Item
id={id}
url={url}
media={media}
accessibilityLabel={`View details for ${name}`}
>
<h3>
<TextStyle variation="strong">{name}</TextStyle>
</h3>
<div>{location}</div>
</ResourceList.Item>
);
}}
filterControl={<ResourceList.FilterControl
filters={[
{
key: 'orderCountFilter',
label: 'Number of orders',
operatorText: 'is greater than',
type: FilterType.TextField,
},
{
key: 'accountStatusFilter',
label: 'Account status',
operatorText: 'is',
type: FilterType.Select,
options: ['Enabled', 'Invited', 'Not invited', 'Declined'],
},
]}
appliedFilters={[
{
key: 'accountStatusFilter',
value: 'Account enabled',
},
]}
onFiltersChange={() => { }}
searchValue={''}
onSearchChange={() => { }}
additionalAction={{
content: 'Save',
onAction: () => console.log('New filter saved'),
}}
/>}
/>
</Card>
<br />

44. https://polaris.shopify.com/components/navigation/footer-help#navigation
<Card sectioned>
<FooterHelp>
Learn more about{' '}
<Link url="https://help.shopify.com/manual/orders/fulfill-orders">
fulfilling orders
</Link>
.
</FooterHelp>
</Card>
<br />

45. https://polaris.shopify.com/components/navigation/link#navigation
<Card sectioned>
<Link url="https://help.shopify.com/manual">fulfilling orders</Link><br />
<Link monochrome url="https://help.shopify.com/manual">
fulfilling orders
</Link>
</Card>
<br />

46. https://polaris.shopify.com/components/navigation/pagination#navigation
<Card sectioned>
<Pagination
hasPrevious
onPrevious={() => {
console.log('Previous');
}}
hasNext
onNext={() => {
console.log('Next');
}}
/>
</Card>
<br />

47. https://polaris.shopify.com/components/navigation/tabs#navigation
<Card sectioned>
<Tabs tabs={[
{
id: 'all-customers',
content: 'All',
accessibilityLabel: 'All customers',
panelID: 'all-customers-content',
},
{
id: 'accepts-marketing',
content: 'Accepts marketing',
panelID: 'accepts-marketing-content',
},
{
id: 'repeat-customers',
content: 'Repeat customers',
panelID: 'repeat-customers-content',
},
{
id: 'prospects',
content: 'Prospects',
panelID: 'prospects-content',
},
]} selected={0} onSelect={() => { }} fitted>
<Card.Section title="title">
<p>Tab Content</p>
</Card.Section>
</Tabs>
</Card>
<br />

48. https://polaris.shopify.com/components/overlays/tooltip#navigation
<Card sectioned>
<Tooltip active content="This order has shipping labels.">
<Link>Order #1001</Link>
</Tooltip>
</Card>

</Layout.Section>
</Layout>
)
}
}

function mapDispatchToProps(dispatch) {
return bindActionCreators(
{ isDirtyAction },
dispatch
);
}

export default connect(null, mapDispatchToProps)(Page1);;