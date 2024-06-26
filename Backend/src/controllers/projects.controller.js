import { asyncHandler } from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import { Team } from '../modals/team.modal.js';
import ApiResponse from '../utils/ApiResponse.js';
import User from '../modals/user.modal.js';
import { Project } from '../modals/project.modal.js'; 
import { Task } from '../modals/tasks.modal.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';


const createProject = asyncHandler(async (req, res) => {
  try {
    // taking details regarding project 
    const { name,description,leaderToken} = req.body;
    const owner = req.user._id;

    // Create a new project document
    const newProject = new Project({
      owner,
      leaderToken,
      name,
      description,
      members: [{member:owner}],  // 'owner intially as member'
      announcements: [],
      tasks: [],
      repoInitialized:true,
    });

    // Save the new project to the database
    const savedProject = await newProject.save();

    return res.status(200).json(new ApiResponse(200,savedProject, 'Projects created successfully'));

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const addTaskToProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { taskName, description, username, status, deadline } = req.body;

  // Validate required fields
  if (!taskName || !description || !username || !status || !deadline) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    // For simplicity, assuming username is unique
    // You may want to add additional validation or fetch user ID based on the username
    const user = await User.findOne({ username });

    // user exists or not 
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // 
    const project = await Project.findById(projectId)

    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    const teamId = project.team;

    const team = await Team.findById(teamId);

    if(team.owner.toString() !== req.user._id.toString()){
      return  res.status(401).json({ success: false, message: "Unauthorized!" });
    }


    if (!team) {
      return res.status(403).json({ success: false, message: "Project does not have an associated team" });
    }
    
    // Create a new task instance
    const newTask = new Task({
      taskName,
      description,
      member: user._id, // Assign the user ID to the task
      status,
      deadline,
    });

    // Save the new task to the database
    const savedTask = await newTask.save();

    // For simplicity, assuming projectId is valid
    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      { $push: { tasks: savedTask._id } },
      { new: true }
    );

    return res.status(201).json({
      success: true,
      project: updatedProject,
      task: savedTask,
    });
  } catch (error) {
    console.error("Error adding task to project:", error.message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

const repoCheck = asyncHandler(async (req, res) => {
  try {
    const { repoName, owner, projectId } = req.body;

    if (!repoName || !projectId || !owner) {
      return res.status(400).json({ message: 'Invalid request. Missing or empty parameters.' });
    }

    // Assuming you have a project model
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Update the project details with repoName and owner
    project.repo = {
      repoName: repoName,
      owner: owner,
    };

    // Update the project to indicate that the repository has been initialized
    project.repoInitialized = true;

    await project.save();

    res.status(201).json({ message: 'Repository created and project updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

const getProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  try {
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json({ project });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

const getCurrentProject = asyncHandler(async (req, res) => {
  try {
    const {projectId} = req.params;

    // Find project by project ID
    const project = await Project.findById(projectId);

    // Check if team exists
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    return res.status(200).json(new ApiResponse(200, project, 'Project details retrieved successfully'));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

const uploadTheme = asyncHandler(async (req, res) => {
  try {
    console.log('backend me aa rhe hai bhaiyaaa!')
      const { projectId } = req.params;

      if (!req.file) {
          return res.status(400).json({ error: 'No file uploaded' });
      }

      // Fetch the project to verify the owner
      const project = await Project.findById(projectId);

      if (!project) {
          return res.status(404).json({ error: 'Project not found' });
      }
      // Assuming the file is stored in req.file.path by multer
      const localFilePath = req.file.path;

      // Upload file to Cloudinary
      const cloudinaryResponse = await uploadOnCloudinary(localFilePath);

      if (!cloudinaryResponse) {
          return res.status(500).json({ error: 'Failed to upload file to Cloudinary' });
      }

      // Update the theme in the project document
      project.theme = cloudinaryResponse.url;
      await project.save();

      res.status(200).json({ url: cloudinaryResponse.url });
  } catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

// Get Teams for User
const getProjectsForUser = asyncHandler( async (req, res) => {
  try {
    const userId = req.user._id;

    const projects = await Project.find({
      $or: [
        { owner: userId }, // The user is the owner
        { 
          members: {
            $elemMatch: {
              member: userId,
              isAccepted: true
            }
          }
        } // The user is a member and has accepted the invitation
      ]
    });

    return res.status(200).json(new ApiResponse(200, projects, 'projects retrieved successfully'));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get all member's details from team 
const getAllmembers = asyncHandler(async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);

    if (!project) {
      throw new ApiError(404, 'Team not found');
    }

    // Fetch details of all members in the team
    const membersPromises = project.members.map(async ({ member, role,isAccepted }) => {
      const user = await User.findById(member);
      if (!user) {
        throw new ApiError(404, `User with ID ${member} not found`);
      }

      const { password, refreshToken, ...userData } = user.toObject(); // Convert Mongoose document to plain object
      return { ...userData, role,isAccepted }; // Include the role in the returned data
    });

    const members = await Promise.all(membersPromises);

    return res.status(200).json(new ApiResponse(200, members, 'Project members fetched successfully'));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

const invitationToUser = asyncHandler(async (req, res) => {
  try {
    const { projectId, username } = req.body;
    // Check if the team exists
    const project = await Project.findById(projectId);
    if (!project) {
      throw new ApiError(404, 'Team not found');
    }

    // Check if the user is the owner of the team
    if (project.owner.toString() !== req.user._id.toString()) {
      throw new ApiError(403, 'You do not have permission to add members to this team');
    }

    // Check if the member user exists
    const memberUser = await User.findOne({ username });
    if (!memberUser) {
      throw new ApiError(404, 'Member user not found');
    }

    // Check if the member is already a part of the team
    const isMemberExists = project.members.some(member => member.member.toString() === memberUser._id.toString());
    if (isMemberExists) {
      throw new ApiError(400, 'Member is already part of the team');
    }

    // Add the member to the team with default role
    project.members.push({ member: memberUser._id });

    await project.save();
    
    memberUser.isAccepted = false;

    return res.status(200).json(new ApiResponse(200, memberUser, 'Member added to the team successfully'));
  } catch (error) {
    console.error(error);

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

const addMemberToProject = asyncHandler(async (req, res) => {
  const { owner, repoName} = req.body;

  const userId = req.user._id
  try {
      // Find the project by repo owner and repoName
      const project = await Project.findOne({
          'repo.owner': owner,
          'repo.repoName': repoName
      });

      if (!project) {
          res.status(404);
          throw new Error('Project not found');
      }

      // Find the member in the project's members array and update isAccepted to true
      const member = project.members.find(m => m.member.toString() === userId.toString());

      if (!member) {
          res.status(404);
          throw new Error('Member not found in the project');
      }

      member.isAccepted = true;

      await project.save();

      res.status(200).json({ message: 'Member accepted successfully' });
  } catch (error) {
      res.status(500);
      throw new Error(error.message);
  }
});


const removeAfterDeclination = asyncHandler(async (req,res)=>{
  const { owner, repoName } = req.body;
  const userId = req.user._id;

  try {
      // Find the project by repo owner and repoName
      const project = await Project.findOne({
          'repo.owner': owner,
          'repo.repoName': repoName
      });

      if (!project) {
          res.status(404);
          throw new Error('Project not found');
      }

      // Find the member in the project's members array
      const memberIndex = project.members.findIndex(m => m.member.toString() === userId.toString());

      if (memberIndex === -1) {
          res.status(404);
          throw new Error('Member not found in the project');
      }

      // Remove the member from the array
      project.members.splice(memberIndex, 1);

      // Save the updated project
      await project.save();

      res.status(200).json({ message: 'Member removed successfully' });
  } catch (error) {
      res.status(500);
      throw new Error(error.message);
  }
})

// Remove Member from Team
const removeMemberFromProject = asyncHandler(async(req, res) => {
  try {
    const { projectId, memberId } = req.body;

    // Check if the team exists
    const project = await Project.findById(projectId);
    if (!project) {
      throw new ApiError(404, 'Project not found');
    }

    // Check if the user is the owner of the team
    if (project.owner.toString() !== req.user._id.toString()) {
      throw new ApiError(403, 'You do not have permission to remove members from this team');
    }

    // Check if the member user exists
    const memberUser = await User.findById(memberId);
    if (!memberUser) {
      throw new ApiError(404, 'Member user not found');
    }

    // Check if the member is part of the team
    const isMemberInTeam = project.members.some( member=> member.member.toString() === memberId.toString());
    console.log(isMemberInTeam,memberId);
    if (!isMemberInTeam) {
      throw new ApiError(400, 'Member is not part of the team');
    }

   // Remove the member from the team
   project.members = project.members.filter(member => member.member.toString() !== memberId);
   await project.save();

    return res.status(200).json(new ApiResponse(200, project, 'Member removed from the team successfully'));
  } catch (error) {
    console.error(error);

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Set role for a team member
const setRoleForMember = asyncHandler(async (req, res) => {
  try {
    const { projectId, memberId, role } = req.body;

    // Check if the team exists
    const project = await Project.findById(projectId);
    if (!project) {
      throw new ApiError(404, 'Team not found');
    }

    // Check if the user is the owner of the team
    if (project.owner.toString() !== req.user._id.toString()) {
      throw new ApiError(403, 'You do not have permission to set roles in this team');
    }

    // Find the member in the team's members array
    const member = project.members.find(member => member.member.toString() === memberId);
    if (!member) {
      throw new ApiError(404, 'Member not found in the team');
    }

    // Update the member's role
    member.role = role;
    await project.save();

    return res.status(200).json(new ApiResponse(200, member, 'Role assigned to the member successfully'));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// add milestones of project that has to be achieved
const addMilestoneToProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { mileStone,completed} = req.body;

  // Validate required fields
  if (!mileStone){
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    // Find the project by ID
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    // Assuming req.user._id is the ID of the current authenticated user
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: "Unauthorized!" });
    }

    // Create a new milestone object
    const newMilestone = {
      mileStone,
      completed,
    };

    // Add the new milestone to the project's milestones array
    project.projectMilestones.push(newMilestone);

    // Save the updated project to the database
    const updatedProject = await project.save();

    return res.status(201).json({
      success: true,
      project: updatedProject,
      milestone: newMilestone,
    });
  } catch (error) {
    console.error("Error adding milestone to project:", error.message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});


const getAllMilestones =  asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  try {
    // Find the project by ID
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    const milestones = project.projectMilestones;

    return res.status(201).json({
      milestones
    });
  } catch (error) {
    console.error("Error adding milestone to project:", error.message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

const deleteMilestone = asyncHandler(async (req, res) => {
  const { projectId, milestoneId } = req.params;

  try {
    // Find the project by its ID
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

      // Assuming req.user._id is the ID of the current authenticated user
      if (project.owner.toString() !== req.user._id.toString()) {
        return res.status(401).json({ success: false, message: "Unauthorized!" });
      }

    // Find the milestone by its ID and remove it from the milestones array
    const milestoneIndex = project.projectMilestones.findIndex(m => m._id.toString() === milestoneId.toString());
    
    if (milestoneIndex === -1) {
      return res.status(404).json({ message: 'Milestone not found' });
    }

    project.projectMilestones.splice(milestoneIndex, 1);


    // Save the updated project
    await project.save();

    res.status(200).json({ message: 'Milestone deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

const checkMilestone = asyncHandler(async (req, res) => {
  const { milestoneId,projectId } = req.params;

  
  try {
    if (!milestoneId || !projectId) {
      return res.status(400).json({ success: false, message: "Milestone ID is required" });
    }
    // Find the project that contains the milestone
    const project = await Project.findById(projectId);
    
    if (!project) {
      
      return res.status(404).json({ success: false, message: "Milestone not found" });
    }
    // Assuming req.user._id is the ID of the current authenticated user
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: "Unauthorized!" });
    }
    
    // Find the milestone within the project's milestones array
    const milestone = project.projectMilestones.id(milestoneId);

    if (!milestone) {
      return res.status(404).json({ success: false, message: "Milestone not found" });
    }

    // Update the completed attribute of the milestone to true
    milestone.completed = !milestone.completed;

    // Save the updated project
    await project.save();

    res.status(200).json({ success: true, message: "Milestone marked as completed", milestone });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});


export { checkMilestone ,deleteMilestone,addMilestoneToProject,getAllMilestones,createProject ,removeMemberFromProject,setRoleForMember,removeAfterDeclination,addMemberToProject,invitationToUser,getProjectsForUser,getAllmembers, getCurrentProject,addTaskToProject,repoCheck,getProject,uploadTheme};
