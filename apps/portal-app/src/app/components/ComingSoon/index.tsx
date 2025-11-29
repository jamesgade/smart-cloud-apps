import { Box, Icon, Paper, Stack, Typography } from "@mui/material";
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const ComingSoon = () => {
    return (
        <Paper>
            <Stack sx={{ p: 2 }} justifyContent="center" alignItems="center">
                <AccessTimeIcon sx={{
                    fontSize: 100,
                    mb: 2,
                }} />
                <Typography fontSize={30} color="textPrimary" align="center">
                    Coming Soon
                </Typography>
            </Stack>
        </Paper>
    )
}

export default ComingSoon;
