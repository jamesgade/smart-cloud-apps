export const customStyles = {
    theme: {
        light: {},
        dark: {},
    },
    auth: {
        button: {
            padding: "0.75rem",
            fontSize: "1rem",
            textTransform: "none",
            backgroundColor: "primary.500",
            color: "white",
            borderRadius: "0.75rem",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            "&:hover": {
                backgroundColor: "primary.dark",
            },
            "&:disabled": {
                backgroundColor: "#B0C4DE",
                color: "#ffffff",
            },
        },
        input: {
            backgroundColor: "#ffffff",
            width: '100%',
            borderRadius: "0.75rem",
            marginTop: '0.5rem',
            "& .MuiOutlinedInput-root": {
                "& fieldset": {
                    border: "none",
                },
                color: '#000',
            },
        },
        clickableText: {
            cursor: 'pointer',
            fontWeight: 'bold',
        }
    },
    dashboard: {
        tab: {
            borderRadius: '1rem 1rem 0 0',
            textTransform: 'none',
            border: '1px solid',
            borderColor: 'divider',
        },
        main: {
            tab: {
            },
            selectedTab: {
                border: 'none',
                fontWeight: 'bold'
            },
            countWidget: {
                padding: 2,
                borderRadius: '0.5rem',
                border: '1px solid',
                borderColor: 'divider'
            },
        }
    }
}
