/**
 * Component for the first page of signup page (SignUpTerms).
 * @author Heewon Kim <khw0285@gmail.com>
 */

// React
import React from 'react';
// Material UI
import { Box, Typography, TextField, Button } from '@mui/material';
import { Check as CheckIcon, Clear as ClearIcon } from '@mui/icons-material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
// Components
import postCreateUser, { ApiResponse } from '../../../data/SignUp/postCreateUser';
// Global Styles
import PageWrapperStyle from '../Styles/PageWrapper';

const titleStyle = {
    variant: "body1",
    fontWeight: 'bold',
    align: 'left',
}

const subWrapper = {
    width:'60%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
}

const inputStyle = {
    minWidth: '100%',
    align: 'center',
    my: '16px'
}

/**
 * React Functional Component for SignUp page's first page
 * @param {ISignUpTermsProps} props properties sent from this parents
 * @return {React.ReactElement} Renders first page of about page
 */
function CreateAccount(): React.ReactElement {
    const [nickname, setNickname] = React.useState('');
    const [major, setMajor] = React.useState<string[]>([]);
    const [majorOptions, setMajorOptions] = React.useState<string[]>([]);
    const [gradOptions, setGradOptions] = React.useState<number | string>('');
    const currentYear = new Date().getFullYear();

    const graduationYears = Array.from({ length: currentYear - 2015 + 5 }, (_, index) => 2015 + index);

    // Function to check if the nickname follows the rules
    const isNicknameLength = (value: string) => {
        const pattern = /^.{4,20}$/;
        return pattern.test(value);
    };
    const isNicknameChar = (value: string) => {
        const pattern = /^[a-zA-Z0-9_-]*$/;
        return pattern.test(value);
    };
    const isNicknameSpace = (value: string) => {
        const pattern = /\s/;
        return pattern.test(value);
    };

    // Fetch major options when the component mounts
    React.useEffect(() => {
        // Define an async function to fetch data from getCU
        const fetchOptions = async () => {
            try {
                const apiResponse: ApiResponse = await postCreateUser();
                // Assuming that the major options are in the 'major' field of the API response
                setMajorOptions(apiResponse.major);
            } catch (error) {
                console.error('Error fetching major options:', error);
            }
        };

        // Call the async function
        fetchOptions();
    }, []);

    const handleMajor = (event: SelectChangeEvent<typeof major>) => {
        const {
            target: { value },
        } = event;
        setMajor(
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const handleGraduation = (event: SelectChangeEvent<typeof gradOptions>) => {
        const {
            target: { value },
        } = event;
        setGradOptions(value);
    };

    return (
        <Box mt={'16px'} sx={{...PageWrapperStyle, alignItems: 'center'}}>
            <Box sx={subWrapper}>
                <Box flex={1}>
                    <Typography sx={titleStyle}>Name</Typography>
                    <TextField sx={inputStyle} placeholder="Enter your name"></TextField>
                </Box>
                <Box flex={1}>
                    <Typography sx={titleStyle}>Nickname</Typography>
                    <Box display={'flex'} flexDirection={'row'}>
                        <TextField
                            sx={{ flex: '1', align: 'center', my: '16px' }}
                            inputProps={{
                                pattern: '[a-zA-Z0-9_-]{4,20}',
                            }}
                            placeholder="Enter your nickname"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            required
                        />
                        <Button>Verify</Button>
                    </Box>
                    <Box mb='12px'>
                        <Box display={'flex'} flexDirection={'row'}>
                            {isNicknameLength(nickname) && nickname !== null ? (
                                <CheckIcon color="success" />
                            ) : (
                                <ClearIcon color="error" />
                            )}
                            <Typography variant="body2" >
                                Must be between 4 and 20 characters.
                            </Typography>
                        </Box>
                        <Box display={'flex'} flexDirection={'row'}>
                            {isNicknameChar(nickname) && nickname !== null ? (
                                <CheckIcon color="success" />
                            ) : (
                                <ClearIcon color="error" />
                            )}
                            <Typography variant="body2" >
                                May include only upper case, lower case, number, dash, or underscore.
                            </Typography>
                        </Box>
                        <Box display={'flex'} flexDirection={'row'}>
                            {!isNicknameSpace(nickname) && nickname !== null ? (
                                <CheckIcon color="success" />
                            ) : (
                                <ClearIcon color="error" />
                            )}
                            <Typography variant="body2" >
                                Cannot contain a space.
                            </Typography>
                        </Box>
                    </Box>
                </Box>
                <Box flex={1}>
                    <Typography sx={titleStyle}>Major</Typography>
                    <Select sx={inputStyle}
                        value={major}
                        onChange={handleMajor}
                        // set the size of list
                        MenuProps={{
                            PaperProps: {
                                style: {
                                    maxHeight: '200px',
                                },
                            },
                        }}
                    >
                        {majorOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </Select>
                </Box>
                <Box flex={1}>
                    <Typography sx={titleStyle}>Expected Graduation Year</Typography>
                    <Select
                        sx={inputStyle}
                        value={gradOptions}
                        onChange={handleGraduation}
                        // set the size of list
                        MenuProps={{
                            PaperProps: {
                                style: {
                                    maxHeight: '200px',
                                },
                            },
                        }}
                    >
                        {graduationYears.map((year) => (
                            <MenuItem key={year} value={year} >
                                {year}
                            </MenuItem>
                        ))}
                    </Select>
                </Box>
            </Box>
        </Box>
    );
}

export default React.memo(CreateAccount);