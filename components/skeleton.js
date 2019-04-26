import {     
    Card, 
    Layout, 
    SkeletonPage,
    TextContainer,
    SkeletonDisplayText,
    SkeletonBodyText,
 } from '@shopify/polaris';

//A markup page while page is loading. Not used for now
const LoadingPageMarkup = (
    <SkeletonPage>
    <Layout>
        <Layout.Section>
        <Card sectioned>
            <TextContainer>
            <SkeletonDisplayText size="small" />
            <SkeletonBodyText lines={9} />
            </TextContainer>
        </Card>
        </Layout.Section>
    </Layout>
    </SkeletonPage>
);

export default LoadingPageMarkup

