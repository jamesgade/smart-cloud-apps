import { Box } from "@mui/material"
import Header from "../common/Header";
import HeroSection from "../landing-page/HeroSection";
import Footer from "../common/Footer";

const Colleges = () => {
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            backgroundColor: 'white',
            color: 'black'
        }}>
            <Header />
            {/* <HeroSection /> */}
            {/* <HowItWorks /> */}
            {/* <PartnerInstitutions /> */}
            <Footer />
        </Box>
    )
}

export default Colleges;
