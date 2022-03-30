import React from "react";
import Container from '@mui/material/Container';
import { ProjectCardX } from "../components/ProjectCard";
import { useParams, useLocation } from 'react-router-dom';


function Project() {
    const { id } = useParams();
    const location = useLocation();
    const { project, goal, current, date, status, expired } = location.state;

    return (
        <div>
            <Container sx={{width: '65%', mx: 'auto', my: 8}}>
                <ProjectCardX 
                    id = {id}
                    title={project.title} 
                    url={project.url} 
                    datetime={date}
                    description={project.description} 
                    amountGoal={goal} 
                    amountRaised={current} 
                    isCompleted={status}
                    isExpired={expired}
                />
            </Container>
        </div>
    )

}

export default Project;