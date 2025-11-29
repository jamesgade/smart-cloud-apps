import { Paper, Stack, Typography } from "@mui/material";

const NoContent = () => {
    return (
        <Paper elevation={0}>
            <Stack sx={{ p: 2 }} justifyContent="center" alignItems="center">
                <Typography variant="h4" sx={{mb: 2}}>
                    No Content Available.
                </Typography>
                <Typography align="center">
                    The requested resource does not have anything to show yet.
                </Typography>
            </Stack>
        </Paper>
    )
}

export default NoContent;
