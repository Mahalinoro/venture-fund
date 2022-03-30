import React from "react";
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Stack } from "@mui/material";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {web3, crowdfunding} from '../pages/App.js';
import { Link } from "react-router-dom";

const BorderLinearInProgress = styled(LinearProgress)(({ theme }) => ({
  height: 7,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === 'light' ? '#816FEF' : '#816FEF',
  },
}));

const BorderLinearProgressCompleted = styled(LinearProgress)(({ theme }) => ({
  height: 7,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === 'light' ? '#7EC278' : '#7EC278',
  },
}));

const BorderLinearProgressExpired = styled(LinearProgress)(({ theme }) => ({
  height: 7,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === 'light' ? '#EB5757' : '#EB5757',
  },
}));



class ProjectCard extends React.Component {
    constructor(props) {
        super(props);
        this.isCompleted = false;
        this.isExpired = false;
        this.title = '';
        this.url = '';
        this.datetime = '';
        this.description = '';
        this.amountGoal = 0;
        this.amountRaised = 0;
    }

    render() {
        let content, progress, progression, date;
        progression = (this.props.amountRaised / this.props.amountGoal) * 100

        if(this.props.isCompleted){
            progress = (
                <Typography sx={{color: '#7EC278', textTransform:'uppercase', letterSpacing:1.25}}>
                    completed
                  </Typography>
            )
            content = (
                <BorderLinearProgressCompleted variant="determinate" value={100}></BorderLinearProgressCompleted>
            )
            date = (
                <Typography variant="body2" sx={{fontStyle: 'italic'}}>Not Available</Typography>
            )
        }else{
            progress = (
                 <Typography sx={{color: '#816FEF', textTransform:'uppercase', letterSpacing:1.25}}>
                    ongoing
                  </Typography>
            )
            content = (
                <BorderLinearInProgress variant="determinate" value={progression}></BorderLinearInProgress>
            )
            date = (
                <Typography variant="body2" sx={{fontStyle: 'italic'}}>Up until <span style={{color: '#816FEF'}}>{this.props.datetime}</span></Typography>
            )
        }

        if(this.props.isExpired){
          progress = (
                <Typography sx={{color: '#EB5757', textTransform:'uppercase', letterSpacing:1.25}}>
                    expired
                  </Typography>
            )
            content = (
                <BorderLinearProgressExpired variant="determinate" value={progression}></BorderLinearProgressExpired>
            )
            date = (
                <Typography variant="body2" sx={{fontStyle: 'italic'}}>Not Available</Typography>
          )

        }

        return (
            <Card sx={{ width:'100%', display: 'flex', height: 350, my:5 }}>
              <CardMedia sx={{width: '45%'}}
                component="img"
                width="400px"
                image={this.props.url}
                alt="project picture"
              />
            <Box sx={{ display: 'flex', flexDirection: 'column', m:2, width: '55%' }}>
              <CardContent>
               <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                 <Typography>
                    <Typography variant="h5">{this.props.title}</Typography>
                    {date}
                  </Typography>
                  <Typography sx={{color: '#816FEF', textTransform:'uppercase', letterSpacing:1.25}}>
                    {progress}
                  </Typography>
               </Box>

               <Typography paragraph sx={{my:4, height: '50%'}}>
                   {this.props.description}
               </Typography>

               <Typography variant="body1"><span style={{fontWeight: 500}}>{this.props.amountRaised} Ether raised </span>of {this.props.amountGoal} Ether</Typography>
               {content}
              </CardContent>
            </Box>
          </Card>

        )
    }
}

