import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, List, Calendar, LayoutList, X } from "lucide-react";

type OnboardingStep = "role" | "tools" | "project" | "tasks" | "sections" | "layout" | "invite";

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<OnboardingStep>("role");
  const [role, setRole] = useState("");
  const [workFunctions, setWorkFunctions] = useState<string[]>([]);
  const [asanaUses, setAsanaUses] = useState<string[]>([]);
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [projectName, setProjectName] = useState("");
  const [tasks, setTasks] = useState<string[]>(["", "", ""]);
  const [sections, setSections] = useState<string[]>(["To do", "Doing", "Done"]);
  const [selectedLayout, setSelectedLayout] = useState("List");
  const [inviteEmails, setInviteEmails] = useState<string[]>(["", "", ""]);
  const [showSkipPopup, setShowSkipPopup] = useState(false);

  const roles = [
    "Team member / Individual contributor",
    "Manager",
    "Director",
    "Executive (e.g. VP or C-suite)",
    "Business owner",
    "Freelancer",
    "Student",
    "Other",
    "Prefer not to say"
  ];

  const functions = [
    "Administrative Assistant",
    "Communications",
    "Customer Experience",
    "Data or Analytics",
    "Design",
    "Education Professional",
    "Engineering",
    "Finance or Accounting",
    "Fundraising",
    "Healthcare Professional",
    "Human Resources",
    "Information Technology (IT)",
    "Legal",
    "Marketing",
    "Operations",
    "Product Management",
    "Project or Program Management",
    "Research and Development",
    "Sales",
    "Other",
    "Prefer not to say"
  ];

  const uses = [
    "Content calendar management",
    "Work intake",
    "Strategic planning",
    "Event planning",
    "Work review & approval",
    "Product or program launch",
    "Employee onboarding",
    "Campaign management",
    "Project management",
    "Other",
    "Prefer not to say"
  ];

  const tools = [
    { name: "Gmail", icon: "📧" },
    { name: "Google Drive", icon: "💾" },
    { name: "Microsoft OneDrive", icon: "☁️" },
    { name: "Microsoft Outlook", icon: "📨" },
    { name: "Microsoft Teams", icon: "👥" },
    { name: "Slack", icon: "💬" },
    { name: "Zoom", icon: "📹" },
    { name: "Dropbox", icon: "📦" },
    { name: "GitHub", icon: "🔧" },
    { name: "Figma", icon: "🎨" },
    { name: "Canva", icon: "🖼️" },
    { name: "Jira Cloud", icon: "📊" },
    { name: "Notion", icon: "📝" },
    { name: "Salesforce", icon: "💼" },
    { name: "Zendesk", icon: "🎫" },
    { name: "HubSpot", icon: "🚀" },
    { name: "Zapier", icon: "⚡" },
    { name: "Other", icon: "+" }
  ];

  const layouts = [
    { name: "List", icon: List, description: "List is great for tracking work." },
    { name: "Board", icon: LayoutList },
    { name: "Timeline", icon: Calendar },
    { name: "Calendar", icon: Calendar }
  ];

  const isRoleStepValid = role && workFunctions.length > 0 && asanaUses.length > 0;

  const getProgress = () => {
    const steps = ["role", "tools", "project", "tasks", "sections", "layout"];
    const currentIndex = steps.indexOf(step);
    return ((currentIndex + 1) / steps.length) * 100;
  };

  const toggleTool = (tool: string) => {
    setSelectedTools(prev =>
      prev.includes(tool) ? prev.filter(t => t !== tool) : [...prev, tool]
    );
  };

  const toggleWorkFunction = (func: string) => {
    setWorkFunctions(prev =>
      prev.includes(func) ? prev.filter(f => f !== func) : [...prev, func]
    );
  };

  const toggleAsanaUse = (use: string) => {
    setAsanaUses(prev =>
      prev.includes(use) ? prev.filter(u => u !== use) : [...prev, use]
    );
  };

  const updateTask = (index: number, value: string) => {
    const newTasks = [...tasks];
    newTasks[index] = value;
    setTasks(newTasks);
  };

  const updateSection = (index: number, value: string) => {
    const newSections = [...sections];
    newSections[index] = value;
    setSections(newSections);
  };

  const handleContinue = () => {
    if (step === "role") setStep("tools");
    else if (step === "tools") setStep("project");
    else if (step === "project") setStep("tasks");
    else if (step === "tasks") setStep("sections");
    else if (step === "sections") setStep("layout");
    else if (step === "layout") setStep("invite");
  };

  const handleBack = () => {
    if (step === "tools") setStep("role");
    else if (step === "project") setStep("tools");
    else if (step === "tasks") setStep("project");
    else if (step === "sections") setStep("tasks");
    else if (step === "layout") setStep("sections");
    else if (step === "invite") setStep("layout");
  };

  const updateInviteEmail = (index: number, value: string) => {
    const newEmails = [...inviteEmails];
    newEmails[index] = value;
    setInviteEmails(newEmails);
  };

  const canContinue = () => {
    if (step === "role") return isRoleStepValid;
    if (step === "tools") return selectedTools.length > 0;
    if (step === "project") return projectName.trim() !== "";
    if (step === "tasks") return tasks.some(t => t.trim() !== "");
    if (step === "sections") return sections.every(s => s.trim() !== "");
    return true;
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Form */}
      <div className="w-[420px] flex flex-col px-12 py-8">
        <div className="mb-8">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="14" cy="7" r="5" fill="#F06A6A"/>
            <circle cx="7" cy="18" r="5" fill="#F06A6A"/>
            <circle cx="21" cy="18" r="5" fill="#F06A6A"/>
          </svg>
        </div>

        {step !== "role" && (
          <div className="mb-4">
            <button onClick={handleBack} className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        )}

        {step !== "role" && step !== "tools" && (
          <Progress value={getProgress()} className="mb-8" />
        )}

        <div className="max-w-md mt-4">
          {/* Role Selection Step */}
          {step === "role" && (
            <>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                Tell us about your work
              </h1>
              <p className="text-muted-foreground mb-12">
                This will help us tailor Asana for you. We may also reach out to help you find the right Asana products for your team.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    What&apos;s your role?
                  </label>
                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger className="w-full border-border bg-background">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-border z-50">
                      {roles.map((r) => (
                        <SelectItem key={r} value={r}>
                          {r}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Which function best describes your work?
                  </label>
                  <Select>
                    <SelectTrigger className="w-full border-border bg-background h-auto min-h-[2.5rem]">
                      <div className="flex-1 text-left">
                        {workFunctions.length === 0 ? (
                          <span className="text-muted-foreground">Select functions</span>
                        ) : (
                          <span className="text-foreground">
                            {workFunctions.length === 1
                              ? workFunctions[0]
                              : `${workFunctions[0]}, and ${workFunctions.length - 1} more`}
                          </span>
                        )}
                      </div>
                    </SelectTrigger>
                    <SelectContent className="bg-background border-border z-50 max-h-80">
                      {functions.map((func) => (
                        <div
                          key={func}
                          className="flex items-center space-x-3 px-2 py-2.5 hover:bg-muted cursor-pointer"
                          onClick={(e) => {
                            e.preventDefault();
                            toggleWorkFunction(func);
                          }}
                        >
                          <div
                            className={`w-4 h-4 border-2 flex items-center justify-center ${
                              workFunctions.includes(func)
                                ? 'bg-primary border-primary'
                                : 'border-gray-300'
                            }`}
                          >
                            {workFunctions.includes(func) && (
                              <svg
                                className="w-3 h-3 text-white"
                                fill="none"
                                strokeLinecap="square"
                                strokeLinejoin="miter"
                                strokeWidth="2.5"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path d="M5 13l4 4L19 7"></path>
                              </svg>
                            )}
                          </div>
                          <span className="text-sm flex-1">{func}</span>
                        </div>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    What do you want to use Asana for?
                  </label>
                  <Select>
                    <SelectTrigger className="w-full border-border bg-background h-auto min-h-[2.5rem]">
                      <div className="flex-1 text-left">
                        {asanaUses.length === 0 ? (
                          <span className="text-muted-foreground">Select use cases</span>
                        ) : (
                          <span className="text-foreground">
                            {asanaUses.length === 1
                              ? asanaUses[0]
                              : `${asanaUses[0]}, and ${asanaUses.length - 1} more`}
                          </span>
                        )}
                      </div>
                    </SelectTrigger>
                    <SelectContent className="bg-background border-border z-50 max-h-80">
                      {uses.map((use) => (
                        <div
                          key={use}
                          className="flex items-center space-x-3 px-2 py-2.5 hover:bg-muted cursor-pointer"
                          onClick={(e) => {
                            e.preventDefault();
                            toggleAsanaUse(use);
                          }}
                        >
                          <div
                            className={`w-4 h-4 border-2 flex items-center justify-center ${
                              asanaUses.includes(use)
                                ? 'bg-primary border-primary'
                                : 'border-gray-300'
                            }`}
                          >
                            {asanaUses.includes(use) && (
                              <svg
                                className="w-3 h-3 text-white"
                                fill="none"
                                strokeLinecap="square"
                                strokeLinejoin="miter"
                                strokeWidth="2.5"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path d="M5 13l4 4L19 7"></path>
                              </svg>
                            )}
                          </div>
                          <span className="text-sm flex-1">{use}</span>
                        </div>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  disabled={!canContinue()}
                  onClick={handleContinue}
                  className="font-semibold"
                >
                  Continue
                </Button>
              </div>
            </>
          )}

          {/* Tools Selection Step */}
          {step === "tools" && (
            <>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                What tools do you use?
              </h1>
              <p className="text-muted-foreground mb-8">
                Asana connects to tools your team uses every day. Understanding your tools will help us tailor Asana and help you find the right features for your team.
              </p>

              <div className="flex flex-wrap gap-2 mb-8">
                {tools.map((tool) => (
                  <button
                    key={tool.name}
                    onClick={() => toggleTool(tool.name)}
                    className={`px-4 py-2 rounded-md border text-sm font-medium transition-colors ${
                      selectedTools.includes(tool.name)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background border-border hover:border-foreground"
                    }`}
                  >
                    <span className="mr-2">{tool.icon}</span>
                    {tool.name}
                  </button>
                ))}
              </div>

              <Button
                disabled={!canContinue()}
                onClick={handleContinue}
                className="font-semibold"
              >
                Continue
              </Button>
            </>
          )}

          {/* Project Setup Step - Combined with Tasks */}
          {step === "project" && (
            <>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Let&apos;s set up your first project
              </h1>
              <p className="text-muted-foreground mb-8">
                What&apos;s something you and your team are currently working on?
              </p>

              <div className="space-y-6">
                <Input
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g. Cross-functional project plan"
                  className="w-full"
                />

                <Button
                  disabled={!canContinue()}
                  onClick={handleContinue}
                  className="font-semibold"
                >
                  Continue
                </Button>
              </div>
            </>
          )}

          {/* Tasks Input Step */}
          {step === "tasks" && (
            <>
              <h1 className="text-2xl font-bold text-foreground mb-8">
                What are a few tasks that you have to do for {projectName}?
              </h1>

              <div className="space-y-4 mb-8">
                {tasks.map((task, index) => (
                  <Input
                    key={index}
                    value={task}
                    onChange={(e) => updateTask(index, e.target.value)}
                    placeholder={
                      index === 0 ? "e.g. Draft project brief" :
                      index === 1 ? "e.g. Schedule kickoff meeting" :
                      "e.g. Share timeline with teammates"
                    }
                    className="w-full"
                  />
                ))}
              </div>

              <Button
                disabled={!canContinue()}
                onClick={handleContinue}
                className="font-semibold"
              >
                Continue
              </Button>
            </>
          )}

          {/* Sections/Grouping Step */}
          {step === "sections" && (
            <>
              <h1 className="text-2xl font-bold text-foreground mb-8">
                How would you group these tasks into sections or stages?
              </h1>

              <div className="space-y-4 mb-8">
                {sections.map((section, index) => (
                  <Input
                    key={index}
                    value={section}
                    onChange={(e) => updateSection(index, e.target.value)}
                    className="w-full"
                  />
                ))}
              </div>

              <Button
                disabled={!canContinue()}
                onClick={handleContinue}
                className="font-semibold"
              >
                Continue
              </Button>
            </>
          )}

          {/* Layout Selection Step */}
          {step === "layout" && (
            <>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                What layout works best for this project? You can change this later.
              </h1>

              <div className="grid grid-cols-2 gap-4 mb-4 mt-8">
                {layouts.map((layout) => {
                  const Icon = layout.icon;
                  return (
                    <button
                      key={layout.name}
                      onClick={() => setSelectedLayout(layout.name)}
                      className={`p-6 rounded-lg border-2 transition-all ${
                        selectedLayout === layout.name
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-foreground"
                      }`}
                    >
                      <Icon className="w-8 h-8 mb-2 text-primary" />
                      <div className="text-sm font-semibold">{layout.name}</div>
                    </button>
                  );
                })}
              </div>

              {selectedLayout === "List" && (
                <p className="text-sm text-muted-foreground mb-8">💡 {layouts[0].description}</p>
              )}

              <Button className="font-semibold" onClick={handleContinue}>
                Continue
              </Button>
            </>
          )}

          {/* Invite Teammates Step */}
          {step === "invite" && (
            <>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Invite a teammate to try Asana together
              </h1>
              <p className="text-muted-foreground mb-8">
                You can start small by inviting a trusted teammate to learn how Asana works with you.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Email address
                  </label>
                  {inviteEmails.map((email, index) => (
                    <Input
                      key={index}
                      value={email}
                      onChange={(e) => updateInviteEmail(index, e.target.value)}
                      placeholder={index === 0 ? "@sst.scaler.com" : "Teammate's email"}
                      className="w-full mb-3"
                      type="email"
                    />
                  ))}
                </div>

                <Button
                  className="font-semibold"
                  onClick={() => navigate('/dashboard')}
                >
                  Take me to my project
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right Side - Preview */}
      <div className="flex-1 bg-gradient-to-br from-pink-50 to-pink-100 flex items-start justify-start p-12 pt-20">
        {step === "role" && (
          <div className="w-full max-w-md">
            <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="100" y="180" width="200" height="140" rx="12" fill="white" stroke="#F06A6A" strokeWidth="2"/>
              <path d="M 100 200 L 300 200" stroke="#F06A6A" strokeWidth="2"/>
              <rect x="120" y="140" width="70" height="90" rx="8" fill="white" stroke="#F06A6A" strokeWidth="2" transform="rotate(-10 155 185)"/>
              <rect x="200" y="135" width="70" height="95" rx="8" fill="white" stroke="#F06A6A" strokeWidth="2" transform="rotate(5 235 182)"/>
              <circle cx="140" cy="165" r="8" fill="#F06A6A"/>
              <rect x="155" y="175" width="25" height="4" rx="2" fill="#F06A6A"/>
              <rect x="155" y="185" width="35" height="4" rx="2" fill="#FFB4B4"/>
              <circle cx="220" cy="160" r="8" fill="#F06A6A"/>
              <rect x="235" y="170" width="25" height="4" rx="2" fill="#F06A6A"/>
              <rect x="235" y="180" width="30" height="4" rx="2" fill="#FFB4B4"/>
              <rect x="180" y="280" width="12" height="25" fill="#F06A6A"/>
              <rect x="195" y="270" width="12" height="35" fill="#FFB4B4"/>
              <rect x="210" y="260" width="12" height="45" fill="#F06A6A"/>
            </svg>
          </div>
        )}

        {step === "tools" && (
          <div className="w-full max-w-md">
            <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="80" y="120" width="100" height="100" rx="12" fill="white" stroke="#F06A6A" strokeWidth="2"/>
              <rect x="220" y="120" width="100" height="100" rx="12" fill="white" stroke="#F06A6A" strokeWidth="2"/>
              <rect x="80" y="260" width="100" height="100" rx="12" fill="white" stroke="#F06A6A" strokeWidth="2"/>
              <rect x="220" y="260" width="100" height="100" rx="12" fill="white" stroke="#F06A6A" strokeWidth="2"/>
              <circle cx="130" cy="170" r="20" fill="#F06A6A"/>
              <circle cx="270" cy="170" r="20" fill="#FFB4B4"/>
              <circle cx="130" cy="310" r="20" fill="#F06A6A"/>
              <circle cx="270" cy="310" r="20" fill="#FFB4B4"/>
            </svg>
          </div>
        )}

        {step === "project" && (
          <div className="relative w-full max-w-3xl group">
            {/* Tooltip - shows on hover */}
            <div className="absolute -top-10 left-0 bg-gray-800 text-white text-xs px-3 py-2 rounded shadow-lg z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              This is a preview of your sample project
              <div className="absolute bottom-[-6px] left-4 w-3 h-3 bg-gray-800 transform rotate-45"></div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              {/* Browser Chrome */}
              <div className="flex gap-2 mb-12">
                <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                <div className="w-3 h-3 rounded-full bg-gray-300"></div>
              </div>

              {/* Project Icon and Name Bar */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-teal-400 rounded flex items-center justify-center flex-shrink-0">
                  <List className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1 h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        )}

        {(step === "tasks" || step === "sections" || step === "layout" || step === "invite") && (
          <div className="relative w-full max-w-5xl group">
            {/* Tooltip - shows on hover */}
            <div className="absolute -top-10 left-0 bg-gray-800 text-white text-xs px-3 py-2 rounded shadow-lg z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              This is a preview of your sample project
              <div className="absolute bottom-[-6px] left-4 w-3 h-3 bg-gray-800 transform rotate-45"></div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 overflow-auto max-h-[calc(100vh-200px)]">
              {/* Browser Chrome */}
              <div className="flex gap-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                <div className="w-3 h-3 rounded-full bg-gray-300"></div>
              </div>

            {/* Project Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-teal-400 rounded flex items-center justify-center">
                  <List className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-bold">{projectName || "Project name"}</h2>
              </div>
              {(step === "layout" || step === "invite") && (
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 text-xs">🔔</span>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 text-xs">?</span>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center">
                    <span className="text-pink-600 text-xs">👤</span>
                  </div>
                </div>
              )}
            </div>

            {(step === "layout" || step === "invite") && (
              <div className="flex gap-6 mb-6 border-b">
                <button
                  className={`pb-2 text-sm font-medium ${selectedLayout === "List" ? "border-b-2 border-blue-600 text-blue-600" : "text-muted-foreground"}`}
                  onClick={() => setSelectedLayout("List")}
                >
                  List
                </button>
                <button
                  className={`pb-2 text-sm font-medium ${selectedLayout === "Board" ? "border-b-2 border-blue-600 text-blue-600" : "text-muted-foreground"}`}
                  onClick={() => setSelectedLayout("Board")}
                >
                  Board
                </button>
                <button
                  className={`pb-2 text-sm font-medium ${selectedLayout === "Timeline" ? "border-b-2 border-blue-600 text-blue-600" : "text-muted-foreground"}`}
                  onClick={() => setSelectedLayout("Timeline")}
                >
                  Timeline
                </button>
                <button
                  className={`pb-2 text-sm font-medium ${selectedLayout === "Calendar" ? "border-b-2 border-blue-600 text-blue-600" : "text-muted-foreground"}`}
                  onClick={() => setSelectedLayout("Calendar")}
                >
                  Calendar
                </button>
              </div>
            )}

            {/* Tasks Preview - Simple List for tasks step */}
            {step === "tasks" && (
              <div className="space-y-2">
                {tasks.filter(t => t.trim()).map((task, index) => (
                  <div key={index} className="flex items-center gap-3 py-2 border-b">
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                    <span className="text-sm">{task}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Sections Preview */}
            {step === "sections" && (
              <div className="space-y-4">
                {sections.map((section, sectionIndex) => {
                  // Distribute tasks more evenly across sections
                  const sectionTasks = tasks.filter(t => t.trim());
                  const taskIndex = sectionIndex % sectionTasks.length;
                  return (
                    <div key={sectionIndex}>
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                          <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        <h3 className="font-semibold">{section}</h3>
                      </div>
                      {sectionTasks.length > 0 && (
                        <div className="flex items-center gap-3 py-2 border-b ml-6">
                          <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                          <span className="text-sm">{sectionTasks[taskIndex]}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Layout Previews */}
            {(step === "layout" || step === "invite") && selectedLayout === "List" && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-2 font-semibold text-gray-600">Task name</th>
                      <th className="text-left py-2 px-2 font-semibold text-gray-600">Assignee</th>
                      <th className="text-left py-2 px-2 font-semibold text-gray-600">Due date</th>
                      <th className="text-left py-2 px-2 font-semibold text-gray-600">Priority</th>
                      <th className="text-left py-2 px-2 font-semibold text-gray-600">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sections.map((section, sectionIndex) => {
                      const sectionTasks = tasks.filter(t => t.trim()).slice(sectionIndex, sectionIndex + 1);
                      return (
                        <React.Fragment key={sectionIndex}>
                          <tr className="bg-gray-50">
                            <td colSpan={5} className="py-2 px-2">
                              <div className="flex items-center gap-2">
                                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                                  <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="2"/>
                                </svg>
                                <span className="font-semibold">{section}</span>
                              </div>
                            </td>
                          </tr>
                          {sectionTasks.map((task, taskIndex) => (
                            <tr key={taskIndex} className="border-b hover:bg-gray-50">
                              <td className="py-3 px-2">
                                <div className="flex items-center gap-2">
                                  <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                                  <span>{task}</span>
                                </div>
                              </td>
                              <td className="py-3 px-2">
                                <div className="w-6 h-6 rounded-full bg-gray-300"></div>
                              </td>
                              <td className="py-3 px-2 text-xs text-gray-600">
                                {sectionIndex === 0 ? "Today - 4 Nov" : sectionIndex === 1 ? "3 - 5 Nov" : "4 - 8 Nov"}
                              </td>
                              <td className="py-3 px-2">
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  sectionIndex === 0 ? "bg-green-100 text-green-700" :
                                  sectionIndex === 1 ? "bg-orange-100 text-orange-700" :
                                  "bg-pink-100 text-pink-700"
                                }`}>
                                  {sectionIndex === 0 ? "Low" : sectionIndex === 1 ? "Medium" : "High"}
                                </span>
                              </td>
                              <td className="py-3 px-2">
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  sectionIndex === 0 ? "bg-teal-100 text-teal-700" :
                                  sectionIndex === 1 ? "bg-yellow-100 text-yellow-700" :
                                  "bg-red-100 text-red-700"
                                }`}>
                                  {sectionIndex === 0 ? "On track" : sectionIndex === 1 ? "At risk" : "Off track"}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Board Layout */}
            {(step === "layout" || step === "invite") && selectedLayout === "Board" && (
              <div className="flex gap-4 overflow-x-auto pb-4">
                {sections.map((section, sectionIndex) => {
                  const sectionTasks = tasks.filter(t => t.trim()).slice(sectionIndex, sectionIndex + 1);
                  return (
                    <div key={sectionIndex} className="flex-shrink-0 w-72 bg-gray-50 rounded-lg p-3">
                      <h3 className="font-semibold mb-3">{section}</h3>
                      <div className="space-y-2">
                        {sectionTasks.map((task, taskIndex) => (
                          <div key={taskIndex} className="bg-white p-3 rounded shadow-sm border">
                            <div className="flex items-start gap-2 mb-2">
                              <div className="w-4 h-4 rounded border-2 border-gray-300 mt-0.5"></div>
                              <span className="text-sm flex-1">{task}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-3">
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                sectionIndex === 0 ? "bg-green-100 text-green-700" :
                                sectionIndex === 1 ? "bg-orange-100 text-orange-700" :
                                "bg-pink-100 text-pink-700"
                              }`}>
                                {sectionIndex === 0 ? "Low" : sectionIndex === 1 ? "Medium" : "High"}
                              </span>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                sectionIndex === 0 ? "bg-teal-100 text-teal-700" :
                                sectionIndex === 1 ? "bg-yellow-100 text-yellow-700" :
                                "bg-red-100 text-red-700"
                              }`}>
                                {sectionIndex === 0 ? "On track" : sectionIndex === 1 ? "At risk" : "Off track"}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <div className="w-5 h-5 rounded-full bg-gray-300"></div>
                              <span className="text-xs text-gray-600">
                                {sectionIndex === 0 ? "Today - 4 Nov" : sectionIndex === 1 ? "3 - 5 Nov" : "4 - 8 Nov"}
                              </span>
                            </div>
                          </div>
                        ))}
                        {/* Placeholder cards for empty sections */}
                        {sectionTasks.length === 0 && (
                          <>
                            <div className="bg-gray-100 p-3 rounded border-2 border-dashed border-gray-300 h-20"></div>
                            <div className="bg-gray-100 p-3 rounded border-2 border-dashed border-gray-300 h-20"></div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Timeline Layout */}
            {(step === "layout" || step === "invite") && selectedLayout === "Timeline" && (
              <div className="overflow-x-auto">
                <div className="min-w-[800px]">
                  {/* Timeline Header */}
                  <div className="flex border-b mb-4">
                    <div className="w-32 py-2 text-xs font-semibold text-gray-600">October</div>
                    <div className="flex-1 grid grid-cols-10 border-l">
                      {[27, 28, 29, 30, 31].map(day => (
                        <div key={day} className="text-center text-xs text-gray-600 py-2 border-r">{day}</div>
                      ))}
                    </div>
                    <div className="flex-1 grid grid-cols-10 border-l">
                      <div className="col-span-2 text-center text-xs font-semibold text-gray-600 py-2">November</div>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(day => (
                        <div key={day} className="text-center text-xs text-gray-600 py-2 border-r">{day}</div>
                      ))}
                    </div>
                  </div>

                  {/* Sections */}
                  <div className="space-y-8">
                    {sections.map((section, sectionIndex) => {
                      const sectionTasks = tasks.filter(t => t.trim()).slice(sectionIndex, sectionIndex + 1);
                      return (
                        <div key={sectionIndex}>
                          <h3 className="font-semibold mb-2">{section}</h3>
                          {sectionTasks.map((task, taskIndex) => (
                            <div key={taskIndex} className="relative h-12 mb-2">
                              <div className={`absolute top-2 h-8 rounded flex items-center px-3 ${
                                sectionIndex === 0 ? "bg-green-400 left-[45%] w-[15%]" :
                                sectionIndex === 1 ? "bg-orange-400 left-[50%] w-[20%]" :
                                "bg-gray-400 left-[58%] w-[25%]"
                              }`}>
                                <div className="flex items-center gap-2 text-white text-xs">
                                  <div className="w-5 h-5 rounded-full bg-white/30 flex-shrink-0"></div>
                                  <span className="truncate">{task}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                    {/* Sections Labels */}
                    <div className="space-y-4 mt-6">
                      <div className="font-semibold">Doing</div>
                      <div className="font-semibold">Done</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Calendar Layout */}
            {(step === "layout" || step === "invite") && selectedLayout === "Calendar" && (
              <div className="overflow-x-auto">
                <div className="min-w-[800px]">
                  {/* Month Header */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">November</h3>
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-px bg-gray-200">
                    {/* Day Headers */}
                    {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                      <div key={day} className="bg-gray-50 p-2 text-xs font-semibold text-gray-600 text-center">
                        {day}
                      </div>
                    ))}

                    {/* Calendar Days */}
                    {[...Array(7 * 5)].map((_, index) => {
                      const dayNum = index - 5; // Start from Sunday before Nov 1
                      const isCurrentMonth = dayNum >= 0 && dayNum < 30;
                      const displayDay = isCurrentMonth ? dayNum + 1 : '';

                      // Task assignments based on your screenshot
                      let taskForDay = null;
                      let taskColor = '';

                      if (dayNum === 1) { // Nov 2 - egvf
                        taskForDay = tasks[0];
                        taskColor = 'bg-green-400';
                      } else if (dayNum === 2) { // Nov 3 - grwsab start
                        taskForDay = tasks[1];
                        taskColor = 'bg-orange-400';
                      } else if (dayNum === 4) { // Nov 5 - gwers start
                        taskForDay = tasks[2];
                        taskColor = 'bg-gray-500';
                      }

                      return (
                        <div key={index} className={`bg-white min-h-24 p-2 ${!isCurrentMonth ? 'bg-gray-50' : ''}`}>
                          <div className="text-xs text-gray-600 mb-1">{displayDay}</div>
                          {taskForDay && (
                            <div className={`${taskColor} text-white text-xs rounded p-1.5 mb-1`}>
                              <div className="flex items-center gap-1">
                                <div className="w-4 h-4 rounded-full bg-white/40 flex-shrink-0"></div>
                                <span className="truncate">{taskForDay}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
