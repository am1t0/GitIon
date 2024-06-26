import {Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { veryfyJWT } from "../middlewares/auth.middleware.js";
import {createProject,deleteMilestone,checkMilestone ,getAllMilestones,addMilestoneToProject,removeMemberFromProject,removeAfterDeclination,setRoleForMember,addMemberToProject,invitationToUser,addTaskToProject,getAllmembers,getProjectsForUser , repoCheck, getProject, getCurrentProject,uploadTheme} from "../controllers/projects.controller.js"


const router = Router();

router.route('/create-project').post(veryfyJWT,createProject);

router.route('/:projectId/create-tasks').post(veryfyJWT,addTaskToProject);

router.route('/repoDetail').post(veryfyJWT,repoCheck);

router.route("/projects-for-user").get(veryfyJWT,getProjectsForUser)

router.route('/add-members').post(veryfyJWT,invitationToUser)

router.route('/remove-member').delete(veryfyJWT,removeMemberFromProject)

router.route('/member-accepted').post(veryfyJWT,addMemberToProject)

router.route('/member-declined').delete(veryfyJWT,removeAfterDeclination)

router.route('/setRole').post(veryfyJWT,setRoleForMember)

router.route('/members/:projectId').get(veryfyJWT,getAllmembers)

router.route('/:projectId').get(veryfyJWT,getProject);

router.route('/currProject/:projectId').get(veryfyJWT,getCurrentProject)

router.route('/:projectId/add-milestone').post(veryfyJWT,addMilestoneToProject)

router.route('/:projectId/:milestoneId/delete').delete(veryfyJWT,deleteMilestone)

router.route('/:projectId/:milestoneId/completed').post(veryfyJWT,checkMilestone );

router.route('/:projectId/get-milestones').get(veryfyJWT,getAllMilestones)

router.route('/theme-upload/:projectId').post(veryfyJWT,upload.single('theme'),uploadTheme)

export default router;