class ProjectCardX extends React.Component {
    constructor(props) {
        super(props);
        this.state = {isDialogOpen: false, account: '', owner: false, value: 0, error: ''};
        this.id = '';
        this.isCompleted = false;
        this.isExpired = false;
        this.title = '';
        this.url = '';
        this.datetime = '';
        this.description = '';
        this.amountGoal = 0;
        this.amountRaised = 0;

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount(){
      this.checkOwner()
    }

    handleClickOpen(){
      this.setState({ isDialogOpen: true})
    }

    handleClose(){
      this.setState({ isDialogOpen: false})
    }

    handleChange(event) {
      this.setState({value: event.target.value});
    }

    async handleSubmit(event) {
      event.preventDefault();
      const accounts = await web3.eth.getAccounts()
      const activeAccount = accounts[0];
     

      if(!this.props.isExpired){
        const ethToWei = web3.utils.toWei(this.state.value.toString(), 'ether');
        await crowdfunding.methods.contribute(this.props.id)
        .send({from: activeAccount, value: ethToWei}).then((value) => {
            console.log("The Promise is resolved!", value);
            this.handleClickOpen(); 
          })
          .catch((error) => {
            this.setState({error: error})
          })
      }else{
        await crowdfunding.methods.getRefund(this.props.id)
        .send({from: activeAccount}).then((value) => {
          console.log("The Promise is resolved!", value);
            this.handleClickOpen(); 
        })
        .catch((error) => {
            this.setState({error: error})
        })
      }
     
    }

    async checkOwner(){
      const accounts = await web3.eth.getAccounts()
      const activeAccount = accounts[0];
    
      const owner = await crowdfunding.methods.projectToOwner(this.props.id).call()
      this.setState({account: owner})

      if(this.state.account === activeAccount){
        this.setState({owner: true})
      }
    }

    render() {
        let content, progress, progression, date, fundButton;
        progression = (this.props.amountRaised / this.props.amountGoal) * 100

        if(this.state.owner || this.props.isCompleted){
          fundButton = (
             <Button variant="contained" sx={{bgcolor: '#816FEF', '&:hover': {
                            backgroundColor: '#816FEF'}}} disabled>
                fund
              </Button>
          )
        }else{
          fundButton = (
             <Button variant="contained" sx={{bgcolor: '#816FEF', '&:hover': {
                            backgroundColor: '#816FEF'}}} type="submit" value="Submit">
                fund
                </Button>
          )
        }


        if(this.props.isCompleted){
            progress = (
                <Typography sx={{color: '#7EC278', textTransform:'uppercase', letterSpacing:1.25}}>
                    completed
                  </Typography>
            )
            content = (
                <BorderLinearProgressCompleted variant="determinate" value={100}></BorderLinearProgressCompleted>
            )
            date = (
                <Typography variant="body2" sx={{fontStyle: 'italic'}}>Not Available</Typography>
            )
        }else if(this.props.isExpired){
           progress = (
                <Typography sx={{color: '#EB5757', textTransform:'uppercase', letterSpacing:1.25}}>
                    expired
                  </Typography>
            )
            content = (
                <BorderLinearProgressExpired variant="determinate" value={progression}></BorderLinearProgressExpired>
            )
            date = (
                <Typography variant="body2" sx={{fontStyle: 'italic'}}>Not Available</Typography>
            )
           
        }else{
           progress = (
                 <Typography sx={{color: '#816FEF', textTransform:'uppercase', letterSpacing:1.25}}>
                    ongoing
                  </Typography>
            )
            content = (
                <BorderLinearInProgress variant="determinate" value={progression}></BorderLinearInProgress>
            )
            date = (
                <Typography variant="body2" sx={{fontStyle: 'italic'}}>Up until <span style={{color: '#816FEF'}}>{this.props.datetime}</span></Typography>
            )

        }

        if(!this.state.owner && this.props.isExpired){
            fundButton = (
             <Button variant="contained" sx={{bgcolor: '#EB5757', '&:hover': {
                            backgroundColor: '#EB5757'}}} type="submit" value="Submit">
                get refund
                </Button>
          )
            if(this.props.amountRaised === 0){
            fundButton = (
              <Button variant="contained" sx={{bgcolor: '#EB5757', '&:hover': {
                              backgroundColor: '#EB5757'}}} disabled>
                  get refund
                  </Button>
            )
          }
        }
      

        return (
            <Card sx={{ width:'100%', display: 'flex', height: 500, my:5 }}>
              <CardMedia sx={{width: '45%'}}
                component="img"
                width="400px"
                image={this.props.url}
                alt="project picture"
              />
            <Box sx={{ display: 'flex', flexDirection: 'column', m:2, width: '55%' }}>
              <CardContent>
               <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                 <Typography>
                    <Typography variant="h5">{this.props.title}</Typography>
                    {date}
                  </Typography>
                  <Typography sx={{color: '#816FEF', textTransform:'uppercase', letterSpacing:1.25}}>
                    {progress}
                  </Typography>
               </Box>

               <Typography paragraph sx={{my:5, height: '30%'}}>
                   {this.props.description}
               </Typography>
               
              <Typography>Amount (in ETH)</Typography>
              <Stack
                component="form"
                direction="row" 
                spacing={2}
                mb={8}
                onSubmit={this.handleSubmit}
              >
                <TextField
                        value={this.state.value} onChange={this.handleChange}
                        required
                        id="outlined-required"
                        placeholder="1.5"
                        size="small"
                        type="number"
                        sx={{width: '30%', '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                            borderColor: '#F2F2F2', 
                            }, '&:hover fieldset': {
                            borderColor: '#816FEF',
                            },  '&.Mui-focused fieldset': {
                            borderColor: '#816FEF',
                        }}}}
                    />
                {fundButton}

                <Dialog
                  open={this.state.isDialogOpen}
                  onClose={() =>this.handleClose()}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                  sx={{width: '40%', mx:'auto'}}
                >
                  <DialogTitle id="alert-dialog-title">
                    {"Success"}
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                     The transaction is confirmed. View details of the transaction on Etherscan. 
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Link to="/">
                        <Button onClick={() =>this.handleClose()} sx={{color: '#816FEF'}}>go back to home</Button>
                    </Link>
                    <Button onClick={() =>this.handleClose()} autoFocus sx={{color: "#816FEF"}}>
                      close
                    </Button>
                  </DialogActions>
                </Dialog>
              </Stack>


               <Typography variant="body1"><span style={{fontWeight: 500}}>{this.props.amountRaised} Ether raised </span>of {this.props.amountGoal} Ether</Typography>
               {content}
              </CardContent>
            </Box>
          </Card>

        )
    }
}

export {ProjectCard as default, ProjectCardX};