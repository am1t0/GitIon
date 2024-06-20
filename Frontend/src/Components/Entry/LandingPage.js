import React from 'react';
import '../../Styles/LandingPage.css';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Notifications from './Notifications';
const LandingPage = () => {
  const navigate = useNavigate();

  const { data, isLoading } = useSelector((store) => store.user);
  const projects = useSelector((store) => store.projects.data?.data);

  const upper = (name) => {
    return name[0].toUpperCase() + name.slice(1);
  };

  const handleProjectClick = (project) => {
    const { repo } = project;
    localStorage.setItem('owner', repo.owner);
    localStorage.setItem('repoName', repo.repoName);
    localStorage.setItem('selectedBranch', 'main');
    localStorage.setItem('leaderToken', project.leaderToken);
    navigate(`/project/${project.name}/${project._id}`);
  };

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  return (
    data &&
    <div className='landingPage'>
      <h4>Welcome back, {data.fullname} !</h4>
      <Notifications />
      <div className="parts">
        <section className="personal-space">
          <h4>Personal Space</h4>
          <div className="items">
            <div className="boxes">
              <h5>Todos</h5>
              <p>Manage your daily tasks and stay organized with your personal to-do list.</p>
              <div className="goTo">
                <i className="fa-solid fa-arrow-up-right-from-square"></i>
                <p><Link to='/dashboard'>View all todos</Link></p>
              </div>
            </div>
            <div className="boxes">
              <h5>Long Plans</h5>
              <p>Plan your future projects and keep track of your long-term goals.</p>
              <div className="goTo">
                <i className="fa-solid fa-arrow-up-right-from-square"></i>
                <p><Link to='/dashboard'>View all plans</Link></p>
              </div>
            </div>
            <div className="boxes">
              <h5>Reminders</h5>
              <p>Never miss an important date or deadline with your reminders.</p>
              <div className="goTo">
                <i className="fa-solid fa-arrow-up-right-from-square"></i>
                <p><Link to='/dashboard'>View all reminders</Link></p>
              </div>
            </div>
          </div>
        </section>
        <section className='team-space'>
          <h5>Project Space</h5>
          <div className="items">
            <div className="teamsGoto">
              <div className="thd">
                <h5>Projects</h5>
                <button type="button"><Link to={'/create-project'}>Create</Link></button>
              </div>
              <div className="Tsrch">
                <input type="search" placeholder='search team..' />
              </div>
              <div className="Tlist">
                {projects?.map((project) => {
                  return <li key={project._id} onClick={() => handleProjectClick(project)}>{upper(project.name)}</li>
                })}
              </div>
            </div>
            <div className="boxes">
              <h5>Tasks</h5>
              <p>Assign and complete tasks to ensure your team projects are on track.</p>
              <div className="goTo">
                <i className="fa-solid fa-arrow-up-right-from-square"></i>
                <p>View all tasks</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LandingPage;