import { useNavigate } from 'react-router';
import CampusYatraLogo from '../../../assets/images/campus_yatra_logo.png'

const CampusYatraEducationLogo = () => {
    const navigate = useNavigate();

    return (
        <>
            <img
                src={CampusYatraLogo}
                alt='Campus Yatra Education'
                style={{
                    height: 'auto',
                    maxHeight: '50px',
                    width: 'auto',
                    maxWidth: '100%',
                    cursor: 'pointer',
                    objectFit: 'contain'
                }}
                onClick={() => navigate('/')}
            />
        </>
    )
}

export default CampusYatraEducationLogo;
