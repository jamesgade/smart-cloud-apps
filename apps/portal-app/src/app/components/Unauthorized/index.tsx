import { Paper, Stack, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router"
import { customStyles } from "../../theme/customStyles";

const Unauthorized = () => {
    const navigate = useNavigate();
    const goBack = () => navigate(-1);

    return (
        <Paper>
            <Stack sx={{ p: 2 }} justifyContent="center" alignItems="center">
                <Typography variant="h4" sx={{ mb: 2 }}>
                    Unauthorized
                </Typography>
                <Typography sx={{ mb: 2 }}>
                    You do not have access to the requested resource.
                </Typography>
                <Button variant="outlined"
                    sx={{
                        ...customStyles.auth.button
                    }}
                    onClick={goBack}>Go Back</Button>
            </Stack>
        </Paper>
    );
}

export default Unauthorized;
