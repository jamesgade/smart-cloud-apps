import { useEffect } from 'react';
import { Box, Container, Typography, List, ListItem } from '@mui/material';

const TermsAndConditionsPage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5', py: 8 }}>
      <Container maxWidth="lg">
        <Box sx={{
          backgroundColor: '#fff',
          p: { xs: 3, md: 6 },
          borderRadius: 2,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <Typography variant="h3" sx={{ mb: 4, fontWeight: 'bold', color: '#333' }}>
            Terms and Conditions
          </Typography>

          <Typography sx={{ mb: 3, lineHeight: 1.8 }}>
            The terms of service and conditions mentioned here are reflected according to the services provided by our company, Campus Yatra. These Terms and Conditions serve as a contract between the user and the parent company of this website, Campus Yatra.
          </Typography>

          <Typography sx={{ mb: 3, lineHeight: 1.8 }}>
            The service provider of www.campusyatra.com webpage/mobile application or any form of web or mobile application is Campus Yatra Private Limited based in Hyderabad, Telangana, India. As of now, i.e., we operate according to the Indian and State laws mentioned herewith.
          </Typography>

          <Typography sx={{ mb: 3, lineHeight: 1.8 }}>
            Mere visiting of this website makes you enter into a contract with the company, and no separate signatures in any form are required to enforce these terms and conditions. In the following document, if there are terms such as COMPANY, We, US, or OUR, it means Campus Yatra Private Limited. Broadly speaking, before you avail any of our services, i.e., accessing the information displayed on the website like details regarding various types of exams, scholarships, college details, articles, blogs, or news, it is considered that you are abiding by these terms and conditions. These terms and conditions can be updated or amended from time to time as per our policies. We reserve the right to update as and when required, and the updated terms and conditions will govern you when you visit any of our service-providing platforms.
          </Typography>

          <Typography sx={{ mb: 3, lineHeight: 1.8 }}>
            You need not register at present to access our service or platforms. In this process, if any digital data is generated like cookies, IP address, or in any form, we are not storing any data. A very detailed policy of how we use your data is stated in the Privacy Policy.
          </Typography>

          <Typography sx={{ mb: 3, lineHeight: 1.8 }}>
            To access our service, the user has to be 18 or above. In case a minor is using our service, explicit parental or guardian consent is required. Users are warned not to reveal their personal information to any other user if they are minors. The company will not hold any legal responsibility if the user shares their personal information with any person other than when the company explicitly asks for it to provide service.
          </Typography>

          <Typography sx={{ mb: 3, lineHeight: 1.8 }}>
            We are constantly working on improving our services by adding new functionalities. As part of this, we may add, remove, or update the existing functionalities, and the user cannot claim any damages or legal issues due to these changes. If there is any significant change that impacts the user's data, the service user will be asked for explicit consent.
          </Typography>

          <Typography sx={{ mb: 3, lineHeight: 1.8 }}>
            If we learn that the information provided by you is falsified and misleading, we reserve the right to take appropriate legal action. The company has absolute authority over the kind of content displayed, including promotional and advertisements and potential partners.
          </Typography>

          <Typography sx={{ mb: 3, lineHeight: 1.8 }}>
            When you access information, either in the form of written or pictorial representation or images by us or any vendors or contracts related to us on the website or application, it is copyrighted under Indian law. We reserve the right to take legal action if there is any unauthorized use of this information.
          </Typography>

          <Typography sx={{ mb: 3, lineHeight: 1.8 }}>
            If we find any misuse, abuse, harm, or interference with the information provided by us or the company name, strict legal action will be taken against the person.
          </Typography>

          <Typography sx={{ mb: 3, lineHeight: 1.8, fontWeight: 'bold' }}>
            Note: In case of conflict of information between website and printed book, the information displayed in the website is final.
          </Typography>

          <Typography variant="h5" sx={{ mt: 5, mb: 3, fontWeight: 'bold', color: '#333' }}>
            Prohibited Acts:
          </Typography>

          <List sx={{ mb: 4 }}>
            <ListItem sx={{ display: 'list-item', ml: 2, mb: 1 }}>
              <Typography>Installing bugs, spamming, hacking, or bypassing our systems or protective measures.</Typography>
            </ListItem>
            <ListItem sx={{ display: 'list-item', ml: 2, mb: 1 }}>
              <Typography>Copy-pasting the existing content or scraping the content. If any violation is found, you will be blocked from accessing our applications, and appropriate legal action will be initiated against you.</Typography>
            </ListItem>
            <ListItem sx={{ display: 'list-item', ml: 2, mb: 1 }}>
              <Typography>Gaining or attempting to gain unauthorized access to any part or complete webpage, website, or mobile application or any URL related to us.</Typography>
            </ListItem>
            <ListItem sx={{ display: 'list-item', ml: 2, mb: 1 }}>
              <Typography>Usage of any software or automated programs to crawl, scrape, or extract the information in any manner.</Typography>
            </ListItem>
            <ListItem sx={{ display: 'list-item', ml: 2, mb: 1 }}>
              <Typography>Deciphering or trying to reverse engineer the source code.</Typography>
            </ListItem>
            <ListItem sx={{ display: 'list-item', ml: 2, mb: 1 }}>
              <Typography>Creating unreasonable traffic to disrupt the general usage for the larger public.</Typography>
            </ListItem>
            <ListItem sx={{ display: 'list-item', ml: 2, mb: 1 }}>
              <Typography>Campaigning and spreading misinformation against the company or the services we provide or the information displayed on the website.</Typography>
            </ListItem>
            <ListItem sx={{ display: 'list-item', ml: 2, mb: 1 }}>
              <Typography>Repurposing these images or any information without any prior consent of the company.</Typography>
            </ListItem>
          </List>

          <Typography variant="h5" sx={{ mt: 5, mb: 3, fontWeight: 'bold', color: '#333' }}>
            Before signing up to utilize any of the services, users must consent to the following:
          </Typography>

          <List sx={{ mb: 4 }}>
            <ListItem sx={{ display: 'list-item', ml: 2, mb: 1 }}>
              <Typography>They will not use any of the information to gain financial benefits.</Typography>
            </ListItem>
            <ListItem sx={{ display: 'list-item', ml: 2, mb: 1 }}>
              <Typography>Misuse the communication page by sending junk mail or spam mail.</Typography>
            </ListItem>
            <ListItem sx={{ display: 'list-item', ml: 2, mb: 1 }}>
              <Typography>Impersonating another person's identity to get information.</Typography>
            </ListItem>
            <ListItem sx={{ display: 'list-item', ml: 2, mb: 1 }}>
              <Typography>To threaten, harass, or intimidate any user.</Typography>
            </ListItem>
            <ListItem sx={{ display: 'list-item', ml: 2, mb: 1 }}>
              <Typography>Our webpage or application might have some paid advertisements, and from time to time, according to company policy, certain details like your IP address and courses you are looking for might be shared with partner institutions and companies. As of now, i.e., 12-10-2024, no such data is collected by us.</Typography>
            </ListItem>
          </List>

          <Typography sx={{ mb: 3, lineHeight: 1.8 }}>
            In case of any issues, you can report to us on our social media platforms or email us. Any litigation that arises with the company shall be adjudicated in Hyderabad civil courts.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default TermsAndConditionsPage;
