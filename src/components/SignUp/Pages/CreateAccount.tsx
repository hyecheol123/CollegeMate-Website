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
import Loading from '../../Common/Loading/Loading';
import getCU, { ApiResponse } from '../../../data/CreateUser/getCU';
// Global Styles
import PageWrapperStyle from '../Styles/PageWrapper';

const titleStyle = {
    variant: "body1",
    fontWeight: 'bold',
    align: 'left',
    paddingTop: '3%'
}

const subWrapper = {
    width: 0,
    minWidth: '100%',
    paddingLeft: '10%',
    paddingRight: '10%'
}

const inputStyle = {
    minWidth: '100%', 
    width: 0, 
    align: 'center', 
    my:'10px'    
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
    const [graduation, setGraduation] = React.useState<number[]>([]);
    const [gradOptions, setGradOptions] = React.useState<number | string>('');

    const [secToExp, setSecToExp] = React.useState<number>(0);
    const [elapsedSec, setElapsedSec] = React.useState<number>(0);
    const [errorMsg, setErrorMsg] = React.useState<string>('NONE');


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
                const apiResponse: ApiResponse = await getCU();
                // Assuming that the major options are in the 'major' field of the API response
                setMajorOptions(apiResponse.major);
                setGraduation(apiResponse.graduationYear);
            } catch (error) {
                console.error('Error fetching major options:', error);
            }
        };

        // Call the async function
        fetchOptions();
    }, []);

    // // Control variable
    // const formatSecond = (second: number): string => {
    //     return `${Math.floor(second / 60)}:${String(second % 60).padStart(2, '0')}`;
    // };
    // // Timeout for Timer
    // React.useEffect(() => {
    //     let timeout: any;
    //     if (secToExp > elapsedSec) {
    //         timeout = setTimeout(() => {
    //             setElapsedSec(elapsedSec + 1);
    //         }, 1000);
    //     }
    //     if (secToExp > 0 && secToExp <= elapsedSec) {
    //         setErrorMsg('Code Expired');
    //     }

    //     return () => clearTimeout(timeout);
    // }, [secToExp, elapsedSec]);

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
        <Box sx={{ display: 'flex', flexDirection: 'column', width: 0, minWidth: '100%', height: 0 }}>
            <Box sx={subWrapper}>
                <Typography sx={titleStyle}>Name</Typography>
                <TextField sx={inputStyle} placeholder="Enter your name"></TextField>
            </Box>
            <Box sx={subWrapper}>
                <Typography sx={titleStyle}>Nickname</Typography>
                <Box display={'flex'} flexDirection={'row'}>
                    <TextField
                        sx={{ flex: '1', align: 'center', my:'10px' }}
                        inputProps={{
                            pattern: '[a-zA-Z0-9_-]{4,20}',
                        }}
                        placeholder="Enter your nickname"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        required
                    />
                    <Button sx={{ marginLeft: '5%' }}>Verify</Button>
                </Box>
                {// Dummy TextField 
                    nickname === '' && (
                        <TextField
                            variant="standard"
                            label="DUMMY"
                            size="small"
                            margin="dense"
                            fullWidth
                            sx={{ visibility: 'hidden', paddingTop: '3%' }}
                        />
                    )
                }
                {nickname && (
                    <Box display="flex" alignItems="left" flexDirection='column' paddingTop='2%'>
                        <Box display={'flex'} flexDirection={'row'}>
                            {isNicknameLength(nickname) ? (
                                <CheckIcon color="success" />
                            ) : (
                                <ClearIcon color="error" />
                            )}
                            <Typography variant="body2" >
                                Must be between 4 and 20 characters.
                            </Typography>
                        </Box>
                        <Box display={'flex'} flexDirection={'row'}>
                            {isNicknameChar(nickname) ? (
                                <CheckIcon color="success" />
                            ) : (
                                <ClearIcon color="error" />
                            )}
                            <Typography variant="body2" >
                                May include only upper case, lower case, number, dash, or underscore.
                            </Typography>
                        </Box>
                        <Box display={'flex'} flexDirection={'row'}>
                            {!isNicknameSpace(nickname) ? (
                                <CheckIcon color="success" />
                            ) : (
                                <ClearIcon color="error" />
                            )}
                            <Typography variant="body2" >
                                Cannot contain a space.
                            </Typography>
                        </Box>
                    </Box>
                )}
            </Box>
            <Box sx={subWrapper}>
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
            <Box sx={subWrapper}>
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
                    {graduation.map((year) => (
                        <MenuItem key={year} value={year} >
                            {year}
                        </MenuItem>
                    ))}
                </Select>
            </Box>
        </Box>
    );
}

export default React.memo(CreateAccount);
