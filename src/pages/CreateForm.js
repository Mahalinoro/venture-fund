import React, { useState }   from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { useForm } from "react-hook-form";
import {web3, crowdfunding} from '../pages/App.js';
import { Link } from "react-router-dom";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
// import AdapterDateFns from '@mui/lab/AdapterDateFns';
// import LocalizationProvider from '@mui/lab/LocalizationProvider';
// import DateTimePicker from '@mui/lab/DateTimePicker';


function CreateForm() {
    const { handleSubmit, register, getValues, control, reset } = useForm({
    defaultValues: {
      title: '',
      url: '',
      goal: 0,
      deadline: 0,
      description: ''
    }
    });

    const [isOpen, setIsOpen] = useState(false);
    
    function handleClickOpen(){
        setIsOpen(() => true);
    }

    function handleClose(){
        setIsOpen(() => false);
    }

    const onSubmit = async (data) => {
        let title = getValues('title');
        let url = getValues('url');
        let goal = getValues('goal');
        let deadline = getValues('deadline');
        let description = getValues('description');

        const accounts = await web3.eth.getAccounts()
        const activeAccount = accounts[0];

        await crowdfunding.methods.createProject(deadline, goal, title, description, url)
        .send({from: activeAccount}).then((value) => {
            console.log("The Promise is resolved!", value);
            handleClickOpen();
            reset();
        })
        .catch((error) => {
            console.error("The Promise is rejected!", error);
        })
    }

    return (
        <div>
            <Container sx={{width: '40%', mx: 'auto', backgroundColor: '#FFF', my: 8, p:4, borderRadius:1}}>
                <Typography sx={{textAlign:'center', fontWeight: 400, fontSize: 32, fontFamily: 'Rosario'}}>Start Your Project</Typography>
                <Box
                    component="form"
                    sx={{
                        '& .MuiTextField-root': { width: '100%'}, p:4
                    }}
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <Typography sx={{ fontWeight: 400, fontSize: 18, fontFamily: 'Rosario'}}>Title</Typography>
                    <TextField
                        {...register("title")}
                        control={control}
                        required
                        name="title"
                        placeholder="e.g.Your Venture Name"
                        size="small"
                        type="text"
                        margin="dense"
                        sx={{'& .MuiOutlinedInput-root': {
                            '& fieldset': {
                            borderColor: '#F2F2F2', 
                            }, '&:hover fieldset': {
                            borderColor: '#816FEF',
                            },  '&.Mui-focused fieldset': {
                            borderColor: '#816FEF',
                        }}}}
                    />

                    <Typography sx={{ fontWeight: 400, fontSize: 18, fontFamily: 'Rosario'}}>Image URL</Typography>
                    <TextField
                        {...register("url")}
                        control={control}
                        required
                        name="url"
                        placeholder="e.g. url"
                        size="small"
                        type="url"
                        margin="dense"
                        sx={{'& .MuiOutlinedInput-root': {
                            '& fieldset': {
                            borderColor: '#F2F2F2', 
                            }, '&:hover fieldset': {
                            borderColor: '#816FEF',
                            },  '&.Mui-focused fieldset': {
                            borderColor: '#816FEF',
                        }}}}
                    />

                    <Typography sx={{ fontWeight: 400, fontSize: 18, fontFamily: 'Rosario'}}>Goal Amount</Typography>
                    <TextField
                        control={control}
                        {...register("goal")}
                        required
                        name="goal"
                        placeholder="e.g. 100, 80, 5  in Ether"
                        size="small"
                        type="number"
                        margin="dense"
                        sx={{'& .MuiOutlinedInput-root': {
                            '& fieldset': {
                            borderColor: '#F2F2F2', 
                            }, '&:hover fieldset': {
                            borderColor: '#816FEF',
                            },  '&.Mui-focused fieldset': {
                            borderColor: '#816FEF',
                        }}}}
                    />

                    <Typography sx={{ fontWeight: 400, fontSize: 18, fontFamily: 'Rosario'}}>Deadline (in Days)</Typography>
                    <TextField
                        control={control}
                        {...register("deadline")}
                        required
                        name="deadline"
                        size="small"
                        placeholder="e.g. 1, 2, 30 days"
                        type="number"
                        margin="dense"
                        sx={{'& .MuiOutlinedInput-root': {
                            '& fieldset': {
                            borderColor: '#F2F2F2', 
                            }, '&:hover fieldset': {
                            borderColor: '#816FEF',
                            },  '&.Mui-focused fieldset': {
                            borderColor: '#816FEF',
                        }}}}
                    />

                    <Typography sx={{ fontWeight: 400, fontSize: 18, fontFamily: 'Rosario'}}>Description</Typography>
                    <TextField
                        control={control}
                        {...register("description")}
                        name="description"
                        multiline
                        rows={4}
                        type="text"
                        placeholder="Please describe your entrepreneurial idea"
                        size="small"
                        margin="dense"
                        sx={{'& .MuiOutlinedInput-root': {
                            '& fieldset': {
                            borderColor: '#F2F2F2', 
                            }, '&:hover fieldset': {
                            borderColor: '#816FEF',
                            },  '&.Mui-focused fieldset': {
                            borderColor: '#816FEF',
                        }}}}
                        />
                    <Typography></Typography>
                    <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{mt: 2}}> 
                        <Link to="/">
                            <Button variant="outlined" sx={{border: '1px solid #816FEF', color: "#816FEF", '&:hover': {
                            border:'1px solid #816FEF', backgroundColor: "transparent"}}}>cancel</Button>
                        </Link>
                        
                        <Button variant="contained" sx={{bgcolor: '#816FEF', '&:hover': {
                            backgroundColor: '#816FEF'}}} type="submit">start</Button>

                    </Stack>
                    
                </Box>

            </Container>

            <Dialog
                  open={isOpen}
                  onClose={() => handleClose()}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                  sx={{width: '40%', mx:'auto'}}
                >
                  <DialogTitle id="alert-dialog-title">
                    {"Success"}
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                     Your campaign has been created successfully. 
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Link to="/">
                        <Button sx={{color: '#816FEF'}}>go back to home</Button>
                    </Link>
                    <Button onClick={() =>handleClose()} autoFocus sx={{color: "#816FEF"}}>
                      close 
                    </Button>
                  </DialogActions>
                </Dialog>

        </div>
    )
}

export default CreateForm;