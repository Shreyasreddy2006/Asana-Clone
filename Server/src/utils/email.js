const nodemailer = require('nodemailer');

// Create email transporter
const createTransporter = () => {
  // For development, use ethereal email (fake SMTP service)
  // For production, use a real email service like SendGrid, AWS SES, etc.

  if (process.env.NODE_ENV === 'production') {
    // Production email configuration
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT || 587,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  } else {
    // Development - use Ethereal (or console logging)
    // For testing, you can create an Ethereal account at https://ethereal.email/
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: process.env.EMAIL_USER || 'ethereal.user@ethereal.email',
        pass: process.env.EMAIL_PASSWORD || 'ethereal-password'
      }
    });
  }
};

// Send email function
const sendEmail = async (options) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `${process.env.EMAIL_FROM_NAME || 'Asana Clone'} <${process.env.EMAIL_FROM || 'noreply@asanaclone.com'}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text
  };

  try {
    const info = await transporter.sendMail(mailOptions);

    if (process.env.NODE_ENV !== 'production') {
      console.log('Email sent:', info.messageId);
      console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    }

    return info;
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
};

// Email templates
const emailTemplates = {
  // Welcome email
  welcome: (userName) => ({
    subject: 'Welcome to Asana Clone!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #F06A6A;">Welcome to Asana Clone!</h1>
        <p>Hi ${userName},</p>
        <p>Thank you for joining Asana Clone. We're excited to have you on board!</p>
        <p>Get started by creating your first project and inviting team members.</p>
        <p>If you have any questions, feel free to reach out to our support team.</p>
        <p>Best regards,<br>The Asana Clone Team</p>
      </div>
    `,
    text: `Welcome to Asana Clone! Hi ${userName}, Thank you for joining Asana Clone. We're excited to have you on board!`
  }),

  // Task assignment notification
  taskAssigned: (userName, taskTitle, projectName, assignedBy) => ({
    subject: `You've been assigned to: ${taskTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #F06A6A;">New Task Assignment</h2>
        <p>Hi ${userName},</p>
        <p><strong>${assignedBy}</strong> has assigned you to a new task:</p>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0;">${taskTitle}</h3>
          <p style="margin: 0; color: #666;">Project: ${projectName}</p>
        </div>
        <p>Click the link below to view the task details:</p>
        <a href="${process.env.CLIENT_URL}/tasks" style="background: #F06A6A; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">View Task</a>
        <p style="margin-top: 30px;">Best regards,<br>The Asana Clone Team</p>
      </div>
    `,
    text: `New Task Assignment: ${assignedBy} has assigned you to ${taskTitle} in ${projectName}`
  }),

  // Comment notification
  commentAdded: (userName, taskTitle, commenterName, comment) => ({
    subject: `New comment on: ${taskTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #F06A6A;">New Comment</h2>
        <p>Hi ${userName},</p>
        <p><strong>${commenterName}</strong> commented on a task you're following:</p>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0;">${taskTitle}</h3>
          <p style="margin: 0; font-style: italic;">"${comment.substring(0, 150)}${comment.length > 150 ? '...' : ''}"</p>
        </div>
        <a href="${process.env.CLIENT_URL}/tasks" style="background: #F06A6A; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">View Task</a>
        <p style="margin-top: 30px;">Best regards,<br>The Asana Clone Team</p>
      </div>
    `,
    text: `New Comment: ${commenterName} commented on ${taskTitle}: "${comment.substring(0, 100)}"`
  }),

  // Workspace invitation
  workspaceInvite: (userName, workspaceName, inviterName) => ({
    subject: `You've been invited to join ${workspaceName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #F06A6A;">Workspace Invitation</h2>
        <p>Hi ${userName},</p>
        <p><strong>${inviterName}</strong> has invited you to join the <strong>${workspaceName}</strong> workspace.</p>
        <p>Accept the invitation to start collaborating with your team.</p>
        <a href="${process.env.CLIENT_URL}/workspaces" style="background: #F06A6A; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;">Accept Invitation</a>
        <p style="margin-top: 30px;">Best regards,<br>The Asana Clone Team</p>
      </div>
    `,
    text: `Workspace Invitation: ${inviterName} has invited you to join ${workspaceName}`
  }),

  // Team invitation
  teamInvite: (userName, teamName, inviterName) => ({
    subject: `You've been added to ${teamName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #F06A6A;">Team Invitation</h2>
        <p>Hi ${userName},</p>
        <p><strong>${inviterName}</strong> has added you to the <strong>${teamName}</strong> team.</p>
        <p>You can now collaborate on team projects and tasks.</p>
        <a href="${process.env.CLIENT_URL}/teams" style="background: #F06A6A; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;">View Team</a>
        <p style="margin-top: 30px;">Best regards,<br>The Asana Clone Team</p>
      </div>
    `,
    text: `Team Invitation: ${inviterName} has added you to ${teamName}`
  }),

  // Task due reminder
  taskDueReminder: (userName, taskTitle, dueDate) => ({
    subject: `Reminder: ${taskTitle} is due soon`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #F06A6A;">Task Due Reminder</h2>
        <p>Hi ${userName},</p>
        <p>This is a reminder that the following task is due soon:</p>
        <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #F06A6A;">
          <h3 style="margin: 0 0 10px 0;">${taskTitle}</h3>
          <p style="margin: 0; color: #666;">Due: ${new Date(dueDate).toLocaleDateString()}</p>
        </div>
        <a href="${process.env.CLIENT_URL}/tasks" style="background: #F06A6A; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">View Task</a>
        <p style="margin-top: 30px;">Best regards,<br>The Asana Clone Team</p>
      </div>
    `,
    text: `Task Due Reminder: ${taskTitle} is due on ${new Date(dueDate).toLocaleDateString()}`
  }),

  // Password reset
  passwordReset: (userName, resetToken) => ({
    subject: 'Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #F06A6A;">Password Reset</h2>
        <p>Hi ${userName},</p>
        <p>We received a request to reset your password. Click the button below to reset it:</p>
        <a href="${process.env.CLIENT_URL}/reset-password/${resetToken}" style="background: #F06A6A; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request a password reset, please ignore this email.</p>
        <p style="margin-top: 30px;">Best regards,<br>The Asana Clone Team</p>
      </div>
    `,
    text: `Password Reset: Click this link to reset your password: ${process.env.CLIENT_URL}/reset-password/${resetToken}`
  })
};

