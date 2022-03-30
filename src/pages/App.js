import '../assets/css/App.css';
import NavBar from '../components/NavBar';
import ProjectCard from '../components/ProjectCard';
import bitcoin from '../bitcoin.svg'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import { Routes, Route, Link } from "react-router-dom";
import CreateForm from './CreateForm';
import Project from './Project';
import { CROWDFUNDING_ABI, CROWDFUNDING_ADDRESS } from '../config';
import React from "react";
import Web3 from 'web3';  

const web3 = new Web3(Web3.givenProvider || "ws://localhost:7545");
const crowdfunding = new web3.eth.Contract(CROWDFUNDING_ABI, CROWDFUNDING_ADDRESS);

function App(){
  return (
      <div className="App">
        <NavBar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreateForm />} />
          <Route path="/project/:id" element={<Project />}></Route>
        </Routes>
      </div>
  )
}

class Home extends React.Component {
  constructor(props) {
        super(props);
        this.state = { projects: [], count: 0, statuses: []};
  }

  componentDidMount(){
    this.getProjects()
    this.checkFundingStatus()
  }

  async getProjects(){
    const projectCount = await crowdfunding.methods.getProjectsCount().call();
    this.setState({count: projectCount});
    for (var i = 0; i <= this.state.count; i++) {
        const project = await crowdfunding.methods.projects(i).call()
        const status = await crowdfunding.methods.projectToState(i).call()
        this.setState({projects: [...this.state.projects, project], statuses: [...this.state.statuses, status]})
    }
    console.log(this.state.statuses)
  }

  async checkFundingStatus(){
    for (var i = 0; i <= this.state.count; i++) {
        await crowdfunding.methods.checkFundingStatus(i).send()
        const status = await crowdfunding.methods.projectToState(i).call()
        this.setState({statuses: [...this.state.statuses, status]})
    }
  }

  render() {
    return(
       <div className="Home">
      <Container sx={{width: '70%', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center', my:8 }}>
        <Box sx={{ color: '#FFFF', mb: 2}}>
          <Typography sx={{ fontWeight: 600, fontSize: 32, fontFamily: 'Rosario', letterSpacing:1.25}}>Welcome to VentureFund!</Typography>
        </Box>
        <Box sx={{ color: '#FFFF', px:'20%'}}>
          <Typography sx={{ fontWeight: 300, fontSize: 16, letterSpacing:1.25, lineHeight:1.2}}>VentureFund is a crowdfunding platform to help college student entrepeneurs fund their venture. We help you bring your entrepreneurial idea to life.</Typography>
        </Box>
        <Box>
          <img src={bitcoin} alt="primary-img" style={{width: '60%'}}></img>
        </Box>
      </Container>

       <Divider sx={{width: '60%', mx: 'auto', color: "#FFF", fontFamily: 'Rosario', fontWeight: 700, fontSize: 20, "&::before": {
          borderTop: "1px solid white"
        },
        "&::after": {
          borderTop: "1px solid white"
        }}} variant="middle" light="true" textAlign="left">Projects ({this.state.count})</Divider>


        <Container sx={{width: '65%', mx: 'auto', my: 5}}>
          {this.state.projects.map((project, key) =>{
            let goalToEth = parseInt(web3.utils.fromWei(project.goalAmount.toString(), 'ether'));
            let currentToEth = parseInt(web3.utils.fromWei(project.currentBalance.toString(), 'ether'));
            let deadline = new Date(project.deadline*1000).toUTCString();
            let status, expired;
            if(this.state.statuses[key] === '0'){
              status = false;
              expired = false;
            }else if(this.state.statuses[key] === '2'){
              currentToEth = goalToEth;
              status = true;
              expired = false;
            }else{
              status = false;
              expired = true;
            }

            return(
              <Link to={`project/${key}`} 
              state={{project: project, goal: goalToEth, current: currentToEth, date: deadline, status: status, expired: expired}}>
                <ProjectCard 
                title={project.title} 
                url={project.url} 
                datetime={deadline}
                description={project.description}
                amountGoal={goalToEth} 
                amountRaised={currentToEth} 
                isCompleted={status}
                isExpired={expired}
              />
              </Link>
            )
          })}
        </Container>     
    </div>

    )
  }
}

export {App as default, web3, crowdfunding};
