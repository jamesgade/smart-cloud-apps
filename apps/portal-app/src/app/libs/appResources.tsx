import DashboardIcon from '@mui/icons-material/Dashboard';
// import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import PeopleIcon from '@mui/icons-material/People';
import AssessmentIcon from '@mui/icons-material/Assessment';

export const appResources = [
    {
        identifier: "dashboard",
        name: "dashboard",
        list: "/dashboard",
        meta: {
            icon: <DashboardIcon />,
            label: "Dashboard",
        },
        options: {
            label: 'Dasboard',
            accessControl: {
                read: ["Super Admin", "Medical Company Admin", "Therapist", "Guardian", "Patient"],
                create: ["Super Admin", "Medical Company Admin"],
                edit: ["Super Admin", "Medical Company Admin"],
                delete: ["Super Admin"],
            },
        }
    },
    {
        identifier: "sessions",
        name: "sessions",
        list: "/sessions",
        edit: "sessions/edit/:id",
        meta: {
            icon: <AssessmentIcon />,
            label: "Sessions",
        },
        options: {
            label: 'Sessions',
            accessControl: {
                read: ["Super Admin", "Medical Company Admin", "Therapist"],
                create: ["Super Admin", "Medical Company Admin", "Therapist"],
                edit: ["Super Admin", "Medical Company Admin", "Therapist"],
                delete: ["Super Admin"],
            },
        }
    },
    // {
    //     identifier: "my-uploads",
    //     name: "my-uploads",
    //     list: "/my-uploads",
    //     create: "/my-uploads/create",
    //     edit: "/my-uploads/edit/:id",
    //     show: "/my-uploads/show/:id",
    //     meta: {
    //         canDelete: true,
    //         icon: <DriveFolderUploadIcon />,
    //         label: "My Uploads",
    //     },
    //     options: {
    //         label: 'My Uploads',
    //         accessControl: {
    //             read: ["Super Admin", "Medical Company Admin", "Therapist"],
    //             create: ["Super Admin", "Medical Company Admin", "Therapist"],
    //             edit: ["Super Admin", "Medical Company Admin", "Therapist"],
    //             delete: ["Super Admin"],
    //         },
    //     }
    // },
    // --------------- Fake Rest API ----------------
    {
        identifier: "users",
        name: "users",
        list: "/users",
        // create: "/users/create",
        // edit: "/users/edit/:id",
        // show: "/users/show/:id",
        meta: {
            canDelete: true,
            icon: <PeopleIcon />,
            label: "Users",
            pagination: false,
            // dataProviderName: "fakeRestAPI",    // Fake Rest API
        },
        options: {
            label: 'Users',
            accessControl: {
                read: ["Super Admin", "Medical Company Admin",],
                create: ["Super Admin", "Medical Company Admin",],
                edit: ["Super Admin", "Medical Company Admin",],
                delete: ["Super Admin"],
            },
        }
    },
    // --------------- Fake Rest API ----------------
    {
        identifier: "colleges",
        name: "colleges",
        list: "/colleges",
        meta: {
            label: "Colleges",
        },
    },
    {
        identifier: "loans",
        name: "loans",
        list: "/loans-management",
        meta: {
            label: "Loans",
        },
    },
    {
        identifier: "blogs",
        name: "blogs/admin",
        list: "/blogs-management",
        meta: {
            label: "Blogs",
        },
    },
]