// Helper functions to send specific emails
const sendWelcomeEmail = async (userEmail, userName) => {
  const template = emailTemplates.welcome(userName);
  return sendEmail({
    to: userEmail,
    subject: template.subject,
    html: template.html,
    text: template.text
  });
};

const sendTaskAssignedEmail = async (userEmail, userName, taskTitle, projectName, assignedBy) => {
  const template = emailTemplates.taskAssigned(userName, taskTitle, projectName, assignedBy);
  return sendEmail({
    to: userEmail,
    subject: template.subject,
    html: template.html,
    text: template.text
  });
};

const sendCommentNotification = async (userEmail, userName, taskTitle, commenterName, comment) => {
  const template = emailTemplates.commentAdded(userName, taskTitle, commenterName, comment);
  return sendEmail({
    to: userEmail,
    subject: template.subject,
    html: template.html,
    text: template.text
  });
};

const sendWorkspaceInvite = async (userEmail, userName, workspaceName, inviterName) => {
  const template = emailTemplates.workspaceInvite(userName, workspaceName, inviterName);
  return sendEmail({
    to: userEmail,
    subject: template.subject,
    html: template.html,
    text: template.text
  });
};

const sendTeamInvite = async (userEmail, userName, teamName, inviterName) => {
  const template = emailTemplates.teamInvite(userName, teamName, inviterName);
  return sendEmail({
    to: userEmail,
    subject: template.subject,
    html: template.html,
    text: template.text
  });
};

const sendTaskDueReminder = async (userEmail, userName, taskTitle, dueDate) => {
  const template = emailTemplates.taskDueReminder(userName, taskTitle, dueDate);
  return sendEmail({
    to: userEmail,
    subject: template.subject,
    html: template.html,
    text: template.text
  });
};

const sendPasswordResetEmail = async (userEmail, userName, resetToken) => {
  const template = emailTemplates.passwordReset(userName, resetToken);
  return sendEmail({
    to: userEmail,
    subject: template.subject,
    html: template.html,
    text: template.text
  });
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendTaskAssignedEmail,
  sendCommentNotification,
  sendWorkspaceInvite,
  sendTeamInvite,
  sendTaskDueReminder,
  sendPasswordResetEmail
};